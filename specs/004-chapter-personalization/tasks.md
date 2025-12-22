# Tasks: Chapter Personalization

## 1. Backend Implementation
- [x] Update `Dockerfile` to copy `docs/` directory <!-- id: 0 -->
- [x] Create `backend/src/api/personalize.py` endpoint <!-- id: 1 -->
- [x] Register `personalize_router` in `backend/main.py` <!-- id: 2 -->
- [x] Verify file access in the backend logic <!-- id: 3 -->

## 2. Frontend Implementation
- [x] Create `ChapterPersonalizer` component with "Personalize" button <!-- id: 4 -->
- [x] Implement streaming markdown rendering (using `react-markdown`) <!-- id: 5 -->
- [x] Swizzle `DocItem/Content` to inject the personalizer <!-- id: 6 -->
- [x] Add "Original" vs "Personalized" toggle UI <!-- id: 7 -->

## 3. Integration & Polish
- [x] Add loading animations (skeleton or sparkles) <!-- id: 8 -->
- [x] Handle errors (e.g., chapter file not found) <!-- id: 9 -->
- [x] Verify complete flow with full chapter rewrite <!-- id: 10 -->
