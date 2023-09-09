from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.model import User


async def get_by_email(session: AsyncSession, email: str) -> User | None:
    stmt = select(User).where(User.email == email)
    return await session.scalar(stmt)


async def get_by_google_id(session: AsyncSession, google_id: str) -> User | None:
    stmt = select(User).where(User.google_id == google_id)
    return await session.scalar(stmt)


def create_with_google(
    session: AsyncSession, email: str, name: str, google_id: int
) -> User:
    user = User(email=email, name=name, google_id=google_id)

    session.add(user)
    return user
