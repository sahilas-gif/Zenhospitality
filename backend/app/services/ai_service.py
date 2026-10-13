import asyncio
import json
import logging
import time
import urllib.error
import urllib.request
from typing import List, Optional

from google import genai
from pydantic import BaseModel, ValidationError

from app.config import settings
from app.contact import CONTACT_EMAIL, CONTACT_PHONE_DISPLAY

logger = logging.getLogger(__name__)

_client = None


class AiUnavailable(Exception):
    """Raised when no model produced a valid answer within the time budget."""


def _generate(model: str, prompt: str, system_instruction: str, as_json: bool = False) -> str:
    """Call generateContent directly. The installed SDK's interactions call does not return from this server."""
    if not settings.GEMINI_API_KEY:
        raise AiUnavailable("not configured")
    payload = {
        "system_instruction": {"parts": [{"text": system_instruction}]},
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
    }
    if as_json:
        payload["generationConfig"] = {"responseMimeType": "application/json"}
    body = json.dumps(payload).encode()
    request = urllib.request.Request(
        f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
        data=body,
        headers={"Content-Type": "application/json", "X-goog-api-key": settings.GEMINI_API_KEY},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=35) as response:
            payload = json.loads(response.read().decode())
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode(errors="replace")[:300]
        raise RuntimeError(f"HTTP {exc.code} {detail}") from exc
    parts = payload["candidates"][0]["content"]["parts"]
    text = "".join(part.get("text", "") for part in parts if "text" in part)
    return text


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
            logger.warning("Gemini model %s failed: %s", model, str(e)[:180])
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
        "emails or links. Costs are rough ranges in INR. Reply with JSON only, in this shape and no other keys: "
        '{"destination":"","duration_days":1,"summary":"","budget_summary":"","travel_tips":[""],'
        '"days":[{"day":1,"title":"","activities":[{"time":"09:00","activity":"","description":""}],'
        '"accommodation_suggestion":"","hotel_slug":"","estimated_cost":""}]}'
    )
    system_instruction = (
        "You are the trip planner for Zen World Hospitality, a Mumbai travel company. Match the traveller's "
        "interests and budget closely; never suggest activities that contradict them."
    )

    def call(model: str):
        raw = _generate(model, prompt, system_instruction, as_json=True).strip()
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[-1].rsplit("```", 1)[0].strip()
        itinerary = Itinerary.model_validate_json(raw)
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


CHAT_SYSTEM = f"""You work at Zen World Hospitality in Mumbai.
You answer questions about partner hotels, domestic tours (Kerala, Goa, Gujarat, Mumbai, Uttar Pradesh, Maharashtra, the Chardham), outstation cabs and coaches, company travel, meetings and events, and how to use this website.
Contact is only WhatsApp or call {CONTACT_PHONE_DISPLAY}, or email {CONTACT_EMAIL}. Never give any other number or email, and never share a partner hotel's own phone or email. Bookings go through Zen, on WhatsApp or the quote button.
Write short replies, two or three sentences. Do not invent prices. Do not call yourself a concierge, an assistant, or an AI. You are someone at Zen answering the question."""

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
        role = "Guest" if msg["role"] == "user" else "Zen"
        prompt += f"{role}: {msg['content'][:2000]}\n"
    prompt += f"Guest: {history[-1]['content'][:2000] if history else 'Hello'}\nZen:"

    def call(model: str):
        text = _generate(model, prompt, system_instruction)
        if not text or not text.strip():
            raise ValueError("empty reply")
        return text.strip()

    return await _run_chain(CHAT_MODELS, call)

