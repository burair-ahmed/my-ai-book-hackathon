import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: "https://ep-damp-fire-adc4z1rc.neonauth.c-2.us-east-1.aws.neon.tech/neondb/auth",
  fetchOptions: {
    // We omit credentials to rely solely on the Authorization header for production cross-origin stability
    credentials: "omit",
  },
  plugins: [
    jwtClient(),
  ],
  // Force session persistence into localStorage and instruct the client to use headers
  auth: {
    persistSession: true,
    storagePrefix: "better-auth",
    // We'll manually handle the Authorization header in a custom fetch wrapper or within AuthProvider
  }
})
