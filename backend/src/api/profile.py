from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from src.services.auth import auth_service
import psycopg2
from psycopg2.extras import Json
import os

router = APIRouter()

class ProfileUpdate(BaseModel):
    software_background: dict
    hardware_background: dict

def get_db_connection():
    return psycopg2.connect(os.getenv("NEON_DATABASE_URL"))

@router.get("/")
async def get_profile(user_data: dict = Depends(auth_service.verify_token)):
    user_id = user_data['sub']
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT software_background, hardware_background FROM public.user_profiles WHERE user_id = %s", (user_id,))
        row = cur.fetchone()
        if row:
            return {
                "software_background": row[0],
                "hardware_background": row[1]
            }
        return {"software_background": {}, "hardware_background": {}}
    finally:
        cur.close()
        conn.close()

@router.post("/")
async def update_profile(profile: ProfileUpdate, user_data: dict = Depends(auth_service.verify_token)):
    user_id = user_data['sub']
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO public.user_profiles (user_id, software_background, hardware_background, updated_at)
            VALUES (%s, %s, %s, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id) 
            DO UPDATE SET 
                software_background = EXCLUDED.software_background,
                hardware_background = EXCLUDED.hardware_background,
                updated_at = CURRENT_TIMESTAMP
        """, (user_id, Json(profile.software_background), Json(profile.hardware_background)))
        conn.commit()
        return {"status": "success"}
    finally:
        cur.close()
        conn.close()
