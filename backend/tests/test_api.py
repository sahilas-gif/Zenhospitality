from unittest import mock

import pytest

from app.services import ai_service

pytestmark = pytest.mark.asyncio

HOTEL = {
    "name": "Test Retreat",
    "city": "Lonavala",
    "locality": "Karla",
    "summary": "Quiet hill stay.",
    "amenities": ["Restaurant"],
    "images": [{"url": "/images/hotels/test/1.webp", "alt": "Lobby"}],
    "room_types": [{"name": "Deluxe"}],
    "is_published": True,
}


async def make_hotel(client, headers, **extra):
    r = await client.post("/admin/hotels", json={**HOTEL, **extra}, headers=headers)
    assert r.status_code == 201, r.text
    return r.json()


async def test_admin_routes_need_auth(client):
    assert (await client.get("/admin/hotels")).status_code == 401
    assert (await client.post("/upload/images")).status_code in (401, 422)
    r = await client.post("/upload/images", files={"files": ("a.png", b"\x89PNG\r\n\x1a\n", "image/png")})
    assert r.status_code == 401


@pytest.mark.parametrize("prefix", ["", "/v1", "/api", "/api/v1"])
async def test_hotel_routes_on_all_prefixes(client, prefix):
    assert (await client.get(f"{prefix}/hotels")).status_code == 200


async def test_hotel_crud_and_publish(client, admin_headers):
    h = await make_hotel(client, admin_headers, slug="crud-hotel", is_published=False)
    assert (await client.get("/hotels/crud-hotel")).status_code == 404
    r = await client.put(f"/admin/hotels/{h['id']}", json={**HOTEL, "slug": "crud-hotel"}, headers=admin_headers)
    assert r.status_code == 200
    pub = (await client.get("/hotels/crud-hotel")).json()
    assert pub["price_from"] is None and "is_published" not in pub
    assert "Lonavala" in (await client.get("/hotels")).json()["cities"]
    dup = await client.post("/admin/hotels", json={**HOTEL, "slug": "crud-hotel"}, headers=admin_headers)
    assert dup.status_code == 409


@pytest.mark.parametrize("field,value", [
    ("summary", "Call +91 98200 12345 to book"),
    ("description", "Mail frontdesk@hotel.com"),
    ("highlights", ["Visit www.hotel.com"]),
])
async def test_hotel_rejects_contact_details(client, admin_headers, field, value):
    r = await client.post("/admin/hotels", json={**HOTEL, "slug": f"bad-{field}", field: value}, headers=admin_headers)
    assert r.status_code == 422


@pytest.mark.parametrize("url", ["javascript:alert(1)", "http://x.com/a.jpg", "/images/../etc/passwd"])
async def test_hotel_rejects_bad_image_urls(client, admin_headers, url):
    body = {**HOTEL, "slug": "bad-img", "images": [{"url": url, "alt": ""}]}
    assert (await client.post("/admin/hotels", json=body, headers=admin_headers)).status_code == 422


async def test_hotel_enquiry_snapshot_survives_delete(client, admin_headers):
    h = await make_hotel(client, admin_headers, slug="snap-hotel")
    r = await client.post("/enquiries", json={
        "customer_name": "Asha", "customer_phone": "+91 99999 11111", "hotel_id": h["id"],
        "check_in": "2026-12-01", "check_out": "2026-12-03", "adults": 2, "rooms": 1,
    })
    assert r.status_code == 201, r.text
    e = r.json()
    assert e["reference"].startswith("ZEN-") and e["enquiry_type"] == "hotel" and e["hotel_name"] == "Test Retreat"
    assert (await client.delete(f"/admin/hotels/{h['id']}", headers=admin_headers)).status_code == 204
    rows = (await client.get("/admin/enquiries?enquiry_type=hotel", headers=admin_headers)).json()
    row = next(x for x in rows if x["id"] == e["id"])
    assert row["hotel_id"] is None and row["hotel_name"] == "Test Retreat"


