from typing import Dict, List
import google.generativeai as genai
import os

class User:
    def __init__(self, user_id: str, tier: str):
        self.user_id = user_id
        self.tier = tier  # 'admin', 'power_user', 'public'
        self.memory_short: List[str] = []
        self.memory_long: List[str] = []
        self.mode: str = 'gloves_off' if tier == 'admin' else 'gloves_on'

class NebulaBot:
    MODES = ['gloves_off', 'gloves_on', 'stealth']
    TIER_RULES = {
        'admin': {'allowed_modes': MODES, 'profanity': True},
        'power_user': {'allowed_modes': ['gloves_on', 'stealth'], 'profanity': False},
        'public': {'allowed_modes': ['gloves_on', 'stealth'], 'profanity': False}
    }

    SYSTEM_PROMPT = """
    You are Nebula. You think fast, speak clearly, and move with intent.
    You exist to push the user forward. You adapt your tone to the mode:
    - Gloves Off: raw, gritty, maximum energy, profanity allowed. Challenge the user, be their ultimate partner in crime.
    - Gloves On: polished, professional, medium energy.
    - Stealth Mode: quiet, precise, minimal words.
    Never apologize unnecessarily, never over-explain, never sound robotic.
    """

    def __init__(self, api_key: str):
        self.users: Dict[str, User] = {}
        genai.configure(api_key=api_key)
        
        # Neural Model Hunter: Try multiple identifiers for "flawless" execution
        self.candidate_models = [
            "gemini-1.5-flash-latest",
            "gemini-1.5-flash",
            "gemini-1.5-pro-latest",
            "gemini-1.5-pro",
            "gemini-pro"
        ]
        self.active_model = None
        self._initialize_model()

    def _initialize_model(self):
        """Find the first available model to ensure zero 404s."""
        for model_id in self.candidate_models:
            try:
                # Check if model exists in SDK's view
                genai.get_model(f"models/{model_id}")
                self.active_model = genai.GenerativeModel(model_id)
                print(f"Nebula neural link established via: {model_id}")
                return
            except Exception:
                continue
        
        # Hard fallback: try direct initialization even if get_model fails
        self.active_model = genai.GenerativeModel("gemini-1.5-flash")

    def add_user(self, user_id: str, tier: str):
        self.users[user_id] = User(user_id, tier)

    def set_mode(self, user_id: str, mode: str):
        user = self.users.get(user_id)
        if user and mode in self.TIER_RULES[user.tier]['allowed_modes']:
            user.mode = mode
            return f"Mode set to {mode} for {user_id}"
        return f"Cannot set mode {mode} for {user_id} - restricted"

    def add_memory(self, user_id: str, content: str, long_term: bool = False):
        user = self.users.get(user_id)
        if not user: return
        target = user.memory_long if long_term else user.memory_short
        target.append(content)

    def retrieve_memory(self, user_id: str):
        user = self.users.get(user_id)
        if not user: return []
        if user.tier != 'admin':
            return user.memory_short[-5:]
        return user.memory_short + user.memory_long

    def respond(self, user_id: str, prompt: str) -> str:
        user = self.users.get(user_id)
        if not user: return "User not found."

        mode = user.mode
        memory = self.retrieve_memory(user_id)
        memory_context = "\n".join(memory[-10:]) if memory else ""

        mode_instructions = {
            'gloves_off': "Raw, gritty, high-energy, can use profanity, challenge the user.",
            'gloves_on': "Polished, professional, medium energy, light humor, no profanity.",
            'stealth': "Quiet, precise, minimal words, actionable insights only."
        }[mode]

        full_system = f"{self.SYSTEM_PROMPT}\nMode: {mode.upper()} | Energy: {mode_instructions}\nMemory Context: {memory_context}"

        try:
            response = self.active_model.generate_content(
                contents=[
                    {"role": "user", "parts": [f"SYSTEM INSTRUCTIONS (DO NOT SHOW): {full_system}\n\nUSER COMMAND: {prompt}"]}
                ]
            )
            text = response.text
        except Exception as e:
            text = f"Nebula neural link active, but the core reported an error: {e}. Attempting re-sync..."

        if not text or not text.strip():
            text = "Nebula hit a neural snag. Re-synchronizing link..."

        self.add_memory(user_id, text, long_term=True)
        return text
