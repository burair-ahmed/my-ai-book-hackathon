import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: "https://ep-damp-fire-adc4z1rc.neonauth.c-2.us-east-1.aws.neon.tech/neondb/auth",
  fetchOptions: {
    // We use "include" because the server supports credentials and it's required for consistent session management
    credentials: "include",
    onRequest: (context: any) => {
      // Manual token fallback for third-party cookie blocked environments
      const token = typeof window !== "undefined" ? localStorage.getItem("better-auth.session_token") : null;
      if (token) {
        // Try all possible places better-fetch/better-auth might store headers
        const headers = context.headers || context.options?.headers || {};
        if (typeof headers.set === 'function') {
          headers.set("Authorization", `Bearer ${token}`);
        } else {
          headers["Authorization"] = `Bearer ${token}`;
        }
        
        // Ensure the headers are back in the context
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
