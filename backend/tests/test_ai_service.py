import json
from types import SimpleNamespace
from unittest import mock

import pytest

from app.services import ai_service

VALID = {
    "destination": "Lonavala",
    "duration_days": 2,
    "summary": "Hills",
    "travel_tips": ["Carry rain gear"],
    "days": [
        {"day": 1, "title": "Arrive", "activities": [{"time": "10:00", "activity": "Karla Caves", "description": "x"}],
         "accommodation_suggestion": "The Purple Mango", "hotel_slug": "the-purple-mango"},
        {"day": 2, "title": "Hike", "activities": [], "accommodation_suggestion": "Fake Palace", "hotel_slug": "fake-palace"},
        {"day": 3, "title": "Extra", "activities": [], "accommodation_suggestion": "x"},
    ],
}
HOTELS = [{"slug": "the-purple-mango", "name": "The Purple Mango", "city": "Lonavala"}]


class Interactions:
    def __init__(self, outputs):
        self.outputs = list(outputs)
        self.kwargs = []

    def create(self, **kwargs):
        self.kwargs.append(kwargs)
        out = self.outputs.pop(0)
        if isinstance(out, Exception):
            raise out
        return SimpleNamespace(output_text=out)


def client(outputs):
    return SimpleNamespace(interactions=Interactions(outputs))


@pytest.mark.asyncio
async def test_itinerary_uses_structured_output_and_filters_hotels():
    with mock.patch.object(ai_service, "_get_client", return_value=object()), mock.patch.object(
        ai_service, "_generate", return_value=json.dumps(VALID)
    ) as gen:
        data = await ai_service.generate_custom_itinerary("Lonavala", 2, "mid", "", hotels=HOTELS)
    assert gen.call_args.kwargs["as_json"] is True
    assert len(data["days"]) == 2
    assert data["days"][0]["hotel"]["name"] == "The Purple Mango"
    assert data["days"][1]["hotel_slug"] is None


@pytest.mark.asyncio
async def test_itinerary_falls_back_then_raises():
    with mock.patch.object(ai_service, "_get_client", return_value=object()), mock.patch.object(
        ai_service, "_generate", side_effect=[RuntimeError("429"), ValueError("not json"), RuntimeError("down")]
    ):
        with pytest.raises(ai_service.AiUnavailable):
            await ai_service.generate_custom_itinerary("Goa", 2, "mid", "")


@pytest.mark.asyncio
async def test_chat_falls_back_to_next_model():
    with mock.patch.object(ai_service, "_get_client", return_value=object()), mock.patch.object(
        ai_service, "_generate", side_effect=[RuntimeError("429"), "Hello from Zen"]
    ):
        assert await ai_service.handle_chat_message([{"role": "user", "content": "hi"}]) == "Hello from Zen"


@pytest.mark.asyncio
async def test_missing_key_is_unavailable():
    with mock.patch.object(ai_service, "_get_client", return_value=None):
        with pytest.raises(ai_service.AiUnavailable):
            await ai_service.handle_chat_message([{"role": "user", "content": "hi"}])


def test_chat_prompt_has_only_current_contacts():
    assert "88280 15060" in ai_service.CHAT_SYSTEM
    for old in ("80978", "80973", "sales@"):
        assert old not in ai_service.CHAT_SYSTEM
        assert old not in ai_service.CHAT_FALLBACK
