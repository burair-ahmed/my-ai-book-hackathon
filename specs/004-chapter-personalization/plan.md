# Implementation Plan: Chapter Personalization

# [Goal Description]
Enable logged-in users to personalize chapter content based on their profile (Software/Hardware background) using a "Personalize for Me" button.

## User Review Required
> [!IMPORTANT]
> This feature requires the backend to have access to the raw Markdown files of the book chapters to rewrite them. I will update the `Dockerfile` to copy the `docs/` directory into the image.

## Proposed Changes

### Backend
#### [MODIFY] [Dockerfile](file:///c:/Users/Pc/Desktop/my-ai-book-hackathon/Dockerfile)
- Add `COPY docs /app/docs` to ensure chapter content is available.

#### [NEW] [backend/src/api/personalize.py](file:///c:/Users/Pc/Desktop/my-ai-book-hackathon/backend/src/api/personalize.py)
- Endpoint `POST /personalize`.
- Logic to read file from disk `docs/{chapter_id}.md`.
- Call Gemini with personalization prompt.

#### [MODIFY] [backend/main.py](file:///c:/Users/Pc/Desktop/my-ai-book-hackathon/backend/main.py)
- Register the new router.

### Frontend
#### [NEW] [src/components/Personalization/ChapterPersonalizer.tsx](file:///c:/Users/Pc/Desktop/my-ai-book-hackathon/src/components/Personalization/ChapterPersonalizer.tsx)
- The main controller component.
- Handles API call and streaming state.
- Renders `ReactMarkdown` for the result.

#### [MODIFY] [src/theme/DocItem/Content/index.js](file:///c:/Users/Pc/Desktop/my-ai-book-hackathon/src/theme/DocItem/Content/index.js)
- Swizzle this component to inject `ChapterPersonalizer` at the top of the content area.
- Alternatively, wrap the content.

## Verification Plan
### Automated Tests
- Test the API endpoint with a mock user token and chapter ID.
### Manual Verification
- Log in as a user with "Python" background.
- Go to "Chapter 1".
- Click "Personalize".
- Verify the output mentions Python specific analogies.
