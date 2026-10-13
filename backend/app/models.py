from sqlalchemy import Column, Integer, String, Float, JSON, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class CategoryEnum(str, enum.Enum):
    travel_booking = "travel_booking"
    corporate = "corporate"
    hotel_management = "hotel_management"


class StatusEnum(str, enum.Enum):
    new = "new"
    contacted = "contacted"
    converted = "converted"
    closed = "closed"


class Package(Base):
    __tablename__ = "packages"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    slug = Column(String, unique=True, index=True)
    description = Column(Text)
    # Store enum as plain String for SQLite compatibility (and PG)
    category = Column(String)
    destination = Column(String)
    duration_days = Column(Integer)
    price_from = Column(Float)
    price_to = Column(Float)
    highlights = Column(JSON)
    images = Column(JSON, nullable=True) # Changed from image_url for multi-image
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    enquiries = relationship("Enquiry", back_populates="package")


class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(Integer, primary_key=True, index=True)
    package_id = Column(Integer, ForeignKey("packages.id"), nullable=True, index=True)
    custom_itinerary = Column(JSON, nullable=True)
    customer_name = Column(String)
    customer_phone = Column(String)
    travel_date = Column(String, nullable=True)
    group_size = Column(Integer, nullable=True)
    message = Column(Text, nullable=True)
    # Store enum as plain String for SQLite compatibility (and PG)
    status = Column(String, default=StatusEnum.new.value)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Added by migration 2 (all nullable so old rows stay valid)
    enquiry_type = Column(String, nullable=True, index=True)
    hotel_id = Column(Integer, ForeignKey("hotels.id", ondelete="SET NULL"), nullable=True, index=True)
    hotel_name = Column(String, nullable=True)
    hotel_slug = Column(String, nullable=True)
    hotel_city = Column(String, nullable=True)
    room_type = Column(String, nullable=True)
    customer_email = Column(String, nullable=True)
    check_in = Column(String, nullable=True)
    check_out = Column(String, nullable=True)
    adults = Column(Integer, nullable=True)
    children = Column(Integer, nullable=True)
    rooms = Column(Integer, nullable=True)
    itinerary_id = Column(Integer, nullable=True)
    source_page = Column(String, nullable=True)

    package = relationship("Package", back_populates="enquiries")
    hotel = relationship("Hotel", back_populates="enquiries")


class Hotel(Base):
    __tablename__ = "hotels"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=True)
    locality = Column(String, nullable=True)
    city = Column(String, nullable=False, index=True)
    state = Column(String, nullable=True)
    country = Column(String, default="India")
    summary = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    star_rating = Column(Integer, nullable=True)
    check_in_time = Column(String, nullable=True)
    check_out_time = Column(String, nullable=True)
    price_from = Column(Float, nullable=True)
    rate_note = Column(String, nullable=True)
    amenities = Column(JSON, default=list)
    highlights = Column(JSON, default=list)
    nearby = Column(JSON, default=list)
    policies = Column(JSON, default=list)
    images = Column(JSON, default=list)
    room_types = Column(JSON, default=list)
    is_published = Column(Boolean, default=False, index=True)
    is_featured = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    enquiries = relationship("Enquiry", back_populates="hotel")


class AiItinerary(Base):
    __tablename__ = "ai_itineraries"

    id = Column(Integer, primary_key=True, index=True)
    prompt = Column(Text)
    destination = Column(String)
    duration_days = Column(Integer)
    budget = Column(String)
    itinerary_data = Column(JSON)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class PageContent(Base):
    __tablename__ = "page_contents"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True)
    content = Column(JSON)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
