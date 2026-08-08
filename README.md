# Zen World Hospitality

Welcome to the Zen World Hospitality platform repository. This project is a premium, full-stack travel and corporate hospitality web application featuring an AI-powered Itinerary Generator and an AI Customer Support Chatbot.

## 🚀 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, React Router Dom, Lucide Icons
- **Backend**: FastAPI, SQLAlchemy 2.0 (Async), SQLite (Development), PostgreSQL (Production)
- **AI Integration**: Google Gemini 2.5 Flash

## 📁 Project Structure

- `/frontend` - React single-page application built with Vite.
- `/backend` - FastAPI server managing APIs, Database, and AI integrations.

## 🛠️ Local Development Setup

### Backend
1. `cd backend`
2. `python3 -m venv venv`
3. `source venv/bin/activate` (Mac/Linux) or `venv\Scripts\activate` (Windows)
4. `pip install -r requirements.txt`
5. Create a `.env` file from `.env.example`. **`DATABASE_URL`, `ADMIN_USERNAME`,
   `ADMIN_PASSWORD`, and `JWT_SECRET_KEY` are required** (no insecure defaults) —
   add your `GEMINI_API_KEY` too.
6. `uvicorn app.main:app --reload --port 8000`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## 🌍 Deployment

Full, step-by-step instructions for deploying on **hostycare.online** are in
**[DEPLOYMENT.md](DEPLOYMENT.md)** (VPS/Nginx, cPanel, and PaaS paths, environment
variables, and a security checklist).

Minimum production checklist:
- Build the frontend with `VITE_API_URL` pointing at the live backend
  (`npm run build`).
- Deploy the FastAPI backend (`uvicorn app.main:app`) with `pip install -r requirements.txt`.
- Provide a PostgreSQL `DATABASE_URL` and a `GEMINI_API_KEY`.
- Set `ADMIN_USERNAME` / `ADMIN_PASSWORD` and a strong `JWT_SECRET_KEY`
  (all required — no default credentials shipped).
- Set `FRONTEND_URL` to your exact production origin.
- Set `DEBUG=false`.

## 📞 Contact

- **Email:** sales@zenhospitality.in · connect.zenworld@gmail.com
- **Phone / WhatsApp:** +91 80978 62804 · +91 80973 77058
- **Office:** Mumbai, Maharashtra, India · Mon–Sat 10:00 AM – 7:00 PM

## 📄 License
Private repository. All rights reserved by Zen World Hospitality.
