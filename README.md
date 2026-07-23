# 🌞 Rishabh Enterprises UTL Solar — Full-Stack Website

A modern, full-stack business website for **Rishabh Enterprises UTL Solar** — authorized dealer of solar panels, batteries, inverters, and complete solar systems in Dadri, UP.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI (Python), SQLAlchemy, SQLite, Pydantic, Uvicorn |
| Frontend | React 18 (Vite), Tailwind CSS v4, Framer Motion, Axios |

---

## 📁 Project Structure

```
rishabh-solar-fullstack-app/
├── backend/
│   ├── main.py           # FastAPI app — all routes
│   ├── models.py         # SQLAlchemy ORM models
│   ├── schemas.py        # Pydantic validation schemas
│   ├── database.py       # SQLite DB setup
│   ├── requirements.txt  # Python deps
│   └── README.md         # Backend run instructions
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Hero.jsx
    │   │   ├── About.jsx
    │   │   ├── Products.jsx
    │   │   ├── WhyUs.jsx
    │   │   ├── Reviews.jsx
    │   │   ├── Gallery.jsx
    │   │   ├── Contact.jsx
    │   │   ├── Footer.jsx
    │   │   └── WhatsAppFloat.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── public/favicon.svg
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── .env
```

---

## 🚀 Running Locally

### Backend (FastAPI)

```bash
# 1. Enter the backend directory
cd backend

# 2. Create & activate a virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the server
uvicorn main:app --reload --port 8000
```

API available at: **http://localhost:8000**  
Swagger docs: **http://localhost:8000/docs**

---

### Frontend (React + Vite)

```bash
# 1. Enter the frontend directory
cd frontend

# 2. Install npm dependencies
npm install

# 3. Start the development server
npm run dev
```

Frontend available at: **http://localhost:5173**

> **Note:** Start the backend first so product and review data loads correctly.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | Returns full product catalogue |
| `GET` | `/api/reviews` | Returns customer reviews |
| `POST` | `/api/contact` | Accepts contact form submissions |
| `GET` | `/api/contact/submissions` | Admin — view all submissions |

---

## ⚙️ Environment Configuration

The frontend reads the API base URL from `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Change this value to point at a different backend (staging, production, etc.) without touching any component code.

---

## 🎨 Design Highlights

- **Colors**: Solar amber (#FF8A00), deep navy (#0B3D91 / #14213D), accent green (#27AE60)
- **Typography**: Poppins (headings) + Inter (body)
- **Animations**: Framer Motion — fade-up on scroll, hover scale, count-up stats, WhatsApp pulse
- **Responsive**: Mobile-first with hamburger drawer menu
- **Floating WhatsApp button** with pulse animation
- **Google Maps** embedded for store location
