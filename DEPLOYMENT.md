# Deployment Guide — Zen World Hospitality → hostycare.online

Production release runbook for the three pieces that make up this project:

| Piece | Tech | Serves |
|-------|------|--------|
| **Frontend** | React + Vite (static build in `frontend/dist/`) | the website (SPA) |
| **Backend API** | FastAPI + Uvicorn (Python) | `/api`, auth, AI, uploads |
| **Database** | PostgreSQL | packages, enquiries, users, AI itineraries |

Because the frontend is a static SPA and the backend is a long-running Python process,
the two are almost always deployed on **different hosts/subdomains**. Below are two
clear paths — a shared/cPanel route and a VPS route. Pick whichever your host supports.

---

## 0. Two things you must change before deploying

1. **Point the frontend at the live backend.** Build the frontend with the real API
   URL so calls go to your production backend, not `localhost`:
   ```bash
   cd frontend
   VITE_API_URL=https://api.hostycare.online/api npm run build
   # or put VITE_API_URL into frontend/.env before building
   ```
   (`src/lib/api.js` falls back to `http://localhost:8000/api` when unset.)

2. **Set strong secrets in production** (see §5). Never ship the defaults.

---

## 1. Local production build check (do this first)

```bash
# Frontend — build + lint
cd frontend
npm install
npm run lint
npm run build          # outputs to frontend/dist/ (includes .htaccess)

# Backend — install exact prod deps + import check
cd ../backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python -c "from app.main import app; print('OK', app.title)"
```

If both succeed, the code is build-safe. The backend also needs a reachable database
at startup (§3).

---

## 2. Path A — VPS (Nginx + systemd) — recommended

Best fit for FastAPI. A Ubuntu/Debian VPS with public IP (or a domain pointed to it).

### 2.1 Database (PostgreSQL)
```bash
sudo apt update && sudo apt install -y postgresql
sudo -u postgres psql -c "CREATE ROLE postgresql LOGIN PASSWORD 'Poonam@125';"
sudo -u postgres psql -c "CREATE DATABASE zenhospitality OWNER postgresql;"
```
Tables are created automatically on first backend start (`Base.metadata.create_all`
in the lifespan hook).

### 2.2 Backend service
Create `/etc/systemd/system/zen-backend.service`:

```ini
[Unit]
Description=Zen World Hospitality API (Uvicorn)
After=network.target

[Service]
WorkingDirectory=/opt/zenhospitality/backend
Environment="DATABASE_URL=postgresql+asyncpg://postgresql:Poonam@125@localhost:5432/zenhospitality"
Environment="GEMINI_API_KEY=YOUR_KEY"
Environment="FRONTEND_URL=https://hostycare.online"
Environment="DEBUG=false"
Environment="JWT_SECRET_KEY=REPLACE_WITH_LONG_RANDOM"
Environment="ADMIN_USERNAME=zenhospi"
Environment="ADMIN_PASSWORD=Zen@2804"
ExecStart=/opt/zenhospitality/backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
Restart=always
User=www-data

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now zen-backend
curl http://127.0.0.1:8000/health   # → {"status":"ok"}
```
> Note: the password contains `@`. In a URL it must be percent-encoded (`Poonam%40125`);
> in the `Environment=` line above write it raw (`Poonam@125`) — systemd is not a URL.

### 2.3 Nginx — reverse proxy + static frontend
Serve `frontend/dist/` for the site and proxy `/api` + `/uploads` to the backend:

```nginx
server {
    listen 80;
    server_name hostycare.online;
    root /opt/zenhospitality/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;   # SPA fallback (same as .htaccess)
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:8000;
    }
}
```
```bash
sudo nginx -t && sudo systemctl reload nginx
```
Enable HTTPS with `certbot --nginx -d hostycare.online`.

### 2.4 CORS
The backend allows origins from `FRONTEND_URL`. With the frontend and API under the
**same** domain (`hostycare.online` + `hostycare.online/api`) CORS is same-origin and
needs nothing extra. If the API lives on `api.hostycare.online`, set
`FRONTEND_URL=https://hostycare.online` so the browser allows cross-origin calls.

---

## 3. Path B — Shared hosting / cPanel

