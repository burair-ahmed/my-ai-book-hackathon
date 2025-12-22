import google.generativeai as genai
import os
from typing import List, Optional

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-flash-lite-latest')

    async def get_embedding(self, text: str) -> List[float]:
        """Generate embedding for a piece of text."""
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_document",
            title="Book Chunk"
        )
        return result['embedding']

    async def generate_response_stream(self, prompt: str, context: Optional[str] = None, user_profile: Optional[dict] = None):
        """Generate a streaming response based on a prompt and optional context/profile."""
        personalization = ""
        if user_profile:
            sw = user_profile.get("software_background", {})
            hw = user_profile.get("hardware_background", {})
            personalization = f"\nUSER CONTEXT:\nSoftware: {sw}\nHardware: {hw}\nAdjust your technical level and examples accordingly (e.g. use Arduino C++ if they know it, or ROS 2 logic if preferred)."

        system_instructions = f"""You are an expert AI Robotics and Embodied Intelligence Assistant. 
Your goal is to explain technical concepts from the book clearly and accurately.{personalization}

RULES:
1. Use the provided context to answer. If the answer isn't there, say you don't know but offer general AI/Robotics knowledge IF relevant.
2. Use professional yet accessible language (like a great teacher).
3. Format your response with:
   - **Bold** for key terms and technical names.
   - Bullet points for lists.
   - Code blocks for snippets.
4. Keep it concise but thorough.
"""
        
        full_prompt = prompt
        if context:
            full_prompt = f"{system_instructions}\n\nContext from the book:\n{context}\n\nQuestion: {prompt}\n\nAnswer:"
        else:
            full_prompt = f"{system_instructions}\n\nQuestion: {prompt}\n\nAnswer:"
        
        response = await self.model.generate_content_async(full_prompt, stream=True)
        async for chunk in response:
            try:
                if chunk.text:
                    yield chunk.text
            except ValueError:
                # Handle cases where safety filters block text
                continue

    async def generate_response(self, prompt: str, context: Optional[str] = None) -> str:
        """Generate a non-streaming response (fallback)."""
        full_text = ""
        async for chunk in self.generate_response_stream(prompt, context):
            full_text += chunk
        return full_text

gemini_service = GeminiService()
