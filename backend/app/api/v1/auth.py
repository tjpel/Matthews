"""
TODO:

- allow for the registration of multiple methods (should first request auth with an existing method)
- restrict account creation to pre-authorized users
"""

from fastapi import APIRouter, HTTPException, status

from app.auth import UserAuth
from app.auth.google import client, get_user_info
from app.core.config import config
from app.db.session import AsyncSessionDep
from app.services import users, sessions

REDIRECT = f"{config.server_url}{config.api_v1_route}/auth/google"
SCOPES = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
]

routes = APIRouter(prefix="/auth")


# Invalidate all existing sessions


@routes.post("/panic")
async def panic(session: AsyncSessionDep, user: UserAuth):
    user.session_cycle += 1
    await session.commit()


# Password Credentials


@routes.post("/password")
async def password_login(session: AsyncSessionDep, login: users.Login) -> str:
    user = await users.verify_login(session, login)
    if user:
        return sessions.create_token(user)
    else:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)


@routes.put("/password")
async def password_signup(session: AsyncSessionDep, signup: users.Signup) -> str:
    user = await users.create_with_password(session, signup)
    if user:
        return sessions.create_token(user)
    else:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)


# Google SSO


@routes.get("/google_url")
async def google_url() -> str:
    return await client.get_authorization_url(REDIRECT, scope=SCOPES)


@routes.get("/google")
async def google_token(session: AsyncSessionDep, code: str) -> str:
    tokens = await client.get_access_token(code, REDIRECT)
    info = await get_user_info(tokens["access_token"])

    user = await users.get_by_google_id(session, info["sub"])
    if not user:
        user = await users.create_with_google(
            session, name=info["name"], email=info["email"], google_id=info["sub"]
        )

    return sessions.create_token(user)
