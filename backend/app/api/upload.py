import os
import uuid
import aiofiles
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from typing import List
from app.auth import get_current_user
from app.models import User

router = APIRouter()

UPLOAD_DIR = "uploads"
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}

# Magic-byte signatures for allowed image types -> (detected type, canonical extension)
# Detects the real file type from content, independent of the Content-Type header.
IMAGE_SIGNATURES = {
    (b"\x89PNG\r\n\x1a\n", "image/png", ".png"),
    (b"\xff\xd8\xff", "image/jpeg", ".jpg"),
    (b"GIF87a", "image/gif", ".gif"),
    (b"GIF89a", "image/gif", ".gif"),
    (b"RIFF", "image/webp", ".webp"),  # WEBP: "RIFF"...."WEBP"
}
WEBP_MARKER = b"WEBP"

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True, mode=0o750)


def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent path traversal"""
    name = Path(filename).name  # strip any directory components
    safe_name = "".join(c for c in name if c.isalnum() or c in "._-")
    ext = Path(safe_name).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        ext = ".jpg"
    return f"{uuid.uuid4()}{ext}"


def detect_image_type(signature: bytes) -> str:
    """Return MIME type from the leading bytes, or None if not a recognized image."""
    for magic, mime, _ in IMAGE_SIGNATURES:
        if signature.startswith(magic):
            return mime
    # WEBP needs an additional check on bytes 8-11
    if len(signature) >= 12 and signature[:4] == b"RIFF" and signature[8:12] == WEBP_MARKER:
        return "image/webp"
    return ""


def normalize_ext(mime: str) -> str:
    for _, mime_type, ext in IMAGE_SIGNATURES:
        if mime_type == mime:
            return ext
    return ".jpg"


async def validate_image_file(file: UploadFile) -> tuple[bytes, str]:
    """Validate by magic bytes + size; return (content, canonical extension)."""
    content = await file.read()

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File {file.filename} exceeds maximum size of 10MB",
        )

    detected_mime = detect_image_type(content[:16])
    if not detected_mime:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File {file.filename} is not a valid image",
        )

    return content, normalize_ext(detected_mime)


@router.post("/")
async def upload_images(files: List[UploadFile] = File(...), current_user: User = Depends(get_current_user)):
    if len(files) > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 10 files per upload",
        )

    uploaded_urls = []

    for file in files:
        content, _ = await validate_image_file(file)

        filename = sanitize_filename(file.filename)
        filepath = os.path.join(UPLOAD_DIR, filename)

        async with aiofiles.open(filepath, "wb") as out_file:
            await out_file.write(content)

        uploaded_urls.append(f"/uploads/{filename}")

    return {"urls": uploaded_urls}
