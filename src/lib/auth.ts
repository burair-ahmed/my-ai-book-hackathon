import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: "https://ep-damp-fire-adc4z1rc.neonauth.c-2.us-east-1.aws.neon.tech/neondb/auth",
  fetchOptions: {
    // We strictly use "omit" to bypass standard cookie behavior.
    // This solves the 403 Forbidden on logout and the "ghost login" on refresh.
    credentials: "omit",
    onResponse: (context: any) => {
      const data = context.data;
      const url = (context.request?.url || "").toString();
      
      if (data) {
        console.log(`[Auth] Capturing response for: ${url.split('/').pop()}`);
        
        // Capture session token
        const tokenToken = data.token || data.session?.token || data.sessionToken;
        if (tokenToken) {
          if (url.includes("/token")) {
            localStorage.setItem("better-auth.jwt", tokenToken);
            console.log("[Auth] Captured JWT from response");
          } else if (url.includes("neonauth")) {
            localStorage.setItem("better-auth.session_token", tokenToken);
            console.log("[Auth] Captured Session Token from response");
          }
        }
        
        // Capture user object
        const userData = data.user;
        if (userData) {
          localStorage.setItem("better-auth.user", JSON.stringify(userData));
          console.log("[Auth] Captured User for hydration");
        }
      }
    },
    onRequest: (context: any) => {
      const url = (context.request?.url || context.url || "").toString();
      
      if (url.includes("/sign-in") || url.includes("/sign-up") || url.includes("/social-login") || url.includes("/callback")) {
        return;
      }

      const isAuthServer = url.includes("neonauth.c-2.us-east-1.aws.neon.tech");
      const isHuggingFaceApi = url.includes("hf.space/api");
      
      if (isAuthServer || isHuggingFaceApi) {
        const sessionToken = typeof window !== "undefined" ? 
          (localStorage.getItem("better-auth.session_token") || localStorage.getItem("session_token")) : null;
        const signedJwt = typeof window !== "undefined" ? 
          (localStorage.getItem("better-auth.jwt") || localStorage.getItem("jwt")) : null;
        
        const token = isAuthServer ? sessionToken : signedJwt;
        
        if (token) {
          console.log(`[Auth] Injecting token into: ${url.substring(0, 50)}...`);
          
          // Initialize headers if missing
          if (!context.options) context.options = {};
          if (!context.options.headers) context.options.headers = {};
          
          // Use standard Authorization header ONLY to avoid CORS preflight failures
          context.options.headers["Authorization"] = `Bearer ${token}`;
          console.log(`[Auth] Injected Authorization header`);

          // Sync back to context.headers if needed by better-fetch
          if (context.headers && typeof context.headers.set === 'function') {
            context.headers.set("Authorization", `Bearer ${token}`);
          }
        }
      }
    },
  },
  plugins: [
    jwtClient(),
  ],
  auth: {
    persistSession: true,
    storagePrefix: "better-auth",
    storage: {
      getItem: (key: string) => (typeof window !== "undefined" ? localStorage.getItem(key) : null),
      setItem: (key: string, value: string) => {
        if (typeof window !== "undefined") {
          localStorage.setItem(key, value);
          // console.log(`[Auth] storage.setItem: ${key}`);
        }
      },
      removeItem: (key: string) => {
        if (typeof window !== "undefined") localStorage.removeItem(key);
      },
    },
  }
})
