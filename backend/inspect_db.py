import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

# Get DB URL
db_url = os.environ.get("NEON_DATABASE_URL")
if not db_url:
    print("Error: NEON_DATABASE_URL not found")
    exit(1)

try:
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    # Inspect users and profiles
    print("\n--- neon_auth.user ---")
    cur.execute('SELECT id, email, name FROM neon_auth.user')
    users = cur.fetchall()
    for u in users:
        print(f"User: {u[0]} | {u[1]} | {u[2]}")

    print("\n--- public.user_profiles ---")
    cur.execute('SELECT user_id, software_background, hardware_background FROM public.user_profiles')
    profiles = cur.fetchall()
    for p in profiles:
        print(f"Profile for: {p[0]} | SW: {p[1]} | HW: {p[2]}")
            
    conn.close()

except Exception as e:
    print("DB connection failed:", e)
