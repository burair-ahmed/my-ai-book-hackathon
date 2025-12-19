import os
from dotenv import load_dotenv

# Ensure .env is loaded from the script's directory
base_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(base_dir, ".env"))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.chat import router as chat_router

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI(title="Physical AI Book RAG Chatbot")

# Configure CORS for Docusaurus frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")

# Serve static files from the build directory
# This assumes the frontend build is in a directory named 'build' at the root
frontend_path = os.path.join(os.path.dirname(base_dir), "build")

if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="static")

    @app.exception_handler(404)
    async def not_found_handler(request, exc):
        return FileResponse(os.path.join(frontend_path, "index.html"))

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    # Use port 7860 for Hugging Face Spaces compatibility
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
