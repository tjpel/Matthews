from redfin import Redfin

from fastapi import APIRouter, Body, HTTPException
from typing import Any

import pandas as pd
import random

from app.model import property
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
    property_id = initial_info["payload"].get("propertyId")
    if not property_id:
        raise HTTPException(status_code=404, detail="Property ID not found")

    # Fetch MLS data
    mls_data = client.below_the_fold(property_id)
    mls_payload = mls_data["payload"]

    # Check if 'listingId' exists in the payload
    listing_id = initial_info["payload"].get("listingId")
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
    address: property.Address = Body(...),
    user_inputs: property.UserInputs = Body(...),
):
    # Get user inputs from request body
    print(user_inputs)

    # Convert user_inputs to a Pandas DataFrame
    user_inputs_dict = user_inputs.dict()
    user_inputs_df = pd.DataFrame([user_inputs_dict])

    # Alternatively, convert to a NumPy array
    # user_inputs_np = np.array(list(user_inputs_dict.values())).reshape(1, -1)

    # Store data in database

    # # Call ML model
    # model = ai.gradient_boosting  # Assuming ai.gradient_boosting_best is your ML model

    # # Return predicted value
    # prediction = model.predict(user_inputs_df)  # Replace with user_inputs_np if using NumPy array

    # return {"prediction": prediction}

    min_value = 1000000  # 1,000,000
    max_value = 3000000  # 3,000,000
    increment = 100000  # 100,000

    # Generate a random number between min_value and max_value in increments of increment
    random_prediction = (
        random.randint(min_value // increment, max_value // increment) * increment
    )

    return {"prediction": random_prediction}


# Route to store contact info in google analytics
@routes.post("/contact")
async def add_contact_info(contact: property.ContactInfo):
    return {"property": property}
