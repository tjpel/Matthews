"""
TODO:

- allow for the registration of multiple methods (should first request auth with an existing method)
- restrict account creation to pre-authorized users
"""

from fastapi import APIRouter, HTTPException, status

from app.auth import UserAuth
from app.auth.google import client, get_user_info
from app.core.config import config
from app.db.session import AsyncSessionDep
from app.services import users, sessions

REDIRECT = f"{config.server_url}{config.api_v1_route}/property"
SCOPES = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
]

routes = APIRouter(prefix="/property")

@routes.get("/predict")
async def predict_property_value():
    return {"message": "Hello World"}

# Password Credentials
@routes.post("/contact")
async def add_contact_info(session: AsyncSessionDep, login: users.Login) -> str:
    user = await users.verify_login(session, login)
    # Will send out email with contact info to user
    if user:
        return sessions.create_token(user)
    else:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)