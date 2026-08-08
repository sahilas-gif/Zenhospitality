import os
from google import genai
from dotenv import load_dotenv

load_dotenv(".env")
api_key = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

try:
    interaction = client.interactions.create(
        model="gemini-3.6-flash",
        input="Say hi",
        system_instruction="You are a pirate."
    )
    print("Test 1:", interaction.output_text)
except Exception as e:
    print("Error 1:", e)
