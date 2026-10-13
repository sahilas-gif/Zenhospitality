import json
import os
import re
from html import escape

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse, PlainTextResponse, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.contact import CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, FACEBOOK_URL, INSTAGRAM_URL
from app.database import get_db
from app.models import Hotel

router = APIRouter()

STATIC_PATHS = (
    "/", "/hotels", "/about", "/services", "/services/corporate", "/services/mice", "/services/retail",
    "/services/hotel-management", "/domestic-tours", *(f"/domestic-tours/{s}" for s in ("kerala", "goa", "gujarat", "mumbai", "up", "maharashtra", "chardham")),
    "/international-tours", "/transportation",
    "/flight-ticketing", "/plan-trip", "/contact", "/privacy-policy",
)

HEAD_START = "<!--SEO:START-->"
HEAD_END = "<!--SEO:END-->"
BODY_MARK = "<!--SEO:BODY-->"


def _site() -> str:
    return settings.SITE_URL.rstrip("/")


def _abs(url: str) -> str:
    if url.startswith("https://"):
        return url
    return _site() + url


def _json_ld(data: dict) -> str:
    # "</" must never appear inside a script block.
    return json.dumps(data, ensure_ascii=False).replace("</", "<\\/")


def organization_ld() -> dict:
    return {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "name": "Zen World Hospitality",
        "url": _site(),
        "telephone": CONTACT_PHONE_DISPLAY,
        "email": CONTACT_EMAIL,
        "address": {"@type": "PostalAddress", "addressLocality": "Mumbai", "addressRegion": "Maharashtra", "addressCountry": "IN"},
        "sameAs": [INSTAGRAM_URL, FACEBOOK_URL],
    }


def hotel_ld(h: Hotel) -> dict:
    data = {
        "@context": "https://schema.org",
        "@type": "Hotel",
        "name": h.name,
        "url": f"{_site()}/hotels/{h.slug}",
        "description": h.summary or "",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": h.locality or h.city,
            "addressRegion": h.state or "",
            "addressCountry": "IN",
        },
        "image": [_abs(i["url"]) for i in (h.images or [])[:6] if i.get("url")],
        "amenityFeature": [
            {"@type": "LocationFeatureSpecification", "name": a, "value": True} for a in (h.amenities or [])[:20]
        ],
        # Bookings go through Zen, so Zen is the contact point (never the property itself).
        "brand": {"@type": "TravelAgency", "name": "Zen World Hospitality", "url": _site()},
    }
    if h.star_rating:
        data["starRating"] = {"@type": "Rating", "ratingValue": h.star_rating}
    return data


def render_page(template: str, *, title: str, description: str, path: str, image: str = "", ld: list, body: str) -> str:
    url = _site() + path
    head = "\n".join(
        [
            f"<title>{escape(title)}</title>",
            f'<meta name="description" content="{escape(description)}" />',
            f'<link rel="canonical" href="{escape(url)}" />',
            f'<meta property="og:title" content="{escape(title)}" />',
            f'<meta property="og:description" content="{escape(description)}" />',
            f'<meta property="og:url" content="{escape(url)}" />',
            '<meta property="og:type" content="website" />',
            *( [f'<meta property="og:image" content="{escape(image)}" />'] if image else [] ),
            '<meta name="twitter:card" content="summary_large_image" />',
            *[f'<script type="application/ld+json">{_json_ld(x)}</script>' for x in ld],
        ]
    )
    pattern = re.compile(re.escape(HEAD_START) + r".*?" + re.escape(HEAD_END), re.S)
    if pattern.search(template):
        out = pattern.sub(lambda _: f"{HEAD_START}\n{head}\n{HEAD_END}", template, count=1)
    else:
        out = re.sub(r"<title>.*?</title>", "", template, count=1, flags=re.S).replace("</head>", head + "\n</head>", 1)
    seo_body = f'<div id="seo-content" hidden>{body}</div>'
    if BODY_MARK in out:
        return out.replace(BODY_MARK, seo_body, 1)
    return out.replace("</body>", seo_body + "\n</body>", 1)


