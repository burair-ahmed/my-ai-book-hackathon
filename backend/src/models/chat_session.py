import psycopg2
from psycopg2.extras import RealDictCursor
import os
from typing import List, Dict, Optional
import json

class SessionStorage:
    def __init__(self):
        self.conn_str = os.getenv("NEON_DATABASE_URL")
        # Initialize table if not exists
        if self.conn_str:
            self._init_db()

    def _init_db(self):
        with psycopg2.connect(self.conn_str) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS chat_sessions (
                        session_id TEXT PRIMARY KEY,
                        messages JSONB DEFAULT '[]'::jsonb,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """)
            conn.commit()

    def get_session(self, session_id: str) -> List[Dict]:
        if not self.conn_str: return []
        try:
            with psycopg2.connect(self.conn_str) as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute("SELECT messages FROM chat_sessions WHERE session_id = %s", (session_id,))
                    row = cur.fetchone()
                    return row['messages'] if row else []
        except Exception as e:
            print(f"Error fetching session: {e}")
            return []

    def save_message(self, session_id: str, role: str, text: str):
        if not self.conn_str: return
        messages = self.get_session(session_id)
        messages.append({"role": role, "text": text})
        
        try:
            with psycopg2.connect(self.conn_str) as conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        INSERT INTO chat_sessions (session_id, messages, updated_at)
                        VALUES (%s, %s, CURRENT_TIMESTAMP)
                        ON CONFLICT (session_id) DO UPDATE SET 
                            messages = EXCLUDED.messages,
                            updated_at = EXCLUDED.updated_at
                    """, (session_id, json.dumps(messages)))
                conn.commit()
        except Exception as e:
            print(f"Error saving message: {e}")

session_storage = SessionStorage()
