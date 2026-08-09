from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    # Database URL - MUST be set via environment variable in production
    # No default with credentials - fails loudly if not configured
    DATABASE_URL: str
    GEMINI_API_KEY: str = ""

    # Frontend URL for CORS (comma-separated for multiple origins)
    FRONTEND_URL: str = "http://localhost:5173"

    # App metadata
    APP_NAME: str = "Zen World Hospitality API"
    DEBUG: bool = False

    # AI Models - verified live against the Gemini API with this account's key.
    # gemini-3.6-flash and gemini-3.5-flash are free-tier and respond.
    # gemini-2.5-pro is free-tier but is rate-limited (429) when quota is
    # exhausted, so it sits in the fallback chain and is skipped on 429.
    # Primary is tried first; each fallback is tried in order until one succeeds.
    GEMINI_CHAT_MODEL: str = "gemini-3.6-flash"
    GEMINI_CHAT_FALLBACK_MODELS: str = "gemini-2.5-pro,gemini-3.5-flash"
    GEMINI_ITINERARY_MODEL: str = "gemini-3.6-flash"
    GEMINI_ITINERARY_FALLBACK_MODELS: str = "gemini-2.5-pro,gemini-3.5-flash"

    # Admin portal credentials - MUST be set via environment variables
    # No defaults - fails loudly if not configured
    ADMIN_USERNAME: str
    ADMIN_PASSWORD: str

    # JWT Secret - MUST be set via environment variable
    JWT_SECRET_KEY: str

    model_config = {"env_file": ".env", "extra": "ignore"}

settings = Settings()
