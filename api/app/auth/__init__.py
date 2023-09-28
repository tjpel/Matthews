from typing import Annotated

from fastapi import Header, Depends, HTTPException, status

from app.db.session import AsyncSessionDep
from app.model import User
from app.services import sessions


async def get_user_from_header(
    session: AsyncSessionDep, authorization: Annotated[str | None, Header()]
) -> User:
    if not authorization:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)
    try:
        token = authorization.split(" ", 1)[1]
    except IndexError:
        raise HTTPException(status.HTTP_400_BAD_REQUEST)

    user = await sessions.verify_token(session, token)
    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)
    return user


UserAuth = Annotated[User, Depends(get_user_from_header)]
