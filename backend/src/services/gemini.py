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

    async def generate_response(self, prompt: str, context: Optional[str] = None) -> str:
        """Generate a response based on a prompt and optional context."""
        full_prompt = prompt
        if context:
            full_prompt = f"Context from the book:\n{context}\n\nQuestion: {prompt}\n\nAnswer based ONLY on the context above:"
        
        response = self.model.generate_content(full_prompt)
        return response.text

gemini_service = GeminiService()
