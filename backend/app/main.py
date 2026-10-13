import logging
import os
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from sqlalchemy import text

from app.api.auth import router as auth_router
from app.api.enquiry import router as enquiry_router
from app.api.hotels import router as hotels_router
from app.api.pages import router as pages_router
from app.api.seo import router as seo_router
from app.api.upload import router as upload_router
from app.config import settings
from app.database import engine
from app.limiter import limiter
from app.seed_admin import ensure_admin_user

logger = logging.getLogger("zen")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Schema changes run only through `python -m app.migrations`, never at startup.
    try:
        await ensure_admin_user()
    except Exception:
        logger.exception("Admin bootstrap skipped")
    yield


app = FastAPI(title="Zen World Hospitality API", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    request_id = uuid.uuid4().hex[:12]
    logger.exception("Unhandled error %s on %s %s", request_id, request.method, request.url.path)
    return JSONResponse(
        status_code=500,
        content={"detail": "Something went wrong. Please try again.", "request_id": request_id},
    )


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
    expose_headers=["X-Total-Count"],
)

os.makedirs("uploads", exist_ok=True, mode=0o750)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/api/uploads", StaticFiles(directory="uploads"), name="api-uploads")

# cPanel may forward with or without the /api base URI, so every router is served on all four.
PREFIXES = ("", "/v1", "/api", "/api/v1")
ROUTERS = (
    (enquiry_router, "", None),
    (auth_router, "/auth", "auth"),
    (upload_router, "/upload", "upload"),
    (pages_router, "", "pages"),
    (hotels_router, "", "hotels"),
    (seo_router, "/seo", "seo"),
)
for router, path, tag in ROUTERS:
    for prefix in PREFIXES:
        app.include_router(router, prefix=prefix + path, tags=[tag] if tag else None)


@app.get("/health")
@app.get("/api/health")
async def health_check():
    schema_version = None
    try:
        async with engine.connect() as conn:
            schema_version = await conn.scalar(text("SELECT MAX(version) FROM schema_migrations"))
    except Exception:
        pass
    return {"status": "ok", "schema_version": schema_version}


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
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404)
    if full_path:
        candidate = os.path.realpath(os.path.join(root, full_path))
        if candidate.startswith(root + os.sep) and os.path.isfile(candidate):
            return FileResponse(candidate)

    ext = os.path.splitext(full_path)[1].lower()
    if ext in _ASSET_EXTS:
        raise HTTPException(status_code=404)

    if os.path.isfile(_INDEX_FILE):
        return FileResponse(_INDEX_FILE)
    raise HTTPException(status_code=404, detail="Frontend not built. Run npm run build.")
