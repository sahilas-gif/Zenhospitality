import asyncio
import logging
import time
from typing import List, Optional

from google import genai
from pydantic import BaseModel, ValidationError

from app.config import settings
from app.contact import CONTACT_EMAIL, CONTACT_PHONE_DISPLAY

logger = logging.getLogger(__name__)

_client = None


class AiUnavailable(Exception):
    """Raised when no model produced a valid answer within the time budget."""


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
    hotel_slug: Optional[str] = None
    estimated_cost: Optional[str] = None


class Itinerary(BaseModel):
    destination: str
    duration_days: int
    summary: Optional[str] = None
    budget_summary: Optional[str] = None
    travel_tips: List[str] = []
    days: List[DayItinerary]


def _model_chain(primary: str, fallbacks: str) -> List[str]:
    return [primary] + [m.strip() for m in (fallbacks or "").split(",") if m.strip()]


ITINERARY_MODELS = _model_chain(settings.GEMINI_ITINERARY_MODEL, settings.GEMINI_ITINERARY_FALLBACK_MODELS)
CHAT_MODELS = _model_chain(settings.GEMINI_CHAT_MODEL, settings.GEMINI_CHAT_FALLBACK_MODELS)


async def _run_chain(models: List[str], call) -> object:
    """Try each model in order inside one overall deadline."""
    deadline = time.monotonic() + settings.AI_TOTAL_TIMEOUT
    last_error: Optional[Exception] = None
    for model in models:
        remaining = deadline - time.monotonic()
        if remaining <= 1:
            break
        try:
            return await asyncio.wait_for(
                asyncio.to_thread(call, model), timeout=min(settings.AI_ATTEMPT_TIMEOUT, remaining)
            )
        except Exception as e:  # timeout, quota, invalid output
            last_error = e
            logger.warning("Gemini model %s failed: %s", model, type(e).__name__)
    raise AiUnavailable(str(last_error) if last_error else "timeout")


def _hotel_lines(hotels: List[dict]) -> str:
    if not hotels:
        return "No partner hotels are listed for this destination."
    return "\n".join(
        f"- slug={h['slug']} | {h['name']} | {h.get('locality') or ''} {h['city']} | {h.get('summary') or ''}"
        for h in hotels
    )


async def generate_custom_itinerary(
    destination: str,
    duration_days: int,
    budget: str,
    interests: str,
    travellers: Optional[int] = None,
    travel_month: Optional[str] = None,
    pace: Optional[str] = None,
    hotels: Optional[List[dict]] = None,
) -> dict:
    client = _get_client()
    if not client:
        raise AiUnavailable("not configured")

    hotels = hotels or []
    allowed = {h["slug"] for h in hotels}
    details = [f"Destination: {destination}", f"Days: {duration_days}", f"Budget: {budget}"]
    if interests:
        details.append(f"Interests: {interests}")
    if travellers:
        details.append(f"Travellers: {travellers}")
    if travel_month:
        details.append(f"Month of travel: {travel_month}")
    if pace:
        details.append(f"Pace: {pace}")

    prompt = (
        "Plan a day-by-day trip.\n"
        + "\n".join(details)
        + "\n\nZen World Hospitality partner hotels you may recommend:\n"
        + _hotel_lines(hotels)
        + "\n\nRules: return exactly the requested number of days. When a partner hotel suits the day, "
        "set hotel_slug to its slug and name it in accommodation_suggestion; otherwise leave hotel_slug "
        "empty and describe the kind of stay. Never invent hotel names as partners, prices, phone numbers, "
        "emails or links. Costs are rough ranges in INR."
    )
    system_instruction = (
        "You are the trip planner for Zen World Hospitality, a Mumbai travel company. Match the traveller's "
        "interests and budget closely; never suggest activities that contradict them."
    )

    def call(model: str):
        interaction = client.interactions.create(
            model=model,
            input=prompt,
            system_instruction=system_instruction,
            response_format={
                "type": "text",
                "mime_type": "application/json",
                "schema": Itinerary.model_json_schema(),
            },
        )
        itinerary = Itinerary.model_validate_json(interaction.output_text)
        if not itinerary.days:
            raise ValueError("empty itinerary")
        return itinerary

    try:
        itinerary = await _run_chain(ITINERARY_MODELS, call)
    except ValidationError as e:
        raise AiUnavailable(str(e))

    data = itinerary.model_dump()
    data["days"] = data["days"][:duration_days]
    by_slug = {h["slug"]: h for h in hotels}
    for day in data["days"]:
        slug = day.get("hotel_slug")
        if slug not in allowed:
            day["hotel_slug"] = None
            day["hotel"] = None
        else:
            h = by_slug[slug]
            day["hotel"] = {"slug": slug, "name": h["name"], "city": h["city"]}
    return data


CHAT_SYSTEM = f"""You are the concierge for Zen World Hospitality (Mumbai, India).
Contact: WhatsApp or call {CONTACT_PHONE_DISPLAY}; email {CONTACT_EMAIL}. Never give any other number or email,
and never share a partner hotel's own phone or email: all bookings go through Zen.

Services: corporate travel, MICE and events, domestic and international holidays, partner hotel stays
with best rates via Zen, outstation cabs and coaches, and hotel management consulting.

Be warm, concise (1-3 short paragraphs) and never invent prices. To book, point people to the
"Enquire" buttons or WhatsApp."""

CHAT_FALLBACK = (
    f"I can't answer right now. Please WhatsApp or call us on {CONTACT_PHONE_DISPLAY}, "
    f"or email {CONTACT_EMAIL}, and the team will help."
)


async def handle_chat_message(messages: List[dict], hotels: Optional[List[dict]] = None) -> str:
    client = _get_client()
    if not client:
        raise AiUnavailable("not configured")

    system_instruction = CHAT_SYSTEM
    if hotels:
        system_instruction += "\n\nPartner hotels:\n" + _hotel_lines(hotels)

    history = messages[-12:]
    prompt = "Conversation so far:\n"
    for msg in history[:-1]:
        role = "Guest" if msg["role"] == "user" else "Concierge"
        prompt += f"{role}: {msg['content'][:2000]}\n"
    prompt += f"Guest: {history[-1]['content'][:2000] if history else 'Hello'}\nConcierge:"

    def call(model: str):
        text = client.interactions.create(
            model=model, input=prompt, system_instruction=system_instruction
        ).output_text
        if not text or not text.strip():
            raise ValueError("empty reply")
        return text.strip()

    return await _run_chain(CHAT_MODELS, call)

