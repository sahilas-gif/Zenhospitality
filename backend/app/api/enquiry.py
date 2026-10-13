import logging

from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func
from typing import List, Optional, Any
from pydantic import BaseModel
from app.database import get_db
from app.models import Package, Enquiry, AiItinerary, User, Hotel, StatusEnum
from app.schemas import (
    PackageCreate, PackageResponse, EnquiryCreate, EnquiryResponse, EnquiryStatusUpdate,
    AiItineraryRequest, AiItineraryResponse,
    ChatRequest, ChatResponse
)
from app.auth import require_admin
from app.services.ai_service import AiUnavailable, CHAT_FALLBACK, generate_custom_itinerary, handle_chat_message
from app.limiter import limiter

router = APIRouter()
logger = logging.getLogger("zen")


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
@limiter.limit("20/hour")
async def create_enquiry(request: Request, enquiry: EnquiryCreate, db: AsyncSession = Depends(get_db)):
    if enquiry.website:
        raise HTTPException(status_code=400, detail="Invalid submission")

    data = enquiry.model_dump(exclude={"website"})
    for key in ("check_in", "check_out"):
        if data[key] is not None:
            data[key] = data[key].isoformat()

    if enquiry.hotel_id is not None:
        hotel = await db.get(Hotel, enquiry.hotel_id)
        if not hotel or not hotel.is_published:
            raise HTTPException(status_code=422, detail="Hotel not found")
        data.update(hotel_name=hotel.name, hotel_slug=hotel.slug, hotel_city=hotel.city)
        data["enquiry_type"] = data["enquiry_type"] or "hotel"
    if enquiry.package_id is not None and not await db.get(Package, enquiry.package_id):
        data["package_id"] = None
    data["enquiry_type"] = data["enquiry_type"] or ("package" if data["package_id"] else "general")

    db_enquiry = Enquiry(**data)
    db.add(db_enquiry)
    await db.commit()
    await db.refresh(db_enquiry)
    return db_enquiry


# ─── Admin Routes ───────────────────────────────────────────────


@router.get("/admin/enquiries", response_model=List[EnquiryResponse])
async def list_enquiries(
    response: Response,
    status: Optional[str] = None,
    enquiry_type: Optional[str] = None,
    hotel_id: Optional[int] = None,
    search: Optional[str] = Query(None, description="Search by customer name, phone or hotel"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    query = select(Enquiry)
    if status:
        query = query.where(Enquiry.status == status)
    if enquiry_type:
        query = query.where(Enquiry.enquiry_type == enquiry_type)
    if hotel_id:
        query = query.where(Enquiry.hotel_id == hotel_id)
    if search:
        search_term = f"%{search}%"
        query = query.where(
            or_(
                Enquiry.customer_name.ilike(search_term),
                Enquiry.customer_phone.ilike(search_term),
                Enquiry.hotel_name.ilike(search_term),
            )
        )

    total = await db.scalar(select(func.count()).select_from(query.subquery()))
    response.headers["X-Total-Count"] = str(total or 0)

    query = query.order_by(Enquiry.id.desc()).offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    return result.scalars().all()


@router.patch("/admin/enquiries/{enquiry_id}/status", response_model=EnquiryResponse)
async def update_enquiry_status(
    enquiry_id: int,
    status: Optional[str] = None,
    body: Optional[EnquiryStatusUpdate] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    new_status = (body.status if body else None) or status
    if new_status not in {s.value for s in StatusEnum}:
        raise HTTPException(status_code=422, detail="Invalid status")
    enquiry = await db.get(Enquiry, enquiry_id)
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    enquiry.status = new_status
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
    hotels = await _planner_hotels(db, request_data.destination, request_data.hotel_slugs)
    try:
        itinerary_data = await generate_custom_itinerary(
            request_data.destination,
            request_data.duration_days,
            request_data.budget,
            request_data.interests,
            travellers=request_data.travellers,
            travel_month=request_data.travel_month,
            pace=request_data.pace,
            hotels=hotels,
        )
    except AiUnavailable:
        raise HTTPException(
            status_code=503,
            detail="The planner is busy right now. Please try again in a minute, or WhatsApp us for a custom plan.",
        )

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
async def chat_with_ai(request: Request, request_data: ChatRequest, db: AsyncSession = Depends(get_db)):
    messages = [{"role": msg.role, "content": msg.content} for msg in request_data.messages]
    hotels = await _planner_hotels(db, "", [], limit=12)
    await db.close()
    try:
        return ChatResponse(response=await handle_chat_message(messages, hotels))
    except Exception:
        logger.exception("Chat reply failed")
        return ChatResponse(response=CHAT_FALLBACK, fallback=True)


async def _planner_hotels(db: AsyncSession, destination: str, slugs: List[str], limit: int = 8) -> List[dict]:
    query = select(Hotel).where(Hotel.is_published.is_(True))
    filters = []
    if slugs:
        filters.append(Hotel.slug.in_(slugs))
    words = [w for w in destination.replace(",", " ").split() if len(w) > 2]
    for w in words:
        filters.append(Hotel.city.ilike(f"%{w}%"))
        filters.append(Hotel.locality.ilike(f"%{w}%"))
        filters.append(Hotel.state.ilike(f"%{w}%"))
    if filters:
        query = query.where(or_(*filters))
    elif destination:
        return []
    result = await db.execute(query.order_by(Hotel.sort_order, Hotel.id).limit(limit))
    return [
        {"slug": h.slug, "name": h.name, "city": h.city, "locality": h.locality, "summary": h.summary}
        for h in result.scalars().all()
    ]
