import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: "https://ep-damp-fire-adc4z1rc.neonauth.c-2.us-east-1.aws.neon.tech/neondb/auth",
  fetchOptions: {
    credentials: "include",
    onRequest: (context: any) => {
      const url = context.request?.url || context.url || "";
      const urlStr = url.toString();
      
      // 1. Skip injection for bootstrap/handshake endpoints
      if (
        urlStr.includes("/sign-in") || 
        urlStr.includes("/sign-up") || 
        urlStr.includes("/social-login") ||
        urlStr.includes("/callback")
      ) {
        return;
      }

      // 2. Determine which token to use based on the target URL
      const isAuthRequest = urlStr.includes("neonauth.c-2.us-east-1.aws.neon.tech");
      const sessionToken = typeof window !== "undefined" ? localStorage.getItem("better-auth.session_token") : null;
      const signedJwt = typeof window !== "undefined" ? localStorage.getItem("better-auth.jwt") : null;

      // For Auth endpoints, we must use the Opaque Session Token
      // For our backend API, we use the Signed JWT
      const token = isAuthRequest ? sessionToken : signedJwt;
      
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
  auth: {
    persistSession: true,
    storagePrefix: "better-auth",
  }
})
