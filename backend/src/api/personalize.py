from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import os
from src.services.auth import auth_service, HTTPAuthorizationCredentials
from src.services.gemini import gemini_service
from src.api.profile import get_db_connection

router = APIRouter()

class PersonalizeRequest(BaseModel):
    chapter_id: str

@router.post("/personalize")
async def personalize_chapter(request: Request, body: PersonalizeRequest):
    # 1. Verify Auth
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    try:
        token = auth_header.split(" ")[1]
        user_data = await auth_service.verify_token(HTTPAuthorizationCredentials(scheme="Bearer", credentials=token))
        user_id = user_data['sub']
    except Exception as e:
        print(f"DEBUG: Auth failed: {str(e)}")
        # Re-raise the exception if it's already an HTTPException (from verify_token)
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

    # 2. Get User Profile
    user_profile = {}
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

    if not user_profile:
        raise HTTPException(status_code=400, detail="Profile not found. Please complete signup.")

    # 3. Read Chapter Content
    # Debugging: Print received chapter_id
    print(f"DEBUG: Request for chapter_id: {body.chapter_id}")
    
    # Try multiple strategies to find the file
    possible_paths = [
        f"/app/docs/{body.chapter_id}.md",                # Docker container
        f"docs/{body.chapter_id}.md",                     # Local run from root
        f"../docs/{body.chapter_id}.md",                  # Local run from backend/
        f"docs/{body.chapter_id}/index.md",               # Directory index (root)
        f"../docs/{body.chapter_id}/index.md"             # Directory index (backend/)
    ]
    
    file_path = None
    for path in possible_paths:
        if os.path.exists(path):
            file_path = path
            break
            
    print(f"DEBUG: Resolved file_path: {file_path}")

    if not file_path:
        # List dir to help debug
        try:
            print(f"DEBUG: CWD is {os.getcwd()}")
            print(f"DEBUG: docs contents: {os.listdir('docs') if os.path.exists('docs') else 'docs dir not found'}")
        except:
            pass
        raise HTTPException(status_code=404, detail=f"Chapter file not found for id: {body.chapter_id}")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading chapter: {str(e)}")

    # 4. Stream Rewrite
    async def stream_generator():
        sw = user_profile.get("software_background", {})
        hw = user_profile.get("hardware_background", {})
        
        system_prompt = f"""You are an expert technical editor rewriting a book chapter for a specific user.
User Context:
- Software knowledge: {sw}
- Hardware context: {hw}

TASK:
Rewrite the provided markdown content to be highly relevant to this user.
- IF they know Python, use Python code snippets.
- IF they use Arduino, explain concepts using Arduino analogies.
- KEEP the same headings and structure.
- DO NOT summarize. Rewrite the full content with the requested adaptation.
- MAINTAIN Markdown formatting.
"""
        async for chunk in gemini_service.generate_content_stream(system_prompt, content):
             yield chunk

    return StreamingResponse(stream_generator(), media_type="text/plain")
