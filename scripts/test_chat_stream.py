import httpx
import asyncio
import json

async def test_stream():
    url = "http://127.0.0.1:8000/api/chat"
    payload = {"message": "ROS 2 Bridge Architecture"}
    
    print(f"Connecting to {url}...")
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            async with client.stream("POST", url, json=payload) as response:
                print(f"Status: {response.status_code}")
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        content = line[6:].strip()
                        if content == "[DONE]":
                            print("\n[DONE]")
                            break
                        try:
                            data = json.loads(content)
                            if "text" in data:
                                print(data["text"], end="", flush=True)
                            elif "sources" in data:
                                print(f"\nSources: {data['sources']}\n")
                            elif "error" in data:
                                print(f"\nError from server: {data['error']}\n")
                        except json.JSONDecodeError:
                            print(f"\nFailed to parse JSON: {content}")
    except Exception as e:
        print(f"\nException: {e}")

if __name__ == "__main__":
    asyncio.run(test_stream())
