from sqlalchemy import (
    Column, Integer, String, DateTime, Boolean, Float, ForeignKey, Text
)
from sqlalchemy.sql import func
from database import Base


class ContactSubmission(Base):
    """Contact form submissions / Leads."""
    __tablename__ = "contact_submissions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    message = Column(String(1000), nullable=False)
    status = Column(String(20), default="New", server_default="New")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Product(Base):
    """Solar products catalogue stored in DB."""
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=True)
    image_url = Column(String(500), nullable=True)
    icon_key = Column(String(100), nullable=True)
    in_stock = Column(Boolean, default=True, server_default="1")
    is_featured = Column(Boolean, default=False, server_default="0")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ProductLike(Base):
    """One row per visitor 'Interested' click on a product."""
    __tablename__ = "product_likes"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AdminUser(Base):
    """Single admin account for the private panel."""
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(200), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
