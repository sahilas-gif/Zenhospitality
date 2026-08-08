"""CLI entry point: seed / refresh the admin user.

    python seed_admin.py

Delegates to app.seed_admin so the startup hook and this CLI share one source
of truth. Credentials come from ADMIN_USERNAME / ADMIN_PASSWORD env vars,
defaulting to zenhospi / Zen@2804.
"""
import asyncio

from app.seed_admin import main

if __name__ == "__main__":
    asyncio.run(main())