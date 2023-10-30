from fastapi import FastAPI
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware

from app.api import api_routes
from app.core.config import config

cors = Middleware(CORSMiddleware, allow_origins=config.cors_allowed_origins, allow_methods=["*"])
middleware = [cors]

app = FastAPI(middleware=middleware)

app.include_router(api_routes)
