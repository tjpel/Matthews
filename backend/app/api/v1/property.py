"""
TODO:

- allow for the registration of multiple methods (should first request auth with an existing method)
- restrict account creation to pre-authorized users
"""

from fastapi import APIRouter

from app.core.config import config
from app.services import properties

REDIRECT = f"{config.server_url}{config.api_v1_route}/property"
SCOPES = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
]

routes = APIRouter(prefix="/property")


@routes.get("/predict")
async def predict_property_value(
    property: properties.Property, user_inputs: properties.UserInputs
) -> str:
    # Gather data from property using APIs
    # Store data in database

    # Call ML model

    # Return predicted value

    return {"message": "Hello World"}


# Password Credentials
@routes.post("/contact")
async def add_contact_info(property: properties.Property) -> str:
    return {"property": property}
