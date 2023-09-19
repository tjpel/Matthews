from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.auth import passwords
from app.model import User


class Credentials(BaseModel):
    email: str
    password: str


async def get_by_email(session: AsyncSession, email: str) -> User | None:
    stmt = select(User).where(User.email == email)
    return await session.scalar(stmt)


async def get_by_google_id(session: AsyncSession, google_id: str) -> User | None:
    stmt = select(User).where(User.google_id == google_id)
    return await session.scalar(stmt)


async def verify_login(session: AsyncSession, cred: Credentials) -> User | None:
    user = await get_by_email(session, cred.email)
    if (
        not user
        or not user.password_hash
        or not await passwords.verify(user.password_hash, cred.password)
    ):
        return

    if passwords.needs_rehash(user.password_hash):
        user.password_hash = passwords.hash(cred.password)
        await session.commit()

    return user


async def create_with_password(session: AsyncSession, cred: Credentials) -> User | None:
    if await get_by_email(session, cred.email):
        return None

    hash = passwords.hash(cred.password)
    user = User(name=cred.email, email=cred.email, password_hash=hash)

    session.add(user)
    await session.commit()
    return user


async def create_with_google(
    session: AsyncSession, email: str, name: str, google_id: int
) -> User:
    user = User(email=email, name=name, google_id=google_id)

    session.add(user)
    await session.commit()
    return user
