import os
from dotenv import load_dotenv

# Ensure .env is loaded from the script's directory
base_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(base_dir, ".env"))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.chat import router as chat_router
from src.api.profile import router as profile_router
from src.api.personalize import router as personalize_router

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI(title="Physical AI Book RAG Chatbot")

# Configure CORS to allow your GitHub Pages domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, highly recommend replacing "*" with your GitHub Pages URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")
app.include_router(profile_router, prefix="/api/profile")
app.include_router(personalize_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Chatbot Backend is running. API at /api/chat"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    # Use port 7860 for Hugging Face Spaces compatibility
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
