from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List, Dict
import json
import asyncio
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

@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        session_id = request.session_id or str(uuid.uuid4())
        
        # 1. Load chat history
        history = session_storage.get_session(session_id)
        history_context = "\n".join([f"{m['role'].upper()}: {m['text']}" for m in history[-5:]]) # Last 5 messages
        
        # Clean query: focus on core keywords and normalize terms
        clean_query = re.sub(r"^(what is|tell me about|how to|can you explain|what's|explain|define|show me|find)\s+", "", request.message, flags=re.IGNORECASE)
        clean_query = re.sub(r"ROS(\d)", r"ROS \1", clean_query, flags=re.IGNORECASE)
        
        # 2. Generate embedding
        query_vector = await gemini_service.get_embedding(clean_query)
        
        # 3. Search Qdrant
        search_results = await vector_service.search(query_vector, limit=5)
        
        # 4. Build context
        context_chunks = [r["text"] for r in search_results]
        sources = [r["metadata"].get("source", "Unknown") for r in search_results]
        
        if request.selection:
            context_chunks.insert(0, f"USER SELECTED TEXT: {request.selection}")
            sources.insert(0, "User Selection")
            
        context_text = "\n\n---\n\n".join(context_chunks)
        
        # 5. Build prompt
        rag_prompt = f"Chat History:\n{history_context}\n\nNew Query: {request.message}"
        
        async def stream_generator():
            try:
                full_response = ""
                # Send initial sources
                yield f"data: {json.dumps({'sources': list(set(sources))})}\n\n"
                
                async for chunk in gemini_service.generate_response_stream(rag_prompt, context=context_text):
                    full_response += chunk
                    yield f"data: {json.dumps({'text': chunk})}\n\n"
                
                # Save to history once complete
                session_storage.save_message(session_id, "user", request.message)
                session_storage.save_message(session_id, "bot", full_response)
                yield "data: [DONE]\n\n"
            except Exception as stream_e:
                print(f"Error in stream generator: {stream_e}")
                yield f"data: {json.dumps({'error': str(stream_e)})}\n\n"

        return StreamingResponse(stream_generator(), media_type="text/event-stream")
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))
