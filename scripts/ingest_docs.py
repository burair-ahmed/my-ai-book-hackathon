import os
import asyncio
import re
from pathlib import Path
from dotenv import load_dotenv
import sys
from typing import List, Dict

# Load env before importing services that depend on it
load_dotenv(dotenv_path=os.path.join(os.getcwd(), 'backend', '.env'))

# Add backend/src to path for imports
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from src.services.gemini import GeminiService
from src.services.vector_store import VectorStoreService

def get_chunks_with_headers(content: str) -> List[str]:
    """Split content into chunks while preserving header context."""
    lines = content.split("\n")
    chunks = []
    current_headers = ["", "", ""] # H1, H2, H3
    current_chunk = []
    
    for line in lines:
        # Detect headers
        h1_match = re.match(r"^#\s+(.+)", line)
        h2_match = re.match(r"^##\s+(.+)", line)
        h3_match = re.match(r"^###\s+(.+)", line)
        
        if h1_match:
            if current_chunk:
                chunks.append(format_chunk(current_chunk, current_headers))
                current_chunk = []
            current_headers[0] = h1_match.group(1).strip()
            current_headers[1] = ""
            current_headers[2] = ""
        elif h2_match:
            if current_chunk:
                chunks.append(format_chunk(current_chunk, current_headers))
                current_chunk = []
            current_headers[1] = h2_match.group(1).strip()
            current_headers[2] = ""
        elif h3_match:
            if current_chunk:
                chunks.append(format_chunk(current_chunk, current_headers))
                current_chunk = []
            current_headers[2] = h3_match.group(1).strip()
        else:
            current_chunk.append(line)
            
    if current_chunk:
        chunks.append(format_chunk(current_chunk, current_headers))
        
    return [c for c in chunks if len(c.strip()) > 50]

def format_chunk(lines: List[str], headers: List[str]) -> str:
    """Combine lines and prepend header context."""
    context = " > ".join([h for h in headers if h])
    content = "\n".join(lines).strip()
    if context:
        return f"[{context}]\n{content}"
    return content

async def ingest_docs():
    gemini = GeminiService()
    vector_store = VectorStoreService()
    
    # Ensure collection exists
    await vector_store.ensure_collection(vector_size=768)
    
    docs_path = Path("docs")
    points = []
    
    print("🚀 Starting enhanced documentation ingestion...")
    
    for file_path in docs_path.rglob("*.md"):
        if file_path.name == "index.md": continue
        if ".antigravityignore" in str(file_path): continue
        
        print(f"📄 Processing {file_path}...")
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
            # Remove MDX frontmatter if it exists
            content = re.sub(r"---.*?---", "", content, flags=re.DOTALL)
            
            chunks = get_chunks_with_headers(content)
            
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
