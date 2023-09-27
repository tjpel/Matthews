from redfin import Redfin

from fastapi import APIRouter, HTTPException

from app.services import properties

routes = APIRouter(prefix="/property")


@routes.post("/get-property-data")
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
    property_id = initial_info.get("payload", {}).get("propertyId")
    if not property_id:
        raise HTTPException(status_code=404, detail="Property ID not found")

    # Fetch MLS data
    mls_data = client.below_the_fold(property_id)
    mls_payload = mls_data.get("payload", {})

    # Check if 'listingId' exists in the payload
    listing_id = initial_info.get("payload", {}).get("listingId")
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


@routes.post("/predict")
def predict_property_value(
    address: str, property: properties.Property, user_inputs: properties.UserInputs
):
    # Gather data from property using APIs
    client = Redfin()

    response = client.search(address)
    url = response["payload"]["exactMatch"]["url"]
    initial_info = client.initial_info(url)

    property_id = initial_info["payload"]["propertyId"]

    mls_data = client.below_the_fold(property_id)

    listing_id = initial_info["payload"]["listingId"]
    avm_details = client.avm_details(property_id, listing_id)

    # Store data in database

    # Call ML model

    # Return predicted value

    return {"mls_data": mls_data["payload"], "avm_details": avm_details["payload"]}


# Password Credentials
@routes.post("/contact")
async def add_contact_info(property: properties.Property):
    return {"property": property}
