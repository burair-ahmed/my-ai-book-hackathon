import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: "https://ep-damp-fire-adc4z1rc.neonauth.c-2.us-east-1.aws.neon.tech/neondb/auth",
  fetchOptions: {
    credentials: "include", // Required for cross-origin session management (GitHub Pages to Neon)
  },
  plugins: [
    jwtClient(),
  ]
})
