import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: "https://ep-damp-fire-adc4z1rc.neonauth.c-2.us-east-1.aws.neon.tech/neondb/auth",
  fetchOptions: {
    // We ignore cookies entirely to fix the "ghost login" and cross-origin 403 issues.
    // Auth is now purely driven by the Authorization header.
    credentials: "omit",
    onRequest: (context: any) => {
      const url = context.request?.url || context.url || "";
      const urlStr = url.toString();
      
      // Skip for primary handshake/bootstrap requests
      if (
        urlStr.includes("/sign-in") || 
        urlStr.includes("/sign-up") || 
        urlStr.includes("/social-login") ||
        urlStr.includes("/callback")
      ) {
        return;
      }

      const isAuthServer = urlStr.includes("neonauth.c-2.us-east-1.aws.neon.tech");
      
      // Retrieve both tokens from storage
      const sessionToken = typeof window !== "undefined" ? localStorage.getItem("better-auth.session_token") : null;
      const signedJwt = typeof window !== "undefined" ? localStorage.getItem("better-auth.jwt") : null;

      // Swap token based on target: Session Token for Neon, Signed JWT for Backend
      const token = isAuthServer ? sessionToken : signedJwt;
      
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
    // EXPLICIT STORAGE: This forces the session_token into localStorage instead of cookies.
    storage: {
      getItem: (key: string) => typeof window !== "undefined" ? localStorage.getItem(key) : null,
      setItem: (key: string, value: string) => {
        if (typeof window !== "undefined") localStorage.setItem(key, value);
      },
      removeItem: (key: string) => {
        if (typeof window !== "undefined") localStorage.removeItem(key);
      },
    }
  }
})
