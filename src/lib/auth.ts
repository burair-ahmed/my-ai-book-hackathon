import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: "https://ep-damp-fire-adc4z1rc.neonauth.c-2.us-east-1.aws.neon.tech/neondb/auth",
  fetchOptions: {
    // Instead of cookies, we will rely on manual header injection if needed
    // or Better Auth's internal handling of localStorage for tokens
    credentials: "omit", 
  },
  plugins: [
    jwtClient(),
  ],
  // Explicitly tell the client to use headers for cross-origin reliability
  auth: {
    persistSession: true,
    storagePrefix: "better-auth",
  }
})
