from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, or_, select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import require_admin
from app.database import get_db
from app.models import Enquiry, Hotel, User
from app.schemas import HotelAdmin, HotelCreate, HotelListResponse, HotelPublic, HotelUpdate

router = APIRouter()


def _payload(data: HotelCreate) -> dict:
    out = data.model_dump()
    out["images"] = [img.model_dump() for img in data.images]
    out["room_types"] = [r.model_dump() for r in data.room_types]
    return out


@router.get("/hotels", response_model=HotelListResponse)
async def list_hotels(
    city: Optional[str] = None,
    q: Optional[str] = None,
    featured: Optional[bool] = None,
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    base = select(Hotel).where(Hotel.is_published.is_(True))
    query = base
    if city:
        query = query.where(func.lower(Hotel.city) == city.lower())
    if featured is not None:
        query = query.where(Hotel.is_featured.is_(featured))
    if q:
        term = f"%{q}%"
        query = query.where(or_(Hotel.name.ilike(term), Hotel.city.ilike(term), Hotel.locality.ilike(term)))

    total = await db.scalar(select(func.count()).select_from(query.subquery()))
    items = (await db.execute(query.order_by(Hotel.sort_order, Hotel.id).limit(limit))).scalars().all()
    cities = (await db.execute(select(Hotel.city).where(Hotel.is_published.is_(True)).distinct())).scalars().all()
    return HotelListResponse(items=items, total=total or 0, cities=sorted(c for c in cities if c))


@router.get("/hotels/{slug}", response_model=HotelPublic)
async def get_hotel(slug: str, db: AsyncSession = Depends(get_db)):
    hotel = (
        await db.execute(select(Hotel).where(Hotel.slug == slug, Hotel.is_published.is_(True)))
    ).scalar_one_or_none()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    return hotel


@router.get("/admin/hotels", response_model=List[HotelAdmin])
async def admin_list_hotels(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    return (await db.execute(select(Hotel).order_by(Hotel.sort_order, Hotel.id))).scalars().all()


@router.get("/admin/hotels/{hotel_id}", response_model=HotelAdmin)
async def admin_get_hotel(hotel_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    hotel = await db.get(Hotel, hotel_id)
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    return hotel


@router.post("/admin/hotels", response_model=HotelAdmin, status_code=201)
async def admin_create_hotel(data: HotelCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    hotel = Hotel(**_payload(data))
    db.add(hotel)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=409, detail="A hotel with this slug already exists")
    await db.refresh(hotel)
    return hotel


@router.put("/admin/hotels/{hotel_id}", response_model=HotelAdmin)
async def admin_update_hotel(
    hotel_id: int, data: HotelUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)
):
    hotel = await db.get(Hotel, hotel_id)
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    for key, value in _payload(data).items():
        setattr(hotel, key, value)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=409, detail="A hotel with this slug already exists")
    await db.refresh(hotel)
    return hotel


@router.delete("/admin/hotels/{hotel_id}", status_code=204)
async def admin_delete_hotel(hotel_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    hotel = await db.get(Hotel, hotel_id)
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    # Enquiries keep their hotel_name/slug snapshot; only the link is cleared.
    await db.execute(update(Enquiry).where(Enquiry.hotel_id == hotel_id).values(hotel_id=None))
    await db.delete(hotel)
    await db.commit()
    return None
