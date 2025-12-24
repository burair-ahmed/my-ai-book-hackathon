import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: "https://ep-damp-fire-adc4z1rc.neonauth.c-2.us-east-1.aws.neon.tech/neondb/auth",
  fetchOptions: {
    // Rely on standard cookies for the Auth server communication
    credentials: "include",
    onRequest: (context: any) => {
      const url = context.request?.url || context.url || "";
      const urlStr = url.toString();
      
      // 1. Determine if this is our backend API vs the Neon Auth server
      const isOurApi = urlStr.includes("hf.space/api");
      
      // 2. ONLY inject headers for our API. 
      // Handshake and Session management with Neon is handled via cookies to avoid 403/CSRF conflicts.
      if (isOurApi) {
        const token = typeof window !== "undefined" ? localStorage.getItem("better-auth.jwt") : null;
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
