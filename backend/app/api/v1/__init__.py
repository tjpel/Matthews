from fastapi import APIRouter, Request, HTTPException, status

from app.core.config import config
from app.db.session import SessionDep
from app.services import sessions
from . import auth

routes = APIRouter(prefix=config.api_v1_route)

routes.include_router(auth.routes)


@routes.get("/test_route")
async def test_route(request: Request, session: SessionDep):
    if "Authorization" not in request.headers:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)

    [_, token] = request.headers["Authorization"].split(" ", 1)
    user = await sessions.verify_token(session, token)
    if user:
        return f"Hi, {user.name}!"
    else:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)
