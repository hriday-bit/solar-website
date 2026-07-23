import csv
import io
import os
from datetime import datetime, timedelta

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import engine, get_db, SessionLocal
import models
import schemas
from auth import (
    verify_password, create_access_token,
    get_current_admin, seed_admin,
)

# ── Create all DB tables ─────────────────────────────────────────────────────
models.Base.metadata.create_all(bind=engine)

# ── Seed data (runs once on startup) ────────────────────────────────────────
INITIAL_PRODUCTS = [
    {"name": "Mono PERC Solar Panels", "description": "High-efficiency monocrystalline PERC panels with up to 21% efficiency. Ideal for rooftop and commercial installations with limited space.", "icon_key": "solar_panel_mono", "category": "Solar Panels", "is_featured": True},
    {"name": "Polycrystalline Solar Panels", "description": "Reliable and cost-effective polycrystalline panels perfect for large-scale installations. Industry-leading durability and performance.", "icon_key": "solar_panel_poly", "category": "Solar Panels"},
    {"name": "Tubular Solar Batteries", "description": "Deep-cycle tubular batteries engineered for solar applications. Long service life, low maintenance, and superior charge retention.", "icon_key": "battery_tubular", "category": "Solar Batteries", "is_featured": True},
    {"name": "Lithium (LiFePO4) Batteries", "description": "Lightweight, fast-charging lithium iron phosphate batteries with 4000+ cycle life. Zero maintenance and built-in BMS protection.", "icon_key": "battery_lithium", "category": "Solar Batteries"},
    {"name": "Solar Inverters / PCUs", "description": "UTL solar PCUs and hybrid inverters with PWM/MPPT charging. Pure sine wave output protects sensitive appliances.", "icon_key": "inverter", "category": "Solar Inverters"},
    {"name": "Solar Charge Controllers", "description": "MPPT and PWM solar charge controllers that maximise energy harvest and extend battery life. Available in 10A–100A ratings.", "icon_key": "charge_controller", "category": "Charge Controllers"},
    {"name": "On-Grid Solar Systems", "description": "Grid-connected solar systems with net metering. Feed surplus power back to the grid and slash your electricity bills to near zero.", "icon_key": "system_ongrid", "category": "Complete Systems", "is_featured": True},
    {"name": "Off-Grid Solar Systems", "description": "Fully autonomous solar systems with battery backup. Power your home or farm even in areas with frequent outages or no grid access.", "icon_key": "system_offgrid", "category": "Complete Systems"},
    {"name": "Hybrid Solar Systems", "description": "The best of both worlds — grid-tied with battery backup. Seamless switching ensures 24/7 power availability at maximum savings.", "icon_key": "system_hybrid", "category": "Complete Systems"},
]

REVIEWS = [
    {"id": 1, "reviewer_name": "Ramesh Sharma", "rating": 5, "quote": "Excellent service from Rishabh Enterprises! They installed a 3kW off-grid system at my farm. Works flawlessly even in cloudy weather. Highly recommended!", "location": "Dadri, UP"},
    {"id": 2, "reviewer_name": "Sunita Agarwal", "rating": 5, "quote": "Got UTL solar PCU and tubular batteries. My electricity bill dropped from ₹3,500 to under ₹300. The team is very professional and punctual.", "location": "Greater Noida, UP"},
    {"id": 3, "reviewer_name": "Vijay Yadav", "rating": 5, "quote": "Best solar dealer in Dadri! Genuine products, fair pricing, and amazing after-sales support. Installed a 5kW hybrid system last year — zero issues.", "location": "Bulandshahr, UP"},
    {"id": 4, "reviewer_name": "Priya Gupta", "rating": 5, "quote": "Very knowledgeable staff. They explained everything clearly and helped me choose the right system for my budget. The installation was super clean.", "location": "Noida, UP"},
    {"id": 5, "reviewer_name": "Anil Kumar", "rating": 5, "quote": "I was skeptical at first but the team at Rishabh Enterprises gave me full confidence. The panels are genuine UTL certified and performance is outstanding.", "location": "Hapur, UP"},
    {"id": 6, "reviewer_name": "Meera Singh", "rating": 5, "quote": "Our entire colony's rooftop systems were installed by Rishabh Enterprises. Competitive pricing, timely delivery, and flawless execution. 5 stars well deserved!", "location": "Dadri, UP"},
]


