import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Get Turso credentials from environment (used on Render)
TURSO_DB_URL = os.getenv("TURSO_DATABASE_URL")
TURSO_AUTH_TOKEN = os.getenv("TURSO_AUTH_TOKEN")

if TURSO_DB_URL and TURSO_AUTH_TOKEN:
    # Remote Turso database (SQLAlchemy requires sqlite+libsql:// prefix instead of libsql://)
    url_host = TURSO_DB_URL.replace("libsql://", "").replace("https://", "")
    DATABASE_URL = f"sqlite+libsql://{url_host}/?authToken={TURSO_AUTH_TOKEN}&secure=true"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
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
