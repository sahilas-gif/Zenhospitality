from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from datetime import datetime
from app.models import CategoryEnum, StatusEnum

class UserBase(BaseModel):
    email: EmailStr
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None


class PackageBase(BaseModel):
    title: str
    slug: str
    description: str
    category: str
    destination: str
    duration_days: int
    price_from: float
    price_to: float
    highlights: Optional[Any] = None
    images: Optional[List[str]] = None
    is_featured: bool = False

class PackageCreate(PackageBase):
    pass


class PackageResponse(PackageBase):
    id: int
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class EnquiryBase(BaseModel):
    package_id: Optional[int] = None
    custom_itinerary: Optional[dict] = None
    customer_name: str
    customer_phone: str
    travel_date: Optional[str] = None
    group_size: Optional[int] = None
    message: Optional[str] = None


class EnquiryCreate(EnquiryBase):
    pass


class EnquiryResponse(EnquiryBase):
    id: int
    status: Optional[str] = "new"
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class AiItineraryRequest(BaseModel):
    destination: str
    duration_days: int
    budget: str
    interests: str


class AiItineraryResponse(BaseModel):
    id: int
    prompt: str
    destination: str
    duration_days: int
    budget: str
    itinerary_data: Any
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]


class ChatResponse(BaseModel):
    response: str

