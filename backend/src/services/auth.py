import httpx
import jwt
from jwt import PyJWKClient
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import os

class AuthService:
    def __init__(self):
        self.jwks_url = None
        self.jwks_client = None
        self.security = HTTPBearer()
        
        neon_auth_url = os.getenv("NEON_AUTH_URL")
        if neon_auth_url:
            self.jwks_url = neon_auth_url + "/.well-known/jwks.json"
            try:
                self.jwks_client = PyJWKClient(self.jwks_url)
                print(f"Auth initialized with URL: {self.jwks_url}")
            except Exception as e:
                print(f"Failed to initialize JWK Client: {e}")
        else:
            print("WARNING: NEON_AUTH_URL not set. Authentication will be disabled.")

    async def verify_token(self, auth: HTTPAuthorizationCredentials = Security(HTTPBearer())):
        if not self.jwks_client:
             raise HTTPException(status_code=503, detail="Authentication service not configured (missing NEON_AUTH_URL)")
             
        token = auth.credentials
        try:
            signing_key = self.jwks_client.get_signing_key_from_jwt(token)
            data = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                # options={"verify_aud": False} # Better Auth might have specific audience
            )
            return data # Contains user_id in 'sub'
        except Exception as e:
            raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

auth_service = AuthService()
