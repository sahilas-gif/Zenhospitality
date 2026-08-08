from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.database import engine, Base
from app.api.enquiry import router as enquiry_router
from app.api.auth import router as auth_router
from app.api.upload import router as upload_router
from app.seed_admin import ensure_admin_user
from app.config import settings
from app.limiter import limiter
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await ensure_admin_user()
    yield

app = FastAPI(title="Zen World Hospitality API", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Parse CORS origins from settings
cors_origins = [origin.strip() for origin in settings.FRONTEND_URL.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

os.makedirs("uploads", exist_ok=True, mode=0o750)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(enquiry_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(upload_router, prefix="/api/v1/upload", tags=["upload"])

@app.get("/health")
async def health_check():
    return {"status": "ok"}
