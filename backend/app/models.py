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

    package = relationship("Package", back_populates="enquiries")


class AiItinerary(Base):
    __tablename__ = "ai_itineraries"

    id = Column(Integer, primary_key=True, index=True)
    prompt = Column(Text)
    destination = Column(String)
    duration_days = Column(Integer)
    budget = Column(String)
    itinerary_data = Column(JSON)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
