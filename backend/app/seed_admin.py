"""Admin bootstrap for Zen World Hospitality.

Creates (or updates) the admin portal user from the configured credentials.

Credentials come from app.config.Settings, which reads the ADMIN_USERNAME /
ADMIN_PASSWORD environment variables and falls back to the package defaults
(zenhospi / Zen@2804) when they are not set.
"""
import asyncio

from sqlalchemy import select

from app.config import settings
from app.database import async_session_maker
from app.models import User
from app.auth import get_password_hash


async def ensure_admin_user() -> None:
    """Guarantee the configured admin user exists with the configured password."""
    username = settings.ADMIN_USERNAME
    password = settings.ADMIN_PASSWORD

    async with async_session_maker() as session:
        # Look the existing admin up by username if it's already present.
        result = await session.execute(select(User).where(User.username == username))
        user = result.scalars().first()

        # Fall back to the legacy seeded email so an existing install still resolves.
        if user is None:
            result = await session.execute(
                select(User).where(User.email == f"{username}@zenhospitality.in")
            )
            user = result.scalars().first()

        if user is None:
            session.add(
                User(
                    username=username,
                    email=f"{username}@zenhospitality.in",
                    hashed_password=get_password_hash(password),
                    is_admin=True,
                )
            )
            print(f"Admin user created: {username}")
        else:
            # Refresh the stored hash so changing ADMIN_PASSWORD re-keys the account.
            user.username = username
            user.email = f"{username}@zenhospitality.in"
            user.hashed_password = get_password_hash(password)
            user.is_admin = True
            print(f"Admin user updated: {username}")
        await session.commit()


async def main() -> None:
    await ensure_admin_user()
    print("Admin credentials are configured. Change them via ADMIN_USERNAME / ADMIN_PASSWORD env vars.")


if __name__ == "__main__":
    asyncio.run(main())