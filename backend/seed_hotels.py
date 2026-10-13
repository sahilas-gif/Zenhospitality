"""Insert the launch partner hotels if they are missing.

    python seed_hotels.py

Safe to re-run: hotels are matched by slug and existing rows are never changed,
so edits made in the admin panel survive.
"""
import asyncio

from sqlalchemy import select

from app.database import async_session_maker
from app.models import Hotel
from app.schemas import HotelCreate

PM = "/images/hotels/the-purple-mango"
NE = "/images/hotels/nestor-hotel-andheri"

HOTELS = [
    {
        "slug": "the-purple-mango",
        "name": "The Purple Mango",
        "category": "Hill retreat",
        "locality": "Karla",
        "city": "Lonavala",
        "state": "Maharashtra",
        "summary": "A calm, pure-vegetarian stay in Karla, minutes from the caves and an easy base for the Lonavala ghats.",
        "description": (
            "The Purple Mango sits in Karla, on the quieter side of Lonavala and close to the Alkesh Modi Jain "
            "Temple. The kitchen is pure vegetarian and comfortable with Jain requirements, which makes it a "
            "natural choice for families and temple visitors.\n\n"
            "Rooms are bright and simply furnished, ranging from compact studios to larger Super Deluxe rooms "
            "that suit small groups. Banquet and conference spaces cover family functions and offsite days.\n\n"
            "Karla Caves, Bhushi Dam, Lion's Point, Tiger's Leap and the forts of Lohagad and Rajmachi are all "
            "within a short drive. Tell us your dates and group size and we will arrange the best rate via Zen."
        ),
        "amenities": ["Pure vegetarian restaurant", "Jain-friendly meals", "Air-conditioned rooms",
                      "Banquet hall", "Conference halls", "Family friendly", "Housekeeping"],
        "highlights": ["Pure veg and Jain friendly", "25+ rooms", "Near Karla Caves", "Event and meeting spaces"],
        "nearby": ["Karla Caves", "Alkesh Modi Jain Temple", "Bhushi Dam", "Lion's Point", "Tiger's Leap",
                   "Lohagad Fort", "Rajmachi"],
        "images": [
            {"url": f"{PM}/super-deluxe-ac-room-6.webp", "alt": "Super Deluxe AC room with three beds at The Purple Mango"},
            {"url": f"{PM}/deluxe-ac-room-2.webp", "alt": "Deluxe AC room at The Purple Mango"},
            {"url": f"{PM}/studio-room-2.webp", "alt": "Studio room with a double bed at The Purple Mango"},
            {"url": f"{PM}/outdoor-1.webp", "alt": "Glass-walled corridor at The Purple Mango"},
        ],
        "room_types": [
            {"name": "Studio Room", "description": "Compact and bright, for couples or solo travellers."},
            {"name": "Deluxe AC Room", "description": "Air-conditioned room with space to unwind after a day out."},
            {"name": "Super Deluxe AC Room", "description": "Larger room with multiple beds, good for families and friends."},
        ],
        "is_published": True,
        "is_featured": True,
        "sort_order": 1,
    },
    {
        "slug": "nestor-hotel-andheri",
        "name": "Nestor Hotel",
        "category": "Business hotel",
        "locality": "Marol, Andheri East",
        "city": "Mumbai",
        "state": "Maharashtra",
        "star_rating": 3,
        "summary": "A three-star business hotel in Marol, Andheri East, with a pool and meeting room close to the airport and MIDC.",
        "description": (
            "Nestor Hotel is off Military Road in Marol, a short ride from Mumbai airport and the Andheri East "
            "business district. It works well for work trips, early flights and small corporate groups.\n\n"
            "Rooms come in Standard, Deluxe, Premium and Executive grades, all air-conditioned with Wi-Fi, a "
            "tea and coffee maker, LCD TV and an electronic safe. There is a swimming pool, an in-house "
            "restaurant with a buffet, laundry, and a conference room for meetings.\n\n"
            "Share your dates and we will hold the best rate via Zen, including corporate and group stays."
        ),
        "amenities": ["Swimming pool", "Conference room", "Restaurant", "Buffet", "Air conditioning", "Wi-Fi",
                      "Tea and coffee maker", "LCD TV", "Electronic safe", "Laundry", "Lift"],
        "highlights": ["Close to Mumbai airport", "Pool and meeting room", "Four room grades", "Good for corporate stays"],
        "nearby": ["Chhatrapati Shivaji Maharaj International Airport", "Andheri East MIDC", "Marol Metro"],
        "images": [
            {"url": f"{NE}/facade-1.webp", "alt": "Front facade of Nestor Hotel, Andheri East"},
            {"url": f"{NE}/lobby-1.webp", "alt": "Lobby at Nestor Hotel"},
            {"url": f"{NE}/swimming.webp", "alt": "Swimming pool at Nestor Hotel"},
            {"url": f"{NE}/primeium-1.webp", "alt": "Premium room at Nestor Hotel"},
            {"url": f"{NE}/room-1-1.webp", "alt": "Deluxe room at Nestor Hotel"},
            {"url": f"{NE}/room-2-1.webp", "alt": "Standard room at Nestor Hotel"},
            {"url": f"{NE}/resturant-edits.webp", "alt": "Restaurant at Nestor Hotel"},
            {"url": f"{NE}/banquit-1.webp", "alt": "Conference and banquet room at Nestor Hotel"},
            {"url": f"{NE}/night-rec.webp", "alt": "Reception lounge at Nestor Hotel"},
        ],
        "room_types": [
            {"name": "Standard Room"},
            {"name": "Deluxe Room"},
            {"name": "Premium Room"},
            {"name": "Executive Room"},
        ],
        "is_published": True,
        "is_featured": True,
        "sort_order": 2,
    },
]


async def seed_hotels() -> int:
    added = 0
    async with async_session_maker() as session:
        for raw in HOTELS:
            data = HotelCreate(**raw)
            exists = await session.scalar(select(Hotel.id).where(Hotel.slug == data.slug))
            if exists:
                continue
            payload = data.model_dump()
            session.add(Hotel(**payload))
            added += 1
        await session.commit()
    print(f"Partner hotels added: {added}")
    return added


if __name__ == "__main__":
    asyncio.run(seed_hotels())
