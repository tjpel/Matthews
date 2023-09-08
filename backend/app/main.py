from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api import api_routes
from app.db.session import engine


@asynccontextmanager
async def lifetime(_app: FastAPI):
    await engine.begin()
    yield
    await engine.dispose()


app = FastAPI(lifetime=lifetime)

app.include_router(api_routes)
