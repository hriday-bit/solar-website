# Rishabh Enterprises UTL Solar — Backend (FastAPI)

## Setup & Run

### 1. Create & activate a virtual environment
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Start the development server
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at: **http://localhost:8000**

Interactive API docs (Swagger UI): **http://localhost:8000/docs**

## API Endpoints

| Method | Path            | Description                              |
|--------|-----------------|------------------------------------------|
| GET    | /api/products   | Returns list of solar products           |
| POST   | /api/contact    | Accepts contact form submissions         |
| GET    | /api/reviews    | Returns sample 5-star customer reviews   |

## Project Structure
```
backend/
├── main.py          # FastAPI app with all routes
├── models.py        # SQLAlchemy ORM models
├── schemas.py       # Pydantic request/response schemas
├── database.py      # SQLite database connection setup
├── requirements.txt # Python dependencies
└── README.md        # This file
```

> The SQLite database file (`solar.db`) is auto-created on first run.
