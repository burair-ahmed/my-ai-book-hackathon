import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.NEON_AUTH_URL || "https://ep-damp-fire-adc4z1rc.neonauth.c-2.us-east-1.aws.neon.tech/neondb/auth",
  fetchOptions: {
    credentials: "omit", // Using token-based auth, neon auth handles cookies internally
  },
  plugins: [
    jwtClient(),
  ]
})
