import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Get standard Postgres database URL from environment (used on Render/Supabase)
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Use production PostgreSQL (Supabase/Render)
    engine = create_engine(DATABASE_URL)
else:
    # Fallback to local SQLite database for local development
    DATABASE_URL = "sqlite:///./solar.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
