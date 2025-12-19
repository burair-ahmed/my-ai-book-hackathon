import os
from dotenv import load_dotenv

# Ensure .env is loaded from the script's directory
base_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(base_dir, ".env"))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.chat import router as chat_router

app = FastAPI(title="Physical AI Book RAG Chatbot")

app.include_router(chat_router, prefix="/api")

# Configure CORS for Docusaurus frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Physical AI Book RAG Backend is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
