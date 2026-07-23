from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ── Contact / Lead ──────────────────────────────────────────────────────────

class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=7, max_length=20)
    message: str = Field(..., min_length=5, max_length=1000)


class LeadResponse(BaseModel):
    id: int
    name: str
    phone: str
    message: str
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class LeadStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(New|Contacted|Quoted|Converted|Lost)$")


class SuccessResponse(BaseModel):
    success: bool
    message: str


# ── Product ──────────────────────────────────────────────────────────────────

class ProductPublic(BaseModel):
    id: int
    name: str
    description: str
    icon_key: Optional[str] = None
    category: str
    price: Optional[float] = None
    image_url: Optional[str] = None
    in_stock: bool
    is_featured: bool
    like_count: Optional[int] = 0

    class Config:
        from_attributes = True


class ProductAdmin(BaseModel):
    id: int
    name: str
    category: str
    description: str
    price: Optional[float] = None
    image_url: Optional[str] = None
    icon_key: Optional[str] = None
    in_stock: bool
    is_featured: bool
    created_at: Optional[datetime] = None
    like_count: Optional[int] = 0

    class Config:
        from_attributes = True


class ProductCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    category: str = Field(..., min_length=2, max_length=100)
    description: str = Field(..., min_length=5)
    price: Optional[float] = None
    image_url: Optional[str] = None
    icon_key: Optional[str] = None
    in_stock: bool = True
    is_featured: bool = False


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    icon_key: Optional[str] = None
    in_stock: Optional[bool] = None
    is_featured: Optional[bool] = None


# ── Reviews (hardcoded, no DB) ───────────────────────────────────────────────

class Review(BaseModel):
    id: int
    reviewer_name: str
    rating: int
    quote: str
    location: str


# ── Auth ─────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str


# ── Analytics ────────────────────────────────────────────────────────────────

class ProductLikeStat(BaseModel):
    id: int
    name: str
    category: str
    like_count: int


class LeadStatusCount(BaseModel):
    status: str
    count: int


class AnalyticsResponse(BaseModel):
    total_leads_week: int
    total_leads_month: int
    total_leads_all: int
    lead_status_counts: List[LeadStatusCount]
    top_products_by_likes: List[ProductLikeStat]
    total_products_in_stock: int
