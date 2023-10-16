from fastapi import APIRouter

from app.auth import UserAuth
from app.core.config import config
from app.services.users import UserData
from . import auth
from . import property

routes = APIRouter(prefix=config.api_v1_route)

routes.include_router(auth.routes)
routes.include_router(property.routes)


@routes.get("/ping")
async def ping() -> str:
    return "pong"


@routes.get("/user_info")
async def user_info(user: UserAuth) -> UserData:
    return UserData(id=user.id, email=user.email, name=user.name)
