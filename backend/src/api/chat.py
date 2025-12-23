from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List, Dict
import json
import asyncio
from src.services.gemini import gemini_service
from src.services.vector_store import vector_service
from src.services.auth import auth_service, HTTPAuthorizationCredentials
from src.models.chat_session import session_storage
from src.api.profile import get_db_connection
import uuid
import re
import os

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    selection: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    sources: List[str]

@router.post("/chat")
async def chat(request: Request, chat_request: ChatRequest):
    try:
        # Optional Auth for Personalization
        user_profile = None
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            try:
                # Manual credential extraction for optional auth
                token = auth_header.split(" ")[1]
                user_data = await auth_service.verify_token(HTTPAuthorizationCredentials(scheme="Bearer", credentials=token))
                user_id = user_data['sub']
                
                # Fetch profile from DB
                conn = get_db_connection()
                cur = conn.cursor()
                try:
                    cur.execute("SELECT software_background, hardware_background FROM public.user_profiles WHERE user_id = %s", (user_id,))
                    row = cur.fetchone()
                    if row:
                        user_profile = {"software_background": row[0], "hardware_background": row[1]}
                finally:
                    cur.close()
                    conn.close()
            except Exception as auth_e:
                print(f"Personalization error (ignoring): {auth_e}")

        session_id = chat_request.session_id or str(uuid.uuid4())
        
        # 1. Load chat history
        history = session_storage.get_session(session_id)
        history_context = "\n".join([f"{m['role'].upper()}: {m['text']}" for m in history[-5:]]) # Last 5 messages
        
        # Clean query: focus on core keywords and normalize terms
        clean_query = re.sub(r"^(what is|tell me about|how to|can you explain|what's|explain|define|show me|find)\s+", "", chat_request.message, flags=re.IGNORECASE)
        clean_query = re.sub(r"ROS(\d)", r"ROS \1", clean_query, flags=re.IGNORECASE)
        
        # 2. Generate embedding
        query_vector = await gemini_service.get_embedding(clean_query)
        
        # 3. Search Qdrant
        search_results = await vector_service.search(query_vector, limit=5)
        
        # 4. Build context
        context_chunks = [r["text"] for r in search_results]
        sources = [r["metadata"].get("source", "Unknown") for r in search_results]
        
        if chat_request.selection:
            context_chunks.insert(0, f"USER SELECTED TEXT: {chat_request.selection}")
            sources.insert(0, "User Selection")
            
        context_text = "\n\n---\n\n".join(context_chunks)
        
        # 5. Build prompt
        rag_prompt = f"Chat History:\n{history_context}\n\nNew Query: {chat_request.message}"
        
        async def stream_generator():
            try:
                full_response = ""
                # Send initial sources
                yield f"data: {json.dumps({'sources': list(set(sources))})}\n\n"
                
                async for chunk in gemini_service.generate_response_stream(rag_prompt, context=context_text, user_profile=user_profile):
                    full_response += chunk
                    yield f"data: {json.dumps({'text': chunk})}\n\n"
                
                # Save to history once complete
                session_storage.save_message(session_id, "user", chat_request.message)
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
