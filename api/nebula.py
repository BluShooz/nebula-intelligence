from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .nebula_chatbot import NebulaBot
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use the same key as the frontend for convenience, or a dedicated OPENAI_API_KEY
api_key = os.getenv("OPENAI_API_KEY") or os.getenv("NEXT_PUBLIC_GEMINI_API_KEY")
nebula = NebulaBot(api_key=api_key)
nebula.add_user("blue_admin", "admin")

@app.post("/api/nebula")
async def nebula_response(request: Request):
    data = await request.json()
    prompt = data.get("prompt", "")
    user_id = data.get("user_id", "blue_admin")
    mode = data.get("mode")

    if mode:
        nebula.set_mode(user_id, mode)
    
    try:
        text = nebula.respond(user_id, prompt)
        if not text or not text.strip():
            text = "Nebula is thinking... but hit a snag."
    except Exception as e:
        text = f"Error: {str(e)}"
    
    return {"text": text}
