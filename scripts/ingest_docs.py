import os
import asyncio
from pathlib import Path
from dotenv import load_dotenv
import sys

# Load env before importing services that depend on it
load_dotenv(dotenv_path=os.path.join(os.getcwd(), 'backend', '.env'))

# Add backend/src to path for imports
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from src.services.gemini import GeminiService
from src.services.vector_store import VectorStoreService

async def ingest_docs():
    gemini = GeminiService()
    vector_store = VectorStoreService()
    
    # Ensure collection exists
    await vector_store.ensure_collection(vector_size=768) # text-embedding-004 is 768 dims
    
    docs_path = Path("docs")
    points = []
    
    print("🚀 Starting documentation ingestion...")
    
    for file_path in docs_path.rglob("*.md"):
        if file_path.name == "index.md": continue
        
        print(f"📄 Processing {file_path}...")
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
            # Simple chunking (by paragraph or double newline)
            chunks = [c.strip() for c in content.split("\n\n") if len(c.strip()) > 50]
            
            for chunk in chunks:
                embedding = await gemini.get_embedding(chunk)
                points.append({
                    "vector": embedding,
                    "payload": {
                        "text": chunk,
                        "metadata": {
                            "source": str(file_path),
                        }
                    }
                })
    
    if points:
        batch_size = 50
        for i in range(0, len(points), batch_size):
            batch = points[i:i + batch_size]
            await vector_store.upsert_points(batch)
            print(f"✅ Upserted batch {i//batch_size + 1} ({len(batch)} points)...")
        print(f"✨ Successfully ingested {len(points)} chunks into Qdrant!")
    else:
        print("⚠️ No chunks found to ingest.")

if __name__ == "__main__":
    asyncio.run(ingest_docs())
