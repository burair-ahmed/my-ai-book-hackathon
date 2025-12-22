import psycopg2
from datetime import datetime, timezone
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import os

class AuthService:
    def __init__(self):
        self.db_url = os.getenv("NEON_DATABASE_URL")
        self.security = HTTPBearer()

    async def verify_token(self, auth: HTTPAuthorizationCredentials = Security(HTTPBearer())):
        token = auth.credentials
        conn = None
        try:
            conn = psycopg2.connect(self.db_url)
            cur = conn.cursor()
            
            # Query the session table in neon_auth schema
            # Note: columns are case-sensitive usually if created by ORMs, checking exact names from inspection
            cur.execute(
                'SELECT "userId", "expiresAt" FROM neon_auth.session WHERE token = %s', 
                (token,)
            )
            row = cur.fetchone()
            
            if not row:
                raise Exception("Token not found")
                
            user_id, expires_at = row
            
            # Ensure timezone awareness
            if expires_at.tzinfo is None:
                expires_at = expires_at.replace(tzinfo=timezone.utc)
            
            if expires_at < datetime.now(timezone.utc):
                 raise Exception("Token expired")
                 
            return {"sub": str(user_id)}
            
        except Exception as e:
            print(f"DEBUG: Token verification failed: {str(e)}")
            raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
        finally:
            if conn:
                conn.close()

auth_service = AuthService()
