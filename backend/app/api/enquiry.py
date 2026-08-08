from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func
from typing import List, Optional, Any
from pydantic import BaseModel
from app.database import get_db
from app.models import Package, Enquiry, AiItinerary, User
from app.schemas import (
    PackageCreate, PackageResponse, EnquiryCreate, EnquiryResponse,
    AiItineraryRequest, AiItineraryResponse,
    ChatRequest, ChatResponse
)
from app.auth import get_current_user
from app.services.ai_service import generate_custom_itinerary
from app.limiter import limiter

router = APIRouter()


def require_admin(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    page_size: int
    total_pages: int


# ─── Package Routes ─────────────────────────────────────────────


@router.get("/packages", response_model=List[PackageResponse])
async def list_packages(
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    query = select(Package)
    if category:
        query = query.where(Package.category == category)
    if featured is not None:
        query = query.where(Package.is_featured == featured)

    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query)

    # Apply pagination
    query = query.order_by(Package.id).offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    items = result.scalars().all()

    return items


@router.get("/packages/{package_id}", response_model=PackageResponse)
async def get_package(package_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Package).where(Package.id == package_id))
    package = result.scalar_one_or_none()
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    return package

@router.post("/packages", response_model=PackageResponse, status_code=201)
async def create_package(package: PackageCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    db_package = Package(**package.model_dump())
    db.add(db_package)
    await db.commit()
    await db.refresh(db_package)
    return db_package

@router.put("/packages/{package_id}", response_model=PackageResponse)
async def update_package(package_id: int, package: PackageCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    result = await db.execute(select(Package).where(Package.id == package_id))
    db_package = result.scalar_one_or_none()
    if not db_package:
        raise HTTPException(status_code=404, detail="Package not found")

    for key, value in package.model_dump().items():
        setattr(db_package, key, value)

    await db.commit()
    await db.refresh(db_package)
    return db_package

@router.delete("/packages/{package_id}", status_code=204)
async def delete_package(package_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    result = await db.execute(select(Package).where(Package.id == package_id))
    db_package = result.scalar_one_or_none()
    if not db_package:
        raise HTTPException(status_code=404, detail="Package not found")

    await db.delete(db_package)
    await db.commit()
    return None


# ─── Enquiry Routes ─────────────────────────────────────────────


@router.post("/enquiries", response_model=EnquiryResponse, status_code=201)
async def create_enquiry(enquiry: EnquiryCreate, db: AsyncSession = Depends(get_db)):
    db_enquiry = Enquiry(**enquiry.model_dump())
    db.add(db_enquiry)
    await db.commit()
    await db.refresh(db_enquiry)
    return db_enquiry


# ─── Admin Routes ───────────────────────────────────────────────


@router.get("/admin/enquiries", response_model=List[EnquiryResponse])
async def list_enquiries(
    status: Optional[str] = None,
    search: Optional[str] = Query(None, description="Search by customer name or phone"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    query = select(Enquiry)
    if status:
        query = query.where(Enquiry.status == status)
    if search:
        search_term = f"%{search}%"
        query = query.where(
            or_(
                Enquiry.customer_name.ilike(search_term),
                Enquiry.customer_phone.ilike(search_term),
            )
        )

    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query)

    # Apply pagination
    query = query.order_by(Enquiry.id.desc()).offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    return result.scalars().all()


@router.patch("/admin/enquiries/{enquiry_id}/status", response_model=EnquiryResponse)
async def update_enquiry_status(
    enquiry_id: int,
    status: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    result = await db.execute(select(Enquiry).where(Enquiry.id == enquiry_id))
    enquiry = result.scalar_one_or_none()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    enquiry.status = status
    await db.commit()
    await db.refresh(enquiry)
    return enquiry


# ─── AI Itinerary Routes ────────────────────────────────────────


@router.post("/ai/generate-itinerary", response_model=AiItineraryResponse, status_code=201)
@limiter.limit("10/minute")
async def create_ai_itinerary(
    request: Request,
    request_data: AiItineraryRequest,
    db: AsyncSession = Depends(get_db)
):
    try:
        itinerary_data = await generate_custom_itinerary(
            request_data.destination,
            request_data.duration_days,
            request_data.budget,
            request_data.interests,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="AI generation failed")

    db_ai_itinerary = AiItinerary(
        prompt=request_data.interests,
        destination=request_data.destination,
        duration_days=request_data.duration_days,
        budget=request_data.budget,
        itinerary_data=itinerary_data,
    )
    db.add(db_ai_itinerary)
    await db.commit()
    await db.refresh(db_ai_itinerary)
    return db_ai_itinerary


@router.post("/ai/chat", response_model=ChatResponse)
@limiter.limit("30/minute")
async def chat_with_ai(request: Request, request_data: ChatRequest):
    from app.services.ai_service import handle_chat_message
    try:
        # Convert Pydantic models to dicts for the service function
        messages = [{"role": msg.role, "content": msg.content} for msg in request_data.messages]
        response_text = await handle_chat_message(messages)
        return ChatResponse(response=response_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Chat service temporarily unavailable")
