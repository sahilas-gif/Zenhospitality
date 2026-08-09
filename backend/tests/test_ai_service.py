import os
import unittest
from types import SimpleNamespace
from unittest import mock

# Required env vars must be present before app.config.settings is instantiated.
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./test_ai.db")
os.environ.setdefault("ADMIN_USERNAME", "admin")
os.environ.setdefault("ADMIN_PASSWORD", "pw")
os.environ.setdefault("JWT_SECRET_KEY", "test-key")
os.environ.setdefault("GEMINI_API_KEY", "test-key")
os.environ.setdefault("GEMINI_CHAT_MODEL", "gemini-3.6-flash")
os.environ.setdefault("GEMINI_ITINERARY_MODEL", "gemini-3.6-flash")
os.environ.setdefault("GEMINI_CHAT_FALLBACK_MODELS", "gemini-2.5-pro,gemini-3.5-flash")
os.environ.setdefault("GEMINI_ITINERARY_FALLBACK_MODELS", "gemini-2.5-pro,gemini-3.5-flash")

from app.services import ai_service


CHAT_FALLBACK = (
    "I apologize, but I am currently experiencing technical difficulties."
    " Please call us at +91 80978 62804 for immediate assistance."
)


class _FailingInteractions:
    """A genai client stand-in whose call always raises (e.g. model 404)."""

    def create(self, **kwargs):
        raise RuntimeError("Model 'gemini-3.1-pro' not found. Did you mean 'gemini-2.5-pro'?")


class _FailingClient:
    interactions = _FailingInteractions()


class _SequencingInteractions:
    """Fails on the first model, then succeeds -- to prove the fallback chain."""

    def __init__(self):
        self.calls = 0

    def create(self, **kwargs):
        self.calls += 1
        model = kwargs.get("model")
        if self.calls == 1:
            raise RuntimeError(f"primary model {model} is rate-limited (429)")
        return SimpleNamespace(output_text=f"ok-from-{model}")


class _SequencingClient:
    def __init__(self, seq):
        self.interactions = seq


class ChatFailureSurfacingTest(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        # A fresh module so per-call caching never leaks between tests.
        ai_service._client = None
        # Belt-and-braces: if the seam patch ever fails to prevent a real
        # genai client, constructing one raises here instead of hitting the
        # network -- so the tests can never hang on an external API call.
        client_patcher = mock.patch("app.services.ai_service.genai.Client")
        self._mock_client = client_patcher.start()
        self.addCleanup(client_patcher.stop)

    async def test_api_failure_returns_fallback(self):
        with mock.patch.object(ai_service, "_get_client", return_value=_FailingClient()):
            result = await ai_service.handle_chat_message([{"role": "user", "content": "hi"}])
        self.assertEqual(result, CHAT_FALLBACK)

    async def test_api_failure_is_logged_not_silently_swallowed(self):
        # Regression: a broken model name previously returned the generic
        # fallback with only a print(), so the real error was invisible.
        with mock.patch.object(ai_service, "_get_client", return_value=_FailingClient()):
            with self.assertLogs(ai_service.logger, level="ERROR") as logs:
                await ai_service.handle_chat_message([{"role": "user", "content": "hi"}])
        self.assertTrue(
            any("gemini-3.1-pro" in msg for msg in logs.output),
            "expected the root cause to appear in the logs",
        )

    async def test_falls_back_to_next_model_when_primary_fails(self):
        # The primary (e.g. gemini-3.6-flash) is down; the service must retry
        # the next model and return its output, not the generic fallback.
        seq = _SequencingInteractions()
        with mock.patch.object(ai_service, "_get_client", return_value=_SequencingClient(seq)):
            result = await ai_service.handle_chat_message([{"role": "user", "content": "hi"}])
        self.assertEqual(seq.calls, 2, "expected exactly one retry after the first model failed")
        self.assertTrue(result.startswith("ok-from-"), f"expected a model response, got: {result!r}")

    async def test_missing_key_returns_key_fallback(self):
        with mock.patch.object(ai_service, "_get_client", return_value=None):
            result = await ai_service.handle_chat_message([{"role": "user", "content": "hi"}])
        self.assertIn("API Key not configured", result)


if __name__ == "__main__":
    unittest.main()