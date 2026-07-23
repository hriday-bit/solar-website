import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import models
from database import DATABASE_URL as LOCAL_URL

# The user's Turso credentials
TURSO_DB_URL = "libsql://solar-db-hriday-bit.aws-ap-south-1.turso.io"
TURSO_AUTH_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODQ3NDMwODQsImlkIjoiMDE5ZjhhZjktMGEwMS03MGVlLWFlOTgtYzFiYWEwZWU2OWI2Iiwia2lkIjoiblYtWUVkRjNsd3o4QjA5UTFfVm9pU1RZX0lKUWNkd09TMHdMaURZTV9oSSIsInJpZCI6ImVhZmFmMjY1LTFmOTktNDk5Yy04NGY3LTBlZTE0NDI2YTUzZSJ9.n_whbBkuOPXRI2Sh-K07Aa1Oa6aOSFLWTb6xAHMME-JNgMFJ3e9vVzxxOOuwW_BdVnWdjpHNW2GP7AfhEKrGAQ"

print("1. Connecting to remote Turso database...")
url_host = TURSO_DB_URL.replace("libsql://", "").replace("https://", "")
REMOTE_URL = f"sqlite+libsql://{url_host}/?authToken={TURSO_AUTH_TOKEN}&secure=true"

# Engines
local_engine = create_engine("sqlite:///./solar.db")
remote_engine = create_engine(REMOTE_URL)

LocalSession = sessionmaker(bind=local_engine)
RemoteSession = sessionmaker(bind=remote_engine)

print("2. Creating tables on Turso...")
models.Base.metadata.create_all(bind=remote_engine)

print("3. Migrating data...")
with LocalSession() as local_db, RemoteSession() as remote_db:
    # 1. Migrate Admin Users
    admins = local_db.query(models.AdminUser).all()
    for a in admins:
        if not remote_db.query(models.AdminUser).filter_by(username=a.username).first():
            remote_db.add(models.AdminUser(username=a.username, hashed_password=a.hashed_password, created_at=a.created_at))
    
    # 2. Migrate Products
    products = local_db.query(models.Product).all()
    for p in products:
        if not remote_db.query(models.Product).filter_by(name=p.name).first():
            remote_db.add(models.Product(
                name=p.name, category=p.category, description=p.description,
                price=p.price, image_url=p.image_url, icon_key=p.icon_key,
                in_stock=p.in_stock, is_featured=p.is_featured, created_at=p.created_at
            ))
    
    remote_db.commit()
    print("✅ Migration complete! Your cloud database is now fully synced.")
