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
    # gemini-2.5-flash is retired for new users (404); pro-tier models 429 due
    # to quota (only flash tier is usable). gemini-flash-latest is an evergreen
    # alias, so it cannot silently go stale the way the old invented names did.
    GEMINI_ITINERARY_MODEL: str = "gemini-flash-latest"
    GEMINI_CHAT_MODEL: str = "gemini-flash-latest"

    # Admin portal credentials - MUST be set via environment variables
    # No defaults - fails loudly if not configured
    ADMIN_USERNAME: str
    ADMIN_PASSWORD: str

    # JWT Secret - MUST be set via environment variable
    JWT_SECRET_KEY: str

    model_config = {"env_file": ".env", "extra": "ignore"}

settings = Settings()
