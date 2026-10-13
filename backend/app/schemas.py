import re
from pydantic import BaseModel, EmailStr, field_validator, model_validator
from typing import Optional, List, Any
from datetime import datetime, date
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


ENQUIRY_TYPES = ("package", "hotel", "transport", "itinerary", "general")


class EnquiryBase(BaseModel):
    package_id: Optional[int] = None
    custom_itinerary: Optional[dict] = None
    customer_name: str
    customer_phone: str
    travel_date: Optional[str] = None
    group_size: Optional[int] = None
    message: Optional[str] = None
    enquiry_type: Optional[str] = None
    hotel_id: Optional[int] = None
    room_type: Optional[str] = None
    customer_email: Optional[str] = None
    check_in: Optional[date] = None
    check_out: Optional[date] = None
    adults: Optional[int] = None
    children: Optional[int] = None
    rooms: Optional[int] = None
    itinerary_id: Optional[int] = None
    source_page: Optional[str] = None


class EnquiryCreate(EnquiryBase):
    # Honeypot: real visitors never see or fill this field
    website: Optional[str] = None

    @field_validator("customer_name")
    @classmethod
    def _name(cls, v: str) -> str:
        v = v.strip()
        if not 2 <= len(v) <= 120:
            raise ValueError("Please enter your name")
        return v

    @field_validator("customer_phone")
    @classmethod
    def _phone(cls, v: str) -> str:
        digits = re.sub(r"\D", "", v or "")
        if not 7 <= len(digits) <= 15:
            raise ValueError("Please enter a valid phone number")
        return v.strip()

    @field_validator("customer_email")
    @classmethod
    def _email(cls, v: Optional[str]) -> Optional[str]:
        if v is None or not v.strip():
            return None
        v = v.strip()
        if not EMAIL_RE.fullmatch(v):
            raise ValueError("Please enter a valid email")
        return v

    @field_validator("enquiry_type")
    @classmethod
    def _type(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in ENQUIRY_TYPES:
            raise ValueError("Unknown enquiry type")
        return v

    @field_validator("message", "room_type", "source_page")
    @classmethod
    def _limit(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and len(v) > 4000:
            raise ValueError("Text is too long")
        return v

    @field_validator("group_size", "adults", "rooms")
    @classmethod
    def _positive(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and not 1 <= v <= 500:
            raise ValueError("Must be between 1 and 500")
        return v

    @field_validator("children")
    @classmethod
    def _children(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and not 0 <= v <= 500:
            raise ValueError("Must be between 0 and 500")
        return v

    @model_validator(mode="after")
    def _dates(self):
        if self.check_in and self.check_out and self.check_out <= self.check_in:
            raise ValueError("Check-out must be after check-in")
        return self


class EnquiryResponse(BaseModel):
    id: int
    reference: str = ""
    package_id: Optional[int] = None
    custom_itinerary: Optional[dict] = None
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    travel_date: Optional[str] = None
    group_size: Optional[int] = None
    message: Optional[str] = None
    status: Optional[str] = "new"
    created_at: Optional[datetime] = None
    enquiry_type: Optional[str] = None
    hotel_id: Optional[int] = None
    hotel_name: Optional[str] = None
    hotel_slug: Optional[str] = None
    hotel_city: Optional[str] = None
    room_type: Optional[str] = None
    customer_email: Optional[str] = None
    check_in: Optional[str] = None
    check_out: Optional[str] = None
    adults: Optional[int] = None
    children: Optional[int] = None
    rooms: Optional[int] = None
    itinerary_id: Optional[int] = None
    source_page: Optional[str] = None

    model_config = {"from_attributes": True}

    @model_validator(mode="after")
    def _ref(self):
        self.reference = f"ZEN-{self.id:06d}"
        return self


class EnquiryStatusUpdate(BaseModel):
    status: str


# ---------------------------------------------------------------- hotels

EMAIL_RE = re.compile(r"[^@\s]+@[^@\s]+\.[A-Za-z]{2,}")
_PHONE_RE = re.compile(r"\+?\d[\d\s().-]{7,}\d")
_URL_RE = re.compile(r"(https?://|www\.)", re.I)
_IMAGE_URL_RE = re.compile(r"^(https://[^\s\"'<>]+|/api/uploads/[\w.-]+|/images/[\w./-]+)$")


def contains_contact(text: str) -> bool:
    if not text:
        return False
    if EMAIL_RE.search(text) or _URL_RE.search(text):
        return True
    return any(len(re.sub(r"\D", "", m)) >= 8 for m in _PHONE_RE.findall(text))


def _clean_text(v: Optional[str], field: str) -> Optional[str]:
    if v is None:
        return None
    v = v.strip()
    if contains_contact(v):
        raise ValueError(f"{field} must not contain phone numbers, emails or links")
    return v or None


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")[:80]


class HotelImage(BaseModel):
    url: str
    alt: str = ""
    caption: Optional[str] = None

    @field_validator("url")
    @classmethod
    def _url(cls, v: str) -> str:
        v = v.strip()
        if ".." in v or not _IMAGE_URL_RE.match(v):
            raise ValueError("Image URL must be https, /api/uploads/ or /images/")
        return v

    @field_validator("alt", "caption")
    @classmethod
    def _text(cls, v):
        return _clean_text(v, "Image text") or ("" if v is not None else None)


class RoomType(BaseModel):
    name: str
    description: Optional[str] = None
    occupancy: Optional[str] = None
    features: List[str] = []

    @field_validator("name", "description", "occupancy")
    @classmethod
    def _text(cls, v):
        return _clean_text(v, "Room text")

    @field_validator("features")
    @classmethod
    def _features(cls, v):
        return [x for x in (_clean_text(i, "Room feature") for i in v) if x]


class HotelBase(BaseModel):
    name: str
    slug: Optional[str] = None
    category: Optional[str] = None
    locality: Optional[str] = None
    city: str
    state: Optional[str] = None
    country: Optional[str] = "India"
    summary: Optional[str] = None
    description: Optional[str] = None
    star_rating: Optional[int] = None
    check_in_time: Optional[str] = None
    check_out_time: Optional[str] = None
    price_from: Optional[float] = None
    rate_note: Optional[str] = None
    amenities: List[str] = []
    highlights: List[str] = []
    nearby: List[str] = []
    policies: List[str] = []
    images: List[HotelImage] = []
    room_types: List[RoomType] = []
    is_published: bool = False
    is_featured: bool = False
    sort_order: int = 0

    @field_validator("name", "category", "locality", "city", "state", "country",
                     "summary", "description", "check_in_time", "check_out_time", "rate_note")
    @classmethod
    def _text(cls, v, info):
        return _clean_text(v, info.field_name.replace("_", " ").capitalize())

    @field_validator("amenities", "highlights", "nearby", "policies")
    @classmethod
    def _lists(cls, v, info):
        return [x for x in (_clean_text(i, info.field_name.capitalize()) for i in v) if x]

    @field_validator("star_rating")
    @classmethod
    def _stars(cls, v):
        if v is not None and not 1 <= v <= 7:
            raise ValueError("Star rating must be 1 to 7")
        return v

    @field_validator("price_from")
    @classmethod
    def _price(cls, v):
        if v is not None and v <= 0:
            return None
        return v

    @field_validator("slug")
    @classmethod
    def _slug(cls, v):
        if v is None or not v.strip():
            return None
        s = slugify(v)
        if not s:
            raise ValueError("Invalid slug")
        return s

    @model_validator(mode="after")
    def _required(self):
        if not self.name:
            raise ValueError("Name is required")
        if not self.city:
            raise ValueError("City is required")
        if not self.slug:
            self.slug = slugify(self.name)
        return self


class HotelCreate(HotelBase):
    pass


class HotelUpdate(HotelBase):
    pass


class HotelPublic(BaseModel):
    id: int
    slug: str
    name: str
    category: Optional[str] = None
    locality: Optional[str] = None
    city: str
    state: Optional[str] = None
    country: Optional[str] = None
    summary: Optional[str] = None
    description: Optional[str] = None
    star_rating: Optional[int] = None
    check_in_time: Optional[str] = None
    check_out_time: Optional[str] = None
    price_from: Optional[float] = None
    rate_note: Optional[str] = None
    amenities: List[str] = []
    highlights: List[str] = []
    nearby: List[str] = []
    policies: List[str] = []
    images: List[Any] = []
    room_types: List[Any] = []
    is_featured: bool = False

    model_config = {"from_attributes": True}

    @field_validator("amenities", "highlights", "nearby", "policies", "images", "room_types", mode="before")
    @classmethod
    def _none_list(cls, v):
        return v or []


class HotelAdmin(HotelPublic):
    is_published: bool = False
    sort_order: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class HotelListResponse(BaseModel):
    items: List[HotelPublic]
    total: int
    cities: List[str] = []


# ---------------------------------------------------------------- AI

class AiItineraryRequest(BaseModel):
    destination: str
    duration_days: int
    budget: str
    interests: str = ""
    travellers: Optional[int] = None
    travel_month: Optional[str] = None
    pace: Optional[str] = None
    hotel_slugs: List[str] = []

    @field_validator("destination")
    @classmethod
    def _dest(cls, v: str) -> str:
        v = v.strip()
        if not 2 <= len(v) <= 100:
            raise ValueError("Please enter a destination")
        return v

    @field_validator("duration_days")
    @classmethod
    def _days(cls, v: int) -> int:
        if not 1 <= v <= 21:
            raise ValueError("Trips can be 1 to 21 days")
        return v

    @field_validator("interests", "budget")
    @classmethod
    def _short(cls, v: str) -> str:
        if len(v) > 500:
            raise ValueError("Text is too long")
        return v

    @field_validator("hotel_slugs")
    @classmethod
    def _slugs(cls, v: List[str]) -> List[str]:
        return v[:5]


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

    @field_validator("messages")
    @classmethod
    def _messages(cls, v):
        if not v:
            raise ValueError("Message required")
        return v[-20:]


class ChatResponse(BaseModel):
    response: str
    fallback: bool = False

class PageContentBase(BaseModel):
    slug: str
    content: Any

class PageContentCreate(PageContentBase):
    pass

class PageContentResponse(PageContentBase):
    id: int
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
