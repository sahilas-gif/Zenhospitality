import os
from google import genai
from dotenv import load_dotenv

load_dotenv("backend/.env")

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

try:
    interaction = client.interactions.create(
        model="gemini-3.6-flash",
        input="Explain how AI works in a few words"
    )
    print(interaction.output_text)
except Exception as e:
    print("Error:", e)
