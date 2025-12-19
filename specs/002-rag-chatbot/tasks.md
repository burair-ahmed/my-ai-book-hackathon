# Tasks: Integrated RAG Chatbot

**Input**: Design documents from `/specs/002-rag-chatbot/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Initialize `backend/` directory with FastAPI and dependencies
- [ ] T002 Configure environment variables in `.env` (Gemini, Qdrant, Neon)
- [ ] T003 [P] Setup Qdrant collection for book content embeddings

---

## Phase 2: Foundational (RAG Pipeline)

- [ ] T004 Implement Google Gemini embedding service in `backend/src/services/gemini.py`
- [ ] T005 [P] Implement Qdrant search service in `backend/src/services/vector_store.py`
- [ ] T006 Create data ingestion script `scripts/ingest_docs.py` to parse MDX and populate Qdrant
- [ ] T007 [P] Implement Neon Postgres session storage in `backend/src/api/sessions.py`

---

## Phase 3: User Story 1 - Interact with Book Content (Priority: P1)

**Goal**: Provide a functional chat interface that answers questions based on book content.

- [ ] T008 [P] [US1] Create FastAPI chat endpoint `/chat` in `backend/src/api/chat.py`
- [ ] T009 [US1] Implement RAG orchestration (Search -> Context -> Prompt -> Gemini)
- [ ] T010 [P] [US1] Build Docusaurus ChatBot UI in `src/components/ChatBot/`
- [ ] T011 [US1] Connect frontend to backend chat API

---

## Phase 4: User Story 2 - Selection-to-Chat (Priority: P2)

**Goal**: Allow users to ask questions specifically about selected text.

- [ ] T012 [P] [US2] Implement `useSelection` hook to capture browser text selection
- [ ] T013 [US2] Add selection context to frontend chat payload
- [ ] T014 [US2] Update backend prompt engineering to prioritize selection context

---

## Phase 5: Polish & Deployment

- [ ] T015 Dockerize backend for Hugging Face Spaces
- [ ] T016 [P] Add markdown rendering for bot responses in UI
- [ ] T017 Final verification of end-to-end flow on live preview
