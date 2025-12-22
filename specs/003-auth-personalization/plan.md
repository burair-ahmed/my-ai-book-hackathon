# Implementation Plan: Auth & Personalization

## Technical Context
We are using a split architecture:
- **Frontend**: Docusaurus (React/TSX) hosted on GitHub Pages.
- **Backend**: FastAPI (Python) hosted on Hugging Face.
- **Database**: Neon Serverless Postgres.
- **Auth**: [Better Auth](https://www.better-auth.com/) via [Neon Auth](https://neon.tech/docs/guides/neon-auth).

## Proposed Changes

### 1. Database & Provisioning
- Use `provision_neon_auth` to set up the authentication schema.
- Create a supplemental `user_profiles` table linked to `neon_auth.users` to store the software/hardware background answers.

### 2. Frontend (Docusaurus)
- **Dependencies**: `better-auth`, `@better-auth/react`.
- **Logic**: 
  - Initialize `authClient` in a common utility.
  - Create a `AuthModal` component (Glassmorphism design).
  - Modify `ChatBot.tsx` to send the `userId` or `sessionToken` to the backend.

### 3. Backend (FastAPI)
- **Auth Verification**: Add a middleware or dependency to verify the session token from Better Auth (using the Neon Auth JWKS).
- **Personalization Logic**:
  - In `backend/src/api/chat.py`, fetch the user's profile based on the authenticated context.
  - Append the user's background to the `persona` prompt in `gemini.py`.

## Verification Plan

### Automated Tests
- Script to simulate a user login and verify a response is "personalized" (checking for specific keywords based on profile).

### Manual Verification
- Sign up with "Arduino" background, ask a question, and verify the output contains C++/Arduino specific advice.
- Sign up with "ROS 2" background, verify the output focuses on `colcon` and `rclcpp`.