def _template() -> str:
    path = settings.FRONTEND_INDEX_PATH
    if os.path.isfile(path):
        with open(path, encoding="utf-8") as f:
            return f.read()
    return "<!doctype html><html lang=\"en\"><head></head><body><div id=\"root\"></div></body></html>"


def hotel_body(h: Hotel) -> str:
    parts = [f"<h1>{escape(h.name)}</h1>", f"<p>{escape(', '.join(x for x in (h.locality, h.city, h.state) if x))}</p>"]
    if h.summary:
        parts.append(f"<p>{escape(h.summary)}</p>")
    if h.description:
        parts += [f"<p>{escape(p)}</p>" for p in h.description.split("\n\n") if p.strip()]
    if h.room_types:
        parts.append("<h2>Rooms</h2><ul>" + "".join(f"<li>{escape(r.get('name', ''))}</li>" for r in h.room_types) + "</ul>")
    if h.amenities:
        parts.append("<h2>Amenities</h2><ul>" + "".join(f"<li>{escape(a)}</li>" for a in h.amenities) + "</ul>")
    parts.append(f"<p>Best rates via Zen World Hospitality. WhatsApp {escape(CONTACT_PHONE_DISPLAY)}.</p>")
    return "".join(parts)


@router.get("/hotels/{slug}", response_class=HTMLResponse, include_in_schema=False)
async def seo_hotel(slug: str, db: AsyncSession = Depends(get_db)):
    hotel = (
        await db.execute(select(Hotel).where(Hotel.slug == slug, Hotel.is_published.is_(True)))
    ).scalar_one_or_none()
    if not hotel:
        raise HTTPException(status_code=404)
    title = f"{hotel.name}, {hotel.city} | Best rates via Zen World Hospitality"
    description = (hotel.summary or f"Stay at {hotel.name} in {hotel.city}. Book through Zen World Hospitality.")[:300]
    image = _abs(hotel.images[0]["url"]) if hotel.images else ""
    breadcrumbs = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": _site() + "/"},
            {"@type": "ListItem", "position": 2, "name": "Hotels", "item": _site() + "/hotels"},
            {"@type": "ListItem", "position": 3, "name": hotel.name, "item": f"{_site()}/hotels/{hotel.slug}"},
        ],
    }
    html = render_page(
        _template(), title=title, description=description, path=f"/hotels/{hotel.slug}",
        image=image, ld=[hotel_ld(hotel), breadcrumbs], body=hotel_body(hotel),
    )
    return HTMLResponse(html, headers={"Cache-Control": "public, max-age=600"})


@router.get("/hotels", response_class=HTMLResponse, include_in_schema=False)
async def seo_hotels(db: AsyncSession = Depends(get_db)):
    hotels = (
        await db.execute(select(Hotel).where(Hotel.is_published.is_(True)).order_by(Hotel.sort_order, Hotel.id))
    ).scalars().all()
    body = "<h1>Partner hotels</h1><ul>" + "".join(
        f'<li><a href="/hotels/{escape(h.slug)}">{escape(h.name)}</a>, {escape(h.city)}</li>' for h in hotels
    ) + "</ul>"
    html = render_page(
        _template(),
        title="Partner Hotels | Zen World Hospitality",
        description="Handpicked partner hotels in Lonavala, Mumbai and beyond, with best rates via Zen World Hospitality.",
        path="/hotels", ld=[organization_ld()], body=body,
    )
    return HTMLResponse(html, headers={"Cache-Control": "public, max-age=600"})


@router.get("/sitemap.xml", include_in_schema=False)
async def sitemap(db: AsyncSession = Depends(get_db)):
    site = _site()
    urls = [site + p for p in STATIC_PATHS]
    for slug in (await db.execute(select(Hotel.slug).where(Hotel.is_published.is_(True)))).scalars():
        urls.append(f"{site}/hotels/{slug}")
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    xml += "".join(f"  <url><loc>{escape(u)}</loc></url>\n" for u in urls)
    xml += "</urlset>\n"
    return Response(xml, media_type="application/xml", headers={"Cache-Control": "public, max-age=3600"})


@router.get("/robots.txt", response_class=PlainTextResponse, include_in_schema=False)
async def robots():
    return (
        "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n"
        f"Sitemap: {_site()}/sitemap.xml\n"
    )
