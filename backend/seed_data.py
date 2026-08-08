import asyncio
from app.database import engine, Base, async_session_maker
from app.models import Package


IMG = "https://picsum.photos/seed"

packages_data = [
    # ── Travel & Booking ────────────────────────────────
    {
        "title": "Goa Beach Retreat",
        "slug": "goa-beach-retreat",
        "description": "A relaxing 4-day escape to the serene beaches of Goa. Enjoy sun-kissed shores, vibrant nightlife, and authentic Goan cuisine curated by Zen World Hospitality.",
        "category": "travel_booking",
        "destination": "Goa, India",
        "duration_days": 4,
        "price_from": 15000.0,
        "price_to": 25000.0,
        "highlights": ["Beach hopping", "Water sports", "Sunset cruise", "Spice plantation tour"],
        "image_url": f"{IMG}/goa-beach/800/600",
        "is_featured": True,
    },
    {
        "title": "Rajasthan Heritage Tour",
        "slug": "rajasthan-heritage-tour",
        "description": "Explore the royal palaces and forts of Rajasthan over 7 majestic days. From the Pink City to the Golden Desert, experience India's regal heritage.",
        "category": "travel_booking",
        "destination": "Rajasthan, India",
        "duration_days": 7,
        "price_from": 35000.0,
        "price_to": 55000.0,
        "highlights": ["Jaipur Fort", "Udaipur Lakes", "Desert Safari", "Royal dining"],
        "image_url": f"{IMG}/rajasthan-palace/800/600",
        "is_featured": True,
    },
    {
        "title": "Kerala Backwater Escape",
        "slug": "kerala-backwater-escape",
        "description": "Experience tranquility in the lush green backwaters of Kerala. Houseboat stays, Ayurvedic treatments, and serene tea garden walks await.",
        "category": "travel_booking",
        "destination": "Kerala, India",
        "duration_days": 5,
        "price_from": 20000.0,
        "price_to": 35000.0,
        "highlights": ["Houseboat stay", "Ayurvedic spa", "Tea gardens", "Kathakali show"],
        "image_url": f"{IMG}/kerala-backwater/800/600",
        "is_featured": False,
    },
    {
        "title": "Bali International Getaway",
        "slug": "bali-international-getaway",
        "description": "A week-long exotic vacation in the tropical paradise of Bali. Temples, beaches, volcano treks, and world-class wellness retreats.",
        "category": "travel_booking",
        "destination": "Bali, Indonesia",
        "duration_days": 7,
        "price_from": 60000.0,
        "price_to": 90000.0,
        "highlights": ["Ubud temples", "Seminyak beaches", "Volcano trek", "Spa retreat"],
        "image_url": f"{IMG}/bali-temple/800/600",
        "is_featured": True,
    },
    # ── Corporate ───────────────────────────────────────
    {
        "title": "Mumbai Corporate Stay",
        "slug": "mumbai-corporate-stay",
        "description": "Premium accommodation and transit for executives in Mumbai. 5-star hotels with meeting room access and seamless airport transfers.",
        "category": "corporate",
        "destination": "Mumbai, India",
        "duration_days": 3,
        "price_from": 12000.0,
        "price_to": 40000.0,
        "highlights": ["5-star hotel", "Airport transfers", "Meeting room access", "Business center"],
        "image_url": f"{IMG}/hotel-luxury/800/600",
        "is_featured": True,
    },
    {
        "title": "Pune IT Hub Package",
        "slug": "pune-it-hub-package",
        "description": "Convenient stays near Hinjewadi and Magarpatta for tech professionals. Smart corporate lodging with commute services.",
        "category": "corporate",
        "destination": "Pune, India",
        "duration_days": 5,
        "price_from": 10000.0,
        "price_to": 30000.0,
        "highlights": ["Business center", "Commute service", "Express laundry", "Wi-Fi lounge"],
        "image_url": f"{IMG}/modern-arch/800/600",
        "is_featured": False,
    },
    {
        "title": "MICE Conference Package",
        "slug": "mice-conference-package",
        "description": "End-to-end management for large-scale corporate events and offsites. Banquet halls, team building, and gala dinners.",
        "category": "corporate",
        "destination": "Lonavala, India",
        "duration_days": 2,
        "price_from": 50000.0,
        "price_to": 200000.0,
        "highlights": ["Banquet hall", "Team building activities", "Gala dinner", "AV equipment"],
        "image_url": f"{IMG}/corporate-event/800/600",
        "is_featured": True,
    },
    {
        "title": "Maharashtra Industrial Belt Stay",
        "slug": "maharashtra-industrial-belt-stay",
        "description": "Comfortable corporate lodging for industrial visits across Maharashtra. Budget-friendly with secure facilities.",
        "category": "corporate",
        "destination": "Maharashtra, India",
        "duration_days": 4,
        "price_from": 8000.0,
        "price_to": 20000.0,
        "highlights": ["Industrial zone proximity", "Early breakfast", "Secure parking", "24/7 support"],
        "image_url": f"{IMG}/hotel-room/800/600",
        "is_featured": False,
    },
    # ── Hotel Management ────────────────────────────────
    {
        "title": "OTA Optimization Suite",
        "slug": "ota-optimization-suite",
        "description": "Boost your hotel's visibility and bookings across online travel agencies. Profile audit, dynamic pricing, and review management.",
        "category": "hotel_management",
        "destination": "Remote / On-site",
        "duration_days": 30,
        "price_from": 25000.0,
        "price_to": 50000.0,
        "highlights": ["Profile audit", "Dynamic pricing setup", "Review management", "Channel optimization"],
        "image_url": f"{IMG}/world-explore/800/600",
        "is_featured": True,
    },
    {
        "title": "Revenue Management Consultation",
        "slug": "revenue-management-consultation",
        "description": "Expert strategies to maximize your hotel's RevPAR and overall profitability through dynamic yield pricing and market analysis.",
        "category": "hotel_management",
        "destination": "Remote / On-site",
        "duration_days": 90,
        "price_from": 100000.0,
        "price_to": 300000.0,
        "highlights": ["Market analysis", "Yield management", "Sales strategy", "Competitor benchmarking"],
        "image_url": f"{IMG}/luxury-resort/800/600",
        "is_featured": True,
    },
    {
        "title": "Pre-Opening Advisory",
        "slug": "pre-opening-advisory",
        "description": "Comprehensive guidance for successfully launching a new hospitality property. Staff training, SOP creation, and marketing launch.",
        "category": "hotel_management",
        "destination": "On-site",
        "duration_days": 180,
        "price_from": 500000.0,
        "price_to": 1000000.0,
        "highlights": ["Staff training", "SOP creation", "Marketing launch", "Quality audit"],
        "image_url": f"{IMG}/hotel-preopen/800/600",
        "is_featured": False,
    },
    {
        "title": "Hospitality Outsourcing Package",
        "slug": "hospitality-outsourcing-package",
        "description": "Outsource key operational departments for efficiency and cost reduction. Housekeeping, F&B, and front desk management.",
        "category": "hotel_management",
        "destination": "On-site",
        "duration_days": 365,
        "price_from": 200000.0,
        "price_to": 800000.0,
        "highlights": ["Housekeeping", "F&B management", "Front desk operations", "Revenue management"],
        "image_url": f"{IMG}/fine-dining/800/600",
        "is_featured": True,
    },
]


async def seed():
    """Create tables and seed initial package data."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_maker() as session:
        # Check if already seeded
        from sqlalchemy import select, func

        count = await session.scalar(select(func.count(Package.id)))
        if count and count > 0:
            print(f"Database already has {count} packages. Skipping seed.")
            return

        for pkg_data in packages_data:
            package = Package(**pkg_data)
            session.add(package)
        await session.commit()
        print(f"Successfully seeded database with {len(packages_data)} packages!")


if __name__ == "__main__":
    asyncio.run(seed())
