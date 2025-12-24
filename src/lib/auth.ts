import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: "https://ep-damp-fire-adc4z1rc.neonauth.c-2.us-east-1.aws.neon.tech/neondb/auth",
  fetchOptions: {
    // We strictly use "omit" to avoid CSRF issues and rely 100% on the Authorization header
    credentials: "omit",
    onRequest: (context: any) => {
      // skip header injection for handshake endpoints that definitively don't have a token yet
      const url = context.request?.url || context.url || "";
      const urlStr = url.toString();
      
      if (
        urlStr.includes("/sign-in") || 
        urlStr.includes("/sign-up") || 
        urlStr.includes("/social-login") ||
        urlStr.includes("/callback")
      ) {
        return;
      }

      // Explicitly pull the session token from localStorage
      // better-auth-react saves it under ${storagePrefix}.session_token
      const token = typeof window !== "undefined" ? localStorage.getItem("better-auth.session_token") : null;
      
      if (token) {
        const headers = context.headers || context.options?.headers || {};
        const authHeader = `Bearer ${token}`;
        
        if (typeof headers.set === 'function') {
          headers.set("Authorization", authHeader);
        } else {
          headers["Authorization"] = authHeader;
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
