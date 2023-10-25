from redfin import Redfin

from fastapi import APIRouter, Body, HTTPException
from typing import Annotated

import pandas as pd
import random

from app.services.properties import UserInputs, ContactInfo

routes = APIRouter(prefix="/property")


@routes.post("/predict")
def predict_property_value(user_inputs: UserInputs):
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
async def add_contact_info(contact: ContactInfo):
    ...
