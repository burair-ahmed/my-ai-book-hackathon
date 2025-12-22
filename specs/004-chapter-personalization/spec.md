# Specification: Chapter Personalization

## 1. Overview
Logged-in users can click a "Personalize for Me" button at the start of each chapter. This triggers a backend process that rewrites the chapter content (or provides a tailored guide) based on the user's stored software/hardware background.

## 2. User Stories
- **As a Student**, I want the "Chapter 1: Foundations" to use Python examples because I told the system I know Python, so I can understand the concepts faster.
- **As an Hobbyist**, I want the "Chapter 2: ROS 2" to focus on Arduino integration because I have an Arduino background.
- **As a Guest**, I should not see the personalization button (or be prompted to sign in) so I am encouraged to register.

## 3. Functional Requirements
### Frontend
- **Personalization Button**:
  - Located at the top of every Doc page (swizzled DocItem or partial).
  - Visible only to authenticated users (or shows "Sign in to Personalize").
  - State: Idle -> Loading (Streaming) -> Personalized View.
- **Content Display**:
  - A toggle switch: "Original Content" <-> "Personalized for You".
  - Renders Markdown stream from the API.

### Backend
- **Endpoint**: `POST /api/personalize`
  - Body: `{ chapter_id: string, stream: boolean }`
  - Auth: Required (Bearer token).
- **Logic**:
  - Retrieve user profile from DB using the token.
  - Load the raw Markdown content of the requested chapter.
  - Construct a prompt for Gemini: "Rewrite this chapter context for a user with {Software: X, Hardware: Y}. Keep the same structure but adapt examples."
  - Stream the generated Markdown back to the client.

## 4. Technical Constraints
- **Context Window**: Entire chapter markdown must fit in Gemini Flash context (1M tokens, so this is safe).
- **Latency**: Rewriting a full chapter is slow. Streaming is mandatory.
- **File Access**: Backend container needs access to `docs/` or a copy of the markdown files.

## 5. UI/UX
- **Button Style**: A prominent, "magical" looking button (gradient/glassmorphism) near the title.
- **Loading State**: A skeleton or "AI is writing..." indicator.
- **Error State**: Fallback to original content with a toast message.
