from fastapi import APIRouter

from . import v1

api_routes = APIRouter()
api_routes.include_router(v1.routes)
