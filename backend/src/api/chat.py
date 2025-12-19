from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict
from src.services.gemini import gemini_service
from src.services.vector_store import vector_service
from src.models.chat_session import session_storage
import uuid
import re

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    selection: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    sources: List[str]

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        session_id = request.session_id or str(uuid.uuid4())
        
        # 1. Load chat history
        history = session_storage.get_session(session_id)
        history_context = "\n".join([f"{m['role'].upper()}: {m['text']}" for m in history[-5:]]) # Last 5 messages
        
        # Clean query: focus on core keywords and normalize terms
        clean_query = re.sub(r"^(what is|tell me about|how to|can you explain|what's)\s+", "", request.message, flags=re.IGNORECASE)
        # Normalize "ROS2" to "ROS 2" for better matching with book content
        clean_query = re.sub(r"ROS(\d)", r"ROS \1", clean_query, flags=re.IGNORECASE)
        
        query_vector = await gemini_service.get_embedding(clean_query)
        
        # 3. Search Qdrant for relevant book context
        search_results = await vector_service.search(query_vector, limit=5)
        
        # 4. Build context string
        context_chunks = [r["text"] for r in search_results]
        sources = [r["metadata"].get("source", "Unknown") for r in search_results]
        
        # 5. Incorporate user selection if provided
        if request.selection:
            context_chunks.insert(0, f"USER SELECTED TEXT: {request.selection}")
            sources.insert(0, "User Selection")
            
        context_text = "\n\n---\n\n".join(context_chunks)
        
        # 6. Build the enhanced prompt including history
        rag_prompt = f"""
Chat History:
{history_context}

New Query: {request.message}
"""
        
        # 7. Generate response using Gemini
        ai_response = await gemini_service.generate_response(rag_prompt, context=context_text)
        
        # 8. Save to history
        session_storage.save_message(session_id, "user", request.message)
        session_storage.save_message(session_id, "bot", ai_response)
        
        return ChatResponse(
            response=ai_response,
            sources=list(set(sources))
        )
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))
