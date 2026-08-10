import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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
for local_origin in ("http://localhost:5173", "http://127.0.0.1:5173"):
    if local_origin not in cors_origins:
        cors_origins.append(local_origin)

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

# Support both /v1 and /api/v1 prefixes to handle all cPanel routing modes
app.include_router(enquiry_router, prefix="/v1")
app.include_router(enquiry_router, prefix="/api")
app.include_router(enquiry_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/v1/auth", tags=["auth"])
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(upload_router, prefix="/v1/upload", tags=["upload"])
app.include_router(upload_router, prefix="/api/upload", tags=["upload"])
app.include_router(upload_router, prefix="/api/v1/upload", tags=["upload"])

@app.get("/health")
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}


# Serve the built React app. Registered last so API/health/uploads routes win,
# then non-API paths fall through to the SPA (index.html for client-side routing).
FRONTEND_DIR = os.environ.get(
    "FRONTEND_DIR",
    os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")),
)
_INDEX_FILE = os.path.join(FRONTEND_DIR, "index.html")
_ASSET_EXTS = {
    ".js", ".css", ".json", ".jpg", ".jpeg", ".png", ".gif", ".svg",
    ".ico", ".webp", ".avif", ".woff", ".woff2", ".ttf", ".otf", ".map",
}


@app.get("/{full_path:path}", include_in_schema=False)
async def serve_spa(full_path: str):
    root = os.path.realpath(FRONTEND_DIR)
    if full_path and not full_path.startswith("api/"):
        candidate = os.path.realpath(os.path.join(root, full_path))
        if candidate.startswith(root) and os.path.isfile(candidate):
            return FileResponse(candidate)

    ext = os.path.splitext(full_path)[1].lower()
    if ext in _ASSET_EXTS:
        raise HTTPException(status_code=404)

    if os.path.isfile(_INDEX_FILE):
        return FileResponse(_INDEX_FILE)
    raise HTTPException(status_code=404, detail="Frontend not built. Run npm run build.")
