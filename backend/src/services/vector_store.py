from qdrant_client import QdrantClient
from qdrant_client.http import models
import os
from typing import List, Dict, Any

class VectorStoreService:
    def __init__(self):
        url = os.getenv("QDRANT_URL")
        api_key = os.getenv("QDRANT_API_KEY")
        if not url:
            raise ValueError("QDRANT_URL not found in environment")
        
        self.client = QdrantClient(url=url, api_key=api_key, timeout=60)
        self.collection_name = "physical_ai_book"

    async def ensure_collection(self, vector_size: int = 768):
        """Ensure the collection exists in Qdrant."""
        collections = self.client.get_collections().collections
        exists = any(c.name == self.collection_name for c in collections)
        
        if not exists:
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(
                    size=vector_size, 
                    distance=models.Distance.COSINE
                ),
            )

    async def upsert_points(self, points: List[Dict[str, Any]]):
        """Upsert points into the collection."""
        self.client.upsert(
            collection_name=self.collection_name,
            points=[
                models.PointStruct(
                    id=idx,
                    vector=p["vector"],
                    payload=p["payload"]
                ) for idx, p in enumerate(points)
            ]
        )

    async def search(self, query_vector: List[float], limit: int = 3) -> List[Dict[str, Any]]:
        """Search for the most relevant context chunks."""
        results = self.client.query_points(
            collection_name=self.collection_name,
            query=query_vector,
            limit=limit
        ).points
        return [{"text": r.payload["text"], "metadata": r.payload["metadata"]} for r in results]

vector_service = VectorStoreService()
