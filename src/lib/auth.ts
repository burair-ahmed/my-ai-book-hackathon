import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: "https://ep-damp-fire-adc4z1rc.neonauth.c-2.us-east-1.aws.neon.tech/neondb/auth",
  fetchOptions: {
    // We use "include" because the server supports credentials and it's required for consistent session management
    credentials: "include",
    onRequest: (context: any) => {
      // skip header injection for endpoints that shouldn't have it (authentication handshake)
      const url = context.request?.url || context.url || "";
      const urlStr = url.toString();
      
      if (
        urlStr.includes("/sign-in") || 
        urlStr.includes("/sign-up") || 
        urlStr.includes("/social-login") ||
        urlStr.includes("/sign-out") ||
        urlStr.includes("/callback")
      ) {
        return;
      }

      // Manual token fallback for third-party cookie blocked environments
      const token = typeof window !== "undefined" ? localStorage.getItem("better-auth.session_token") : null;
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
  // Force session persistence into localStorage
  auth: {
    persistSession: true,
    storagePrefix: "better-auth",
  }
})
