from fastapi import APIRouter

from app.auth import UserAuth

from app.core.config import config
from . import auth
from . import property

routes = APIRouter(prefix=config.api_v1_route)

routes.include_router(auth.routes)
routes.include_router(property.routes)

@routes.get("/test_route")
async def test_route(user: UserAuth):
    if user:
        return f"Hi, {user.name}!"