Works if your host supports running Python processes. Steps:

1. **Build the frontend** locally as in §1, then upload **the contents of
   `frontend/dist/`** to `public_html/` (or the document root of `hostycare.online`).
   `.htaccess` is already included — it enables SPA routing, gzip and caching.
   Upload to **root of the docroot**, not a sub-folder.
2. **Deploy the backend** on the same account (a subdomain like `api.hostycare.online`
   is cleanest): copy `backend/` up, create a venv, `pip install -r requirements.txt`,
   and run `venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000`. Use the host's
   **Python App / Application Manager / cron-kept process** so Uvicorn stays alive.
3. **Create the PostgreSQL DB** in cPanel → PostgreSQL Databases. Use user `postgresql`
   (or the cPanel-created user) and note the password. Set `DATABASE_URL`.
4. **CORS:** set `FRONTEND_URL=https://hostycare.online` on the backend so the site can
   call `api.hostycare.online` (cross-origin).
5. Upload a `.env` from `backend/.env.example` into `backend/` with real values.

> If the shared host does **not** allow long-running Python processes, use Path A
> (a VPS) for the API, or a PaaS (Render/Railway) for the backend while keeping this
> host for the static frontend. PostgreSQL can stay on Render/Railway too.

---

## 4. Environment variables (set on the backend)

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | Postgres connection string | `postgresql+asyncpg://postgresql:Poonam@125@host:5432/zenhospitality` |
| `GEMINI_API_KEY` | AI Itinerary + Chatbot | your Google Gemini key |
| `FRONTEND_URL` | CORS origin(s), comma-separated | `https://hostycare.online` |
| `DEBUG` | SQL echo / verbose | `false` |
| `JWT_SECRET_KEY` | JWT signing secret (long random) | `openssl rand -hex 32` |
| `ADMIN_USERNAME` | Admin login (default `zenhospi`) | `zenhospi` |
| `ADMIN_PASSWORD` | Admin login (default `Zen@2804`) | `Zen@2804` (change in prod!) |

**No `DATABASE_URL`?** the backend falls back to a local default
(`postgresql://postgresql:Poonam%40125@localhost:5432/zenhospitality`) built into
`app/config.py`.

### Frontend build variable
| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | Backend API base (must end in `/api`) | `https://hostycare.online/api` |

---

## 5. Security checklist (do every item)

- [ ] Change `ADMIN_PASSWORD` from the default `Zen@2804` **or** at least set it via env.
- [ ] Set `JWT_SECRET_KEY` to a long random value.
- [ ] Keep `GEMINI_API_KEY` and `DATABASE_URL` out of Git (`.env` is gitignored).
- [ ] Set `DEBUG=false` in production.
- [ ] Turn on HTTPS (certbot / AutoSSL) so admin passwords & tokens aren't plaintext.
- [ ] Restrict `FRONTEND_URL` to your real origins (not `*`).

---

## 6. Verify the release

```bash
# Backend reachable
curl https://hostycare.online/api/../health
curl https://api.hostycare.online/health          # or whichever host the API is on

# Admin login works
curl -X POST https://hostycare.online/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=zenhospi&password=Zen@2804"
# → {"access_token":"eyJ...","token_type":"bearer"}

# Site + deep link (SPA routing)
open https://hostycare.online/
open https://hostycare.online/domestic-tours      # must NOT 404 on refresh
```

---

## 7. Troubleshooting

| Symptom | Cause / fix |
|---------|-------------|
| Deep links 404 on refresh (cPanel) | `.htaccess` missing or in the wrong folder — place in docroot next to `index.html`. |
| Frontend calls fail to `/api` | `VITE_API_URL` built with the wrong base; rebuild with the correct value (no trailing slash besides `/api`). |
| `401` on every admin login | `ADMIN_PASSWORD` mismatch, or `bcrypt` version — backend must be `bcrypt>=4.1` (requirements.txt installs it). |
| Backend won't start / `email-validator` error | Run `pip install -r requirements.txt` — pulls `email-validator`. |
| AI features fall back to "call us" | `GEMINI_API_KEY` missing → the AI service returns a graceful fallback message. |
| CORS block on `api.` subdomain | Wrong `FRONTEND_URL` on the backend. |