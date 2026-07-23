"""
One-shot script: remove duplicate products keeping the earliest (lowest id) per name.
Run from the backend/ directory:  python dedup_products.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal
from models import Product, ProductLike

db = SessionLocal()

all_products = db.query(Product).order_by(Product.id).all()
seen_names = {}
to_delete = []

for p in all_products:
    name = p.name.strip()
    if name in seen_names:
        to_delete.append(p)
        print(f"  Duplicate found → id={p.id}, name='{p.name}' — will delete")
    else:
        seen_names[name] = p.id

if not to_delete:
    print("✅ No duplicate products found. Database is clean.")
else:
    for dup in to_delete:
        # Remove its likes first to satisfy FK constraints
        db.query(ProductLike).filter(ProductLike.product_id == dup.id).delete()
        db.delete(dup)
    db.commit()
    print(f"✅ Removed {len(to_delete)} duplicate product(s) from database.")

remaining = db.query(Product).order_by(Product.id).all()
print(f"\nRemaining products ({len(remaining)}):")
for p in remaining:
    print(f"  [{p.id}] {p.name} ({p.category})")

db.close()
