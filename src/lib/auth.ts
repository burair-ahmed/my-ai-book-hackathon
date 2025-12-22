import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: "https://ep-damp-fire-adc4z1rc.neonauth.c-2.us-east-1.aws.neon.tech/neondb/auth"
})
