import httpx
import jwt
from jwt import PyJWKClient
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import os

class AuthService:
    def __init__(self):
        self.jwks_url = os.getenv("NEON_AUTH_URL") + "/.well-known/jwks.json"
        self.jwks_client = PyJWKClient(self.jwks_url)
        self.security = HTTPBearer()

    async def verify_token(self, auth: HTTPAuthorizationCredentials = Security(HTTPBearer())):
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
