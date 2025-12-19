# Feature Specification: Integrated RAG Chatbot

**Feature Branch**: `002-rag-chatbot`  
**Created**: 2025-12-19  
**Status**: Draft  
**Input**: User description: "Integrated RAG Chatbot Development: Build and embed a Retrieval-Augmented Generation (RAG) chatbot within the published book using zero-cost APIs and hosting."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Interact with Book Content (Priority: P1)

As a reader of the Physical AI book, I want to ask questions about the book's content so that I can gain a deeper understanding of complex robotics and AI topics through natural language interaction.

**Why this priority**: Core functionality that transforms a static book into an interactive learning platform.

**Independent Test**: Can be fully tested by asking a specific question found in the text (e.g., "What is the difference between SE(3) and SO(3)?") and verifying the answer is accurate and cited.

**Acceptance Scenarios**:

1. **Given** a user on a chapter page, **When** they type a question in the chatbot, **Then** the bot retrieves relevant context from the book and provides a concise answer.
2. **Given** a question outside the book's scope, **When** asked, **Then** the bot politely informs the user it only answers based on the book's content.

---

### User Story 2 - Contextual Selection-to-Chat (Priority: P2)

As a student studying a specific paragraph, I want to select a portion of text and ask the chatbot to explain it so that I can get immediate clarification on difficult technical passages without retyping the context.

**Why this priority**: Enhances the user experience by providing localized, context-aware assistance.

**Independent Test**: Can be fully tested by selecting a technical sentence, clicking "Ask chatbot", and verifying the response incorporates the selected text as its primary context.

**Acceptance Scenarios**:

1. **Given** selected text on a doc page, **When** the user clicks the "Ask Bot" tooltip/icon, **Then** the chatbot opens with the selected text as context.
2. **Given** a selection-to-chat query, **When** processed, **Then** the AI assistant focuses its explanation specifically on the provided snippet.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST utilize **Google Gemini API** (Free Tier) for embeddings and response generation.
- **FR-002**: System MUST use **Qdrant Cloud** (Free Tier) for vector storage and semantic search.
- **FR-003**: System MUST provide a floating chatbot UI component in the Docusaurus frontend.
- **FR-004**: System MUST capture user-selected text and pass it as additional context to the RAG pipeline.
- **FR-005**: Backend MUST be hosted on **Hugging Face Spaces** (Free Tier) or similar zero-cost platform.
- **FR-006**: Book content (MDX) MUST be automatically parsed and indexed into the vector store.
- **FR-007**: System MUST store session-related metadata in **Neon Postgres** (Free Tier).

### Key Entities

- **VectorStore**: Qdrant collection containing embeddings of book chunks.
- **ChatSession**: Conversation history and metadata stored in Neon.
- **ContextSnippet**: Text selected by the user to focus the RAG response.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of book chapters are correctly indexed and searchable via the RAG pipeline.
- **SC-002**: Bot responses are generated within <5 seconds for typical queries.
- **SC-003**: Deployment maintains $0 cost for API usage and hosting within free tier limits.
- **SC-004**: Seamless integration of selection-to-chat feature on all documentation pages.