def seed_products(db: Session) -> None:
    """Insert each seed product only if a product with that exact name does not exist."""
    added = 0
    for p in INITIAL_PRODUCTS:
        exists = db.query(models.Product).filter(models.Product.name == p["name"]).first()
        if not exists:
            db_product = models.Product(
                name=p["name"],
                category=p["category"],
                description=p["description"],
                icon_key=p.get("icon_key"),
                in_stock=True,
                is_featured=p.get("is_featured", False),
            )
            db.add(db_product)
            added += 1
    if added:
        db.commit()
        print(f"✅ Seeded {added} new product(s) into database.")
    else:
        print("ℹ️  All seed products already exist — skipping.")


# Run seeds at startup
with SessionLocal() as db:
    seed_admin(db)
    seed_products(db)

# ── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Rishabh Enterprises UTL Solar API",
    description="Full-stack API for Rishabh Enterprises UTL Solar",
    version="2.0.0",
)

import re as _re

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ══════════════════════════════════════════════════════════════════════════════
# PUBLIC ENDPOINTS
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/", tags=["Health"])
async def root():
    return {"message": "Rishabh Enterprises UTL Solar API v2 🌞", "docs": "/docs"}


@app.get("/api/products", response_model=list[schemas.ProductPublic], tags=["Products"])
async def get_products(db: Session = Depends(get_db)):
    """Public: returns only in-stock products with like counts."""
    products = db.query(models.Product).filter(models.Product.in_stock == True).all()
    result = []
    for p in products:
        like_count = db.query(models.ProductLike).filter(
            models.ProductLike.product_id == p.id
        ).count()
        item = schemas.ProductPublic(
            id=p.id, name=p.name, description=p.description,
            icon_key=p.icon_key, category=p.category, price=p.price,
            image_url=p.image_url, in_stock=p.in_stock,
            is_featured=p.is_featured, like_count=like_count,
        )
        result.append(item)
    return result


@app.post("/api/products/{product_id}/like", tags=["Products"])
async def like_product(product_id: int, db: Session = Depends(get_db)):
    """Public: log a visitor 'Interested' click — no auth required."""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    like = models.ProductLike(product_id=product_id)
    db.add(like)
    db.commit()
    total = db.query(models.ProductLike).filter(
        models.ProductLike.product_id == product_id
    ).count()
    return {"success": True, "like_count": total}


@app.get("/api/reviews", tags=["Reviews"])
async def get_reviews():
    return {"reviews": REVIEWS}


@app.post("/api/contact", status_code=201, tags=["Contact"])
async def submit_contact(contact: schemas.ContactCreate, db: Session = Depends(get_db)):
    db_contact = models.ContactSubmission(
        name=contact.name, phone=contact.phone,
        message=contact.message, status="New",
    )
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return {"success": True, "message": f"Thank you, {contact.name}! We'll call you back shortly."}


# ══════════════════════════════════════════════════════════════════════════════
# AUTH ENDPOINTS
# ══════════════════════════════════════════════════════════════════════════════

