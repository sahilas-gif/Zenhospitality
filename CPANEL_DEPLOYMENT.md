# cPanel Python App Configuration (Setup Python App)

## Exact Form Values

| Field | Value |
|-------|-------|
| **Python version** | `3.11.5` (or your server's latest) |
| **Application root** | `repositories/Zenhospitality/backend` |
| **Application URL** | `api` |
| **Application startup file** | `passenger_wsgi.py` |
| **Application entry point** | `application` |
| **Environment Variables** | Copy all from `backend/.env.production` |

## How it Works

1. cPanel creates a Passenger app at `repositories/Zenhospitality/backend` (relative to home directory)
2. The "Application URL: `api`" tells Passenger to mount at `/api`
3. Passenger strips `/api` prefix → backend routes see `/v1/...`
4. Requests to `https://zenhospitality.in/api/v1/ai/chat` → backend handles `/v1/ai/chat`

## Frontend Configuration

**In `frontend/.env` (for local builds):**
```env
VITE_API_URL=/api/v1
```

**Build & Deploy:**
```bash
cd frontend
npm run build
# Upload contents of dist/ to public_html/
```

## Critical: public_html/.htaccess

In the **document root** (`public_html/`), ensure this `.htaccess` exists (shipped with frontend build):

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Let real files / directories through (CSS, JS, images)
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # SPA fallback - but DON'T intercept /api/*
  # (cPanel's Python App config handles /api pass-through automatically)
  RewriteRule ^ index.html [L]
</IfModule>
```

**Important:** Do NOT add manual rewrite rules for `/api` — cPanel handles this via the Python App "Application URL" setting.

## Backend Route Structure

The backend routes in `app/main.py` use `/v1` prefix because cPanel strips `/api`:
```python
app.include_router(enquiry_router, prefix="/v1")          # → /api/v1/packages
app.include_router(auth_router, prefix="/v1/auth")        # → /api/v1/auth/login
app.include_router(upload_router, prefix="/v1/upload")    # → /api/v1/upload
```

## Verify Deployment

After "Restart" in cPanel Python App:
```bash
# Test backend directly (on server via SSH)
curl http://127.0.0.1:8000/health
# Should return: {"status":"ok"}

# Test via domain
curl https://zenhospitality.in/api/health
# Should return: {"status":"ok"}

curl https://zenhospitality.in/api/v1/ai/chat \
  -X POST -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"hi"}]}'
# Should return AI response
```

## Common Issues

| Symptom | Fix |
|---------|-----|
| `/api/*` returns 404 (SPA index.html) | Ensure "Application URL" = `api` in Python App |
| `ModuleNotFoundError: fastapi` | `pip install -r requirements.txt` in backend venv |
| `GEMINI_API_KEY` fallback message | Set `GEMINI_API_KEY` in Python App env vars |
| CORS error | Set `FRONTEND_URL=https://zenhospitality.in` in Python App env vars |
| Admin login 401 | Ensure `ADMIN_USERNAME` / `ADMIN_PASSWORD` in env vars match |