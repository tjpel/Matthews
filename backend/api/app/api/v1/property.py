from redfin import Redfin

from fastapi import APIRouter, HTTPException

from app.services import properties
import app.ai as ai

routes = APIRouter(prefix="/property")


@routes.get("/get-property-data")
def get_property_data(address: str):
    # Initialize Redfin API client
    client = Redfin()

    print(address)

    # Search for the property by address
    response = client.search(address)

    # Check if 'exactMatch' exists in the payload
    if "payload" in response and "exactMatch" in response["payload"]:
        url = response["payload"]["exactMatch"]["url"]
    else:
        raise HTTPException(status_code=404, detail="Exact match not found")

    # Fetch initial property info
    initial_info = client.initial_info(url)

    # Check if 'propertyId' exists in the payload
    property_id = initial_info["payload"]["propertyId"]
    if not property_id:
        raise HTTPException(status_code=404, detail="Property ID not found")

    # Fetch MLS data
    mls_data = client.below_the_fold(property_id)
    mls_payload = mls_data["payload"]

    # Check if 'listingId' exists in the payload
    listing_id = initial_info["payload"]["listingId"]
    if listing_id:
        avm_details = client.avm_details(property_id, listing_id)
        avm_payload = avm_details.get("payload", {})
    else:
        print("listingId not found")
        avm_payload = {}

    return {
        "response": response,
        "initial_info": initial_info,
        "mls_data": mls_payload,
        "avm_details": avm_payload,
    }


@routes.get("/predict")
def predict_property_value(
    address: str, property: properties.Property, user_inputs: properties.UserInputs
):
    # Get user inputs from request body
    print(user_inputs)

    # Store data in database

    # Call ML model
    model = ai.gradient_boosting

    # Return predicted value
    prediction = model.predict(user_inputs)

    return {"prediction": prediction}


# Password Credentials
@routes.post("/contact")
async def add_contact_info(property: properties.Property):
    return {"property": property}