@pytest.mark.parametrize("body", [
    {"customer_name": "A", "customer_phone": "9999911111"},
    {"customer_name": "Asha", "customer_phone": "12"},
    {"customer_name": "Asha", "customer_phone": "9999911111", "check_in": "2026-12-05", "check_out": "2026-12-01"},
    {"customer_name": "Asha", "customer_phone": "9999911111", "enquiry_type": "spam"},
])
async def test_enquiry_validation(client, body):
    assert (await client.post("/enquiries", json=body)).status_code == 422


async def test_enquiry_honeypot(client):
    r = await client.post("/enquiries", json={"customer_name": "Bot", "customer_phone": "9999911111", "website": "x"})
    assert r.status_code == 400


async def test_legacy_enquiry_still_works(client):
    r = await client.post("/enquiries", json={"customer_name": "Old Form", "customer_phone": "9999911111", "message": "hi"})
    assert r.status_code == 201 and r.json()["enquiry_type"] == "general"


async def test_status_update_validates(client, admin_headers):
    e = (await client.post("/enquiries", json={"customer_name": "Stat", "customer_phone": "9999911111"})).json()
    assert (await client.patch(f"/admin/enquiries/{e['id']}/status?status=bogus", headers=admin_headers)).status_code == 422
    assert (await client.patch(f"/admin/enquiries/{e['id']}/status?status=contacted", headers=admin_headers)).status_code == 200


async def test_unhandled_error_is_generic(client, app):
    @app.get("/boom-test")
    async def boom():
        raise RuntimeError("secret detail")
    app.router.routes.insert(0, app.router.routes.pop())
    r = await client.get("/boom-test")
    assert r.status_code == 500
    assert "secret" not in r.text and "request_id" in r.json()


async def test_ai_failure_is_503_and_not_saved(client):
    with mock.patch.object(ai_service, "_get_client", return_value=None):
        r = await client.post("/ai/generate-itinerary", json={"destination": "Goa", "duration_days": 3, "budget": "mid"})
    assert r.status_code == 503


async def test_chat_failure_returns_honest_fallback(client):
    with mock.patch.object(ai_service, "_get_client", return_value=None):
        r = await client.post("/ai/chat", json={"messages": [{"role": "user", "content": "hi"}]})
    assert r.status_code == 200 and r.json()["fallback"] is True and "88280 15060" in r.json()["response"]


async def test_seo_hotel_page(client, admin_headers):
    await make_hotel(client, admin_headers, slug="seo-hotel", name="SEO <Hotel>")
    r = await client.get("/api/seo/hotels/seo-hotel")
    assert r.status_code == 200
    assert "<title>SEO &lt;Hotel&gt;, Lonavala" in r.text
    assert '"@type": "Hotel"' in r.text and "<Hotel>" not in r.text.split("ld+json")[0]
    assert (await client.get("/api/seo/hotels/missing")).status_code == 404
    sm = await client.get("/api/seo/sitemap.xml")
    assert "/hotels/seo-hotel" in sm.text


async def test_health_reports_schema(client):
    assert (await client.get("/api/health")).json()["schema_version"] == 2


async def test_seed_hotels_is_valid_and_idempotent(client):
    import seed_hotels
    first = await seed_hotels.seed_hotels()
    assert first == 2
    assert await seed_hotels.seed_hotels() == 0
    body = (await client.get("/hotels/the-purple-mango")).json()
    assert body["city"] == "Lonavala" and body["price_from"] is None


async def test_seo_uses_built_index_markers(client, admin_headers, tmp_path, monkeypatch):
    from app.config import settings
    tpl = tmp_path / "index.html"
    tpl.write_text(
        "<html><head><!--SEO:START--><title>Old</title><!--SEO:END--></head>"
        '<body><div id="root"></div><!--SEO:BODY--><script src="/a.js"></script></body></html>'
    )
    monkeypatch.setattr(settings, "FRONTEND_INDEX_PATH", str(tpl))
    await make_hotel(client, admin_headers, slug="marker-hotel")
    html = (await client.get("/seo/hotels/marker-hotel")).text
    assert "<title>Old</title>" not in html and html.count("<title>") == 1
    assert '<div id="seo-content" hidden><h1>Test Retreat</h1>' in html and '<script src="/a.js">' in html
