import datetime

from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import config
from app.model import User


def create_token(user: User) -> str:
    now = datetime.datetime.utcnow()
    exp = now + datetime.timedelta(days=config.session_max_age_days)

    return jwt.encode(
        {"user": user.id, "cycle": user.session_cycle, "exp": exp},
        config.session_secret,
    )


async def verify_token(session: AsyncSession, token: str) -> User | None:
    try:
        claims = jwt.decode(token, config.session_secret)
    except JWTError:
        return None
    if "user" not in claims or "cycle" not in claims:
        return

    user = await session.get(User, claims["user"])
    if user and user.session_cycle == claims["cycle"]:
        return user
