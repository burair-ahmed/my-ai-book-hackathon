# Tasks: Auth & Personalization

## 1. Foundation & Infrastructure
- [x] Provision Neon Auth using `provision_neon_auth` <!-- id: 0 -->
- [x] Create `user_profiles` table in Neon Postgres <!-- id: 1 -->
- [/] Set up environment variables locally and on Hugging Face (`AUTH_SECRET`, etc.) <!-- id: 2 -->

## 2. Backend Integration
- [x] Implement session verification middleware/dependency in FastAPI <!-- id: 3 -->
- [x] Create `/api/profile` endpoint to save/update personalization data <!-- id: 4 -->
- [x] Modify `/api/chat` to retrieve user profile and inject into AI context <!-- id: 5 -->

## 3. Frontend Development
- [x] Install `better-auth` and `@better-auth/react` <!-- id: 6 -->
- [x] Configure `authClient` in `src/lib/auth.ts` <!-- id: 7 -->
- [x] Implement `SignupForm` with multi-step background questionnaire <!-- id: 8 -->
- [x] Implement `SigninForm` and `UserMenu` in the Navbar <!-- id: 9 -->

## 4. AI Personalization Logic
- [ ] Update Gemini persona to adapt response style based on profile <!-- id: 10 -->
- [ ] Verify contextual switching (e.g., C++ code vs Python code based on user) <!-- id: 11 -->

## 5. Deployment & Verification
- [ ] Deploy updated backend to Hugging Face <!-- id: 12 -->
- [ ] Verify E2E flow on the live GitHub Pages site <!-- id: 13 -->
