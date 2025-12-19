import os
import asyncio
import sys
from dotenv import load_dotenv

# Ensure .env is loaded from the backend directory
load_dotenv(dotenv_path=os.path.join(os.getcwd(), 'backend', '.env'))

# Add backend/src to path for imports
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from src.services.gemini import gemini_service
from src.services.vector_store import vector_service

async def test_retrieval():
    query = "what is ROS2 Bridge Architecture"
    print(f"🔍 Testing retrieval for: '{query}'")
    
    # 1. Generate embedding
    query_vector = await gemini_service.get_embedding(query)
    
    # 2. Search Qdrant
    results = await vector_service.search(query_vector, limit=5)
    
    print(f"\n✅ Found {len(results)} results:")
    for i, r in enumerate(results):
        print(f"\n--- Result {i+1} (Source: {r['metadata']['source']}) ---")
        print(r['text'][:500] + "..." if len(r['text']) > 500 else r['text'])

if __name__ == "__main__":
    asyncio.run(test_retrieval())
