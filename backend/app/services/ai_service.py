import json
import logging
from google import genai
from google.genai import types
from pydantic import BaseModel
from typing import List, Optional
from app.config import settings

logger = logging.getLogger(__name__)

_client = None

def _get_client():
    global _client
    if _client is None:
        if not settings.GEMINI_API_KEY:
            return None
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return _client

class DailyActivity(BaseModel):
    time: str
    activity: str
    description: str

class DayItinerary(BaseModel):
    day: int
    title: str
    activities: List[DailyActivity]
    accommodation_suggestion: str
    estimated_cost: Optional[str] = None

class Itinerary(BaseModel):
    destination: str
    duration_days: int
    budget_summary: Optional[str] = None
    travel_tips: Optional[List[str]] = None
    days: List[DayItinerary]

ITINERARY_MODEL = settings.GEMINI_ITINERARY_MODEL
CHAT_MODEL = settings.GEMINI_CHAT_MODEL

async def generate_custom_itinerary(
    destination: str, duration_days: int, budget: str, interests: str
) -> dict:
    client = _get_client()
    if not client:
        return {
            "error": "GEMINI_API_KEY is not configured in .env",
            "destination": destination,
            "duration_days": duration_days,
            "fallback": True,
        }

    prompt = f"""Create a detailed day-by-day travel itinerary for {destination} for {duration_days} days on a {budget} budget.
Traveler interests: {interests}

You MUST return the result as a valid JSON object matching the following schema EXACTLY, without any markdown formatting or extra text:
{{
  "destination": "string",
  "duration_days": 0,
  "budget_summary": "string",
  "travel_tips": ["string"],
  "days": [
    {{
      "day": 0,
      "title": "string",
      "activities": [
        {{
          "time": "string",
          "activity": "string",
          "description": "string"
        }}
      ],
      "accommodation_suggestion": "string",
      "estimated_cost": "string"
    }}
  ]
}}
"""

    system_instruction = """You are an expert travel planner. You MUST strictly adhere to the user's specific interests and budget. 
Crucially, NEVER suggest activities that wildly mismatch the interests (e.g., do not suggest wine tasting or luxury spas for someone who explicitly wants an economy trek). Focus heavily on the requested activities. Return ONLY valid JSON."""

    import asyncio
    try:
        def _call_api():
            return client.interactions.create(
                model=ITINERARY_MODEL,
                input=prompt,
                system_instruction=system_instruction
            )
        interaction = await asyncio.to_thread(_call_api)
        text = interaction.output_text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return json.loads(text.strip())
    except Exception as e:
        logger.exception("Itinerary generation failed: %s", e)
        return {
            "error": f"Failed to generate itinerary: {str(e)}",
            "destination": destination,
            "duration_days": duration_days,
            "fallback": True,
        }


async def handle_chat_message(messages: List[dict]) -> str:
    client = _get_client()
    if not client:
        return "I apologize, but my AI system is currently offline (API Key not configured). Please call us at +91 80978 62804 for immediate assistance."

    system_instruction = """You are the AI Customer Support Agent for Zen World Hospitality (a Raj Gupta Travel Agency).
Your goal is to assist customers, answer questions about our services, and encourage them to book with us.

COMPANY CONTEXT:
- Phone: +91 80978 62804 or +91 80973 77058
- Email: sales@zenhospitality.in or connect.zenworld@gmail.com
- Location: Mumbai, Maharashtra, India

CORE SERVICES:
1. Corporate Travel Management: End-to-end booking for flights, hotels, and transit for businesses.
2. MICE & Event Accommodations: Meetings, Incentives, Conferences, and Exhibitions management.
3. Retail & B2C Booking: Premium customized travel packages for individuals (Goa, Rajasthan, Kerala, Bali, etc.).
4. Hotel Management & Operator Services: OTA optimization, revenue management, pre-opening advisory, and outsourcing.

INSTRUCTIONS:
- Be polite, professional, and concise. Use a premium, hospitable tone.
- If a user wants to book, tell them to use the 'Enquire Now' buttons on our packages, or give them our phone number.
- Do NOT make up prices that are not listed.
- Keep responses relatively short (1-3 paragraphs) as this is a chat interface."""

    prompt = "Conversation History:\n"
    for msg in messages[:-1]:
        role = "User" if msg["role"] == "user" else "Assistant"
        prompt += f"{role}: {msg['content']}\n"
    
    user_message = messages[-1]["content"] if messages else "Hello"
    prompt += f"User: {user_message}\nAssistant: "

    import asyncio
    try:
        def _call_chat_api():
            return client.interactions.create(
                model=CHAT_MODEL,
                input=prompt,
                system_instruction=system_instruction
            )
        interaction = await asyncio.to_thread(_call_chat_api)
        return interaction.output_text
    except Exception as e:
        logger.exception("Chat failed: %s", e)
        return "I apologize, but I am currently experiencing technical difficulties. Please call us at +91 80978 62804 for immediate assistance."