@app.post("/api/auth/login", response_model=schemas.TokenResponse, tags=["Auth"])
async def admin_login(credentials: schemas.LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(models.AdminUser).filter(
        models.AdminUser.username == credentials.username
    ).first()
    if not admin or not verify_password(credentials.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    token = create_access_token(data={"sub": admin.username})
    return {"access_token": token, "token_type": "bearer", "username": admin.username}


# ══════════════════════════════════════════════════════════════════════════════
# ADMIN — LEADS
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/admin/leads", tags=["Admin - Leads"])
async def admin_get_leads(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    leads = db.query(models.ContactSubmission).order_by(
        models.ContactSubmission.created_at.desc()
    ).all()
    return {"leads": [schemas.LeadResponse.model_validate(l) for l in leads], "count": len(leads)}


@app.patch("/api/admin/leads/{lead_id}", tags=["Admin - Leads"])
async def admin_update_lead_status(
    lead_id: int,
    update: schemas.LeadStatusUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    lead = db.query(models.ContactSubmission).filter(
        models.ContactSubmission.id == lead_id
    ).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    lead.status = update.status
    db.commit()
    return {"success": True, "id": lead_id, "status": update.status}


@app.get("/api/admin/leads/export", tags=["Admin - Leads"])
async def admin_export_leads_csv(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    """Returns all leads as a downloadable CSV file."""
    leads = db.query(models.ContactSubmission).order_by(
        models.ContactSubmission.created_at.desc()
    ).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Name", "Phone", "Message", "Status", "Date"])
    for lead in leads:
        writer.writerow([
            lead.id, lead.name, lead.phone, lead.message,
            lead.status,
            lead.created_at.strftime("%Y-%m-%d %H:%M") if lead.created_at else "",
        ])
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=rishabh-solar-leads.csv"},
    )


# ══════════════════════════════════════════════════════════════════════════════
# ADMIN — PRODUCTS
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/admin/products", tags=["Admin - Products"])
async def admin_get_products(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    products = db.query(models.Product).order_by(models.Product.created_at.desc()).all()
    result = []
    for p in products:
        like_count = db.query(models.ProductLike).filter(
            models.ProductLike.product_id == p.id
        ).count()
        item = schemas.ProductAdmin(
            id=p.id, name=p.name, category=p.category, description=p.description,
            price=p.price, image_url=p.image_url, icon_key=p.icon_key,
            in_stock=p.in_stock, is_featured=p.is_featured,
            created_at=p.created_at, like_count=like_count,
        )
        result.append(item)
    return {"products": result}


@app.post("/api/admin/products", status_code=201, tags=["Admin - Products"])
async def admin_create_product(
    product: schemas.ProductCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return {"success": True, "id": db_product.id, "message": "Product created successfully"}


@app.patch("/api/admin/products/{product_id}", tags=["Admin - Products"])
async def admin_update_product(
    product_id: int,
    update: schemas.ProductUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    update_data = update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)
    db.commit()
    return {"success": True, "message": "Product updated"}


@app.delete("/api/admin/products/{product_id}", tags=["Admin - Products"])
async def admin_delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"success": True, "message": "Product deleted"}


# ══════════════════════════════════════════════════════════════════════════════
# ADMIN — ANALYTICS
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/admin/analytics", response_model=schemas.AnalyticsResponse, tags=["Admin - Analytics"])
async def admin_analytics(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    now = datetime.utcnow()
    week_ago = now - timedelta(days=7)
    month_ago = now - timedelta(days=30)

    total_week = db.query(models.ContactSubmission).filter(
        models.ContactSubmission.created_at >= week_ago
    ).count()
    total_month = db.query(models.ContactSubmission).filter(
        models.ContactSubmission.created_at >= month_ago
    ).count()
    total_all = db.query(models.ContactSubmission).count()

    # Lead counts grouped by status
    status_rows = (
        db.query(models.ContactSubmission.status, func.count(models.ContactSubmission.id))
        .group_by(models.ContactSubmission.status)
        .all()
    )
    lead_status_counts = [schemas.LeadStatusCount(status=s, count=c) for s, c in status_rows]

    # Products ranked by likes
    products = db.query(models.Product).all()
    product_stats = []
    for p in products:
        lc = db.query(models.ProductLike).filter(models.ProductLike.product_id == p.id).count()
        product_stats.append(schemas.ProductLikeStat(id=p.id, name=p.name, category=p.category, like_count=lc))
    product_stats.sort(key=lambda x: x.like_count, reverse=True)

    in_stock_count = db.query(models.Product).filter(models.Product.in_stock == True).count()

    return schemas.AnalyticsResponse(
        total_leads_week=total_week,
        total_leads_month=total_month,
        total_leads_all=total_all,
        lead_status_counts=lead_status_counts,
        top_products_by_likes=product_stats[:10],
        total_products_in_stock=in_stock_count,
    )
