from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.auth import password
from app.model import User


class Signup(BaseModel):
    name: str
    email: str
    password: str


class Login(BaseModel):
    email: str
    password: str


async def get_by_email(session: AsyncSession, email: str) -> User | None:
    stmt = select(User).where(User.email == email)
    return await session.scalar(stmt)


async def get_by_google_id(session: AsyncSession, google_id: str) -> User | None:
    stmt = select(User).where(User.google_id == google_id)
    return await session.scalar(stmt)


async def verify_login(session: AsyncSession, login: Login) -> User | None:
    user = await get_by_email(session, login.email)
    if (
        not user
        or not user.password_hash
        or not await password.verify(user.password_hash, login.password)
    ):
        return

    if password.needs_rehash(user.password_hash):
        user.password_hash = password.hash(login.password)
        await session.commit()

    return user


async def create_with_password(session: AsyncSession, signup: Signup) -> User | None:
    if await get_by_email(session, signup.email):
        return

    hash = await password.hash(signup.password)
    user = User(email=signup.email, name=signup.name, password_hash=hash)

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
