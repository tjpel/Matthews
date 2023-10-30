"""
TODO:

- allow for the registration of multiple methods (should first request auth with an existing method)
- restrict account creation to pre-authorized users
"""

from fastapi import APIRouter, HTTPException, status

from app.auth import UserAuth, google, passwords
from app.core.config import config
from app.db.session import AsyncSessionDep
from app.services import users, sessions

REDIRECT = f"{config.server_url}{config.api_v1_route}/auth/google"
SCOPES = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/spreadsheets"
]

routes = APIRouter(prefix="/auth")


# Invalidate all existing sessions


@routes.post("/panic")
async def panic(session: AsyncSessionDep, user: UserAuth):
    user.session_cycle += 1
    await session.commit()


# Password Credentials


@routes.post("/login")
async def password_login(session: AsyncSessionDep, cred: users.Credentials) -> str:
    user = await users.verify_login(session, cred)
    if user:
        return sessions.create_token(user)
    else:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)


@routes.post("/signup")
async def password_signup(session: AsyncSessionDep, cred: users.Credentials) -> str:
    user = await users.create_with_password(session, cred)
    if user:
        return sessions.create_token(user)
    else:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)


@routes.put("/password")
async def register_password(session: AsyncSessionDep, user: UserAuth, password: str):
    user.password_hash = passwords.hash(password)
    session.commit()


# Google SSO


@routes.get("/google_url")
async def google_url() -> str:
    return await google.client.get_authorization_url(REDIRECT, scope=SCOPES)


@routes.get("/google")
async def google_token(session: AsyncSessionDep, code: str):
    tokens = await google.client.get_access_token(code, REDIRECT)
    info = await google.get_user_info(tokens["access_token"])

    user = await users.get_by_google_id(session, info["sub"])
    if not user:
        user = await users.create_with_google(
            session, name=info["name"], email=info["email"], google_id=info["sub"]
        )

    return sessions.create_token(user)
