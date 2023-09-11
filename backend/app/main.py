from contextlib import asynccontextmanager

from fastapi import FastAPI
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware

from app.api import api_routes
from app.core.config import config
from app.db.session import engine

middleware = [Middleware(CORSMiddleware, allow_origins=config.cors_allowed_origins)]


@asynccontextmanager
async def lifetime(_app: FastAPI):
    await engine.begin()
    yield
    await engine.dispose()


app = FastAPI(middleware=middleware, lifetime=lifetime)

app.include_router(api_routes)
