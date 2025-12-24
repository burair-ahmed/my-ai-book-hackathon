import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: "https://ep-damp-fire-adc4z1rc.neonauth.c-2.us-east-1.aws.neon.tech/neondb/auth",
  fetchOptions: {
    // We omit credentials to rely solely on the Authorization header for production cross-origin stability
    credentials: "omit",
    onRequest: (request: any) => {
      // Manually inject the session token into the request headers for internal better-auth calls
      // This ensures /get-session and /token always have the necessary credentials in cross-origin environments
      const token = typeof window !== "undefined" ? localStorage.getItem("better-auth.session_token") : null;
      if (token && request.headers) {
        if (typeof request.headers.set === 'function') {
          request.headers.set("Authorization", `Bearer ${token}`);
        } else {
          request.headers["Authorization"] = `Bearer ${token}`;
        }
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
