# Implementation Plan: Integrated RAG Chatbot

**Branch**: `002-rag-chatbot` | **Date**: 2025-12-19 | **Spec**: [spec.md](file:///c:/Users/Pc/Desktop/my-ai-book-hackathon/specs/002-rag-chatbot/spec.md)
**Input**: Feature specification from `/specs/002-rag-chatbot/spec.md`

## Summary

Build a zero-cost RAG chatbot integrated into the Docusaurus book. The system uses **Google Gemini** for AI, **Qdrant Cloud** for vector storage, **Neon Postgres** for session data, and **Hugging Face Spaces** for hosting. Key feature: selection-to-chat context capture.

## Technical Context

**Language/Version**: Python 3.10+ (Backend), TypeScript/React (Frontend)  
**Primary Dependencies**: FastAPI, google-generativeai, qdrant-client, psycopg2-binary, Docusaurus  
**Storage**: Qdrant (Vectors), Neon Postgres (Metadata/Sessions)  
**Testing**: pytest (Backend), Jest (Frontend)  
**Target Platform**: Hugging Face Spaces (Backend), GitHub Pages (Frontend)  
**Project Type**: Web application (Frontend + Backend)  
**Performance Goals**: <5s response time for RAG queries  
**Constraints**: Zero-cost (Free tiers only)

## Constitution Check

### Embodied Systems Architecture
- [x] Content prioritizes physical embodiment (Chatbot answers specific robotics/embodied AI questions)
- [x] Sensorimotor integration is primary architectural constraint (Chatbot explains these concepts)
- [x] System designed for physical deployment requirements (Accessible technical documentation support)

### Chapter Structure Constraint
- [x] Feature scope fits within book structure (Integrated into the existing Docusaurus site)
- [x] Content enables independent study (Chatbot helps clarify individual concepts)

### Academic-Industrial Rigor
- [x] Concepts include both theoretical grounding and practical implementation (RAG uses book's rigorous content)

### Systems-Thinking Documentation
- [x] Clear system boundaries, data flows, and architectural relationships defined (FastAPI <-> Gemini <-> Qdrant)

## Project Structure

### Documentation (this feature)

```text
specs/002-rag-chatbot/
├── plan.md              # This file
├── spec.md              # Feature specification
└── tasks.md             # Granular task list
```

### Source Code

```text
backend/
├── src/
│   ├── api/             # FastAPI routes
│   ├── services/        # RAG and Vector services
│   └── models/          # DB schemas
├── Dockerfile           # For HF Spaces
└── main.py              # Entry point

frontend/src/components/ChatBot/
├── ChatBot.tsx          # Main component
├── ChatWindow.tsx       # UI
└── useSelection.ts      # Custom hook for text selection
```

**Structure Decision**: Web application structure with separate `backend/` for HF Spaces and `src/components/ChatBot` within the main Docusaurus project.
