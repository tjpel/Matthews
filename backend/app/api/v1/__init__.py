from fastapi import APIRouter

from app.core.config import config
from . import property
from . import data_collection

routes = APIRouter(prefix=config.api_v1_route)

routes.include_router(property.routes)
routes.include_router(data_collection.routes)


@routes.get("/ping")
async def ping() -> str:
    return "pong"
