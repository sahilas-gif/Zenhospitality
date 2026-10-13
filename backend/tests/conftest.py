import os
import tempfile

_DB = os.path.join(tempfile.mkdtemp(prefix="zen-test-"), "test.db")
os.environ["DATABASE_URL"] = f"sqlite+aiosqlite:///{_DB}"
os.environ["ADMIN_USERNAME"] = "admin"
os.environ["ADMIN_PASSWORD"] = "test-password"
os.environ["JWT_SECRET_KEY"] = "test-secret"
os.environ["GEMINI_API_KEY"] = "test-key"
os.environ["FRONTEND_INDEX_PATH"] = os.path.join(os.path.dirname(_DB), "index.html")

import pytest  # noqa: E402
import pytest_asyncio  # noqa: E402
from httpx import ASGITransport, AsyncClient  # noqa: E402

TEST_DB = _DB


@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"


@pytest_asyncio.fixture(scope="session")
async def app():
    open(TEST_DB, "a").close()
    from app import migrations
    await migrations.apply()
    from app.limiter import limiter
    limiter.enabled = False
    from app.seed_admin import ensure_admin_user
    await ensure_admin_user()
    from app.main import app as fastapi_app
    return fastapi_app


@pytest_asyncio.fixture
async def client(app):
    async with AsyncClient(transport=ASGITransport(app=app, raise_app_exceptions=False), base_url="http://test") as c:
        yield c


@pytest_asyncio.fixture
async def admin_headers(client):
    r = await client.post("/auth/login", data={"username": "admin", "password": "test-password"})
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['access_token']}"}
