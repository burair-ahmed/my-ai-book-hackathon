import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: "https://ep-damp-fire-adc4z1rc.neonauth.c-2.us-east-1.aws.neon.tech/neondb/auth",
  fetchOptions: {
    // We use "include" to allow the browser to manage session cookies where possible
    credentials: "include",
    onRequest: (context: any) => {
      const url = context.request?.url || context.url || "";
      const urlStr = url.toString();
      
      // Handshake endpoints should always be clean
      if (
        urlStr.includes("/sign-in") || 
        urlStr.includes("/sign-up") || 
        urlStr.includes("/social-login") ||
        urlStr.includes("/callback")
      ) {
        return;
      }

      // If we have a stored JWT, inject it as a fallback for cross-origin/third-party blocked scenarios
      const token = typeof window !== "undefined" ? localStorage.getItem("better-auth.jwt") : null;
      
      if (token) {
        const headers = context.headers || context.options?.headers || {};
        if (typeof headers.set === 'function') {
          headers.set("Authorization", `Bearer ${token}`);
        } else {
          headers["Authorization"] = `Bearer ${token}`;
        }
        
        if (context.headers) context.headers = headers;
        if (context.options) context.options.headers = headers;
      }
    },
  },
  plugins: [
    jwtClient(),
  ],
  auth: {
    // This persists the session metadata, but we manually persist the JWT for the header fallback
    persistSession: true,
    storagePrefix: "better-auth",
  }
})
