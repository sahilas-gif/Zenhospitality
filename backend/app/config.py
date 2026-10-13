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

    # gemini-2.5-pro is gone for this key. gemini-2.5-flash is the model that answers.
    GEMINI_CHAT_MODEL: str = "gemini-flash-latest"
    GEMINI_CHAT_FALLBACK_MODELS: str = "gemini-3.5-flash,gemini-2.5-flash"
    GEMINI_ITINERARY_MODEL: str = "gemini-flash-latest"
    GEMINI_ITINERARY_FALLBACK_MODELS: str = "gemini-3.5-flash,gemini-2.5-flash"

    # Admin portal credentials - MUST be set via environment variables
    # No defaults - fails loudly if not configured
    ADMIN_USERNAME: str
    ADMIN_PASSWORD: str

    # JWT Secret - MUST be set via environment variable
    JWT_SECRET_KEY: str

    # Public site used for canonical URLs, sitemap and social previews
    SITE_URL: str = "https://zenhospitality.in"
    # Built index.html used as the template for server-rendered hotel pages
    FRONTEND_INDEX_PATH: str = "/home/zenhospi/public_html/index.html"

    # Gemini request budget (seconds)
    AI_ATTEMPT_TIMEOUT: float = 40.0
    AI_TOTAL_TIMEOUT: float = 70.0

    model_config = {"env_file": ".env", "extra": "ignore"}

settings = Settings()
