from fastapi import APIRouter
from fastapi.responses import RedirectResponse

from app.auth.google import client, get_user_info
from app.core.config import config
from app.db.session import SessionDep
from app.services import users, sessions

REDIRECT = f"{config.server_url}{config.api_v1_route}/auth/google"
SCOPES = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
]

routes = APIRouter(prefix="/auth")


@routes.get("/google")
async def google(session: SessionDep, code: str | None = None):
    if not code:
        url = await client.get_authorization_url(REDIRECT, scope=SCOPES)
        return RedirectResponse(url)

    tokens = await client.get_access_token(code, REDIRECT)
    info = await get_user_info(tokens["access_token"])

    user = await users.get_by_google_id(session, info["sub"])
    if not user:
        user = users.create_with_google(
            session, name=info["name"], email=info["email"], google_id=info["sub"]
        )

    await session.commit()
    return sessions.create_token(user)
