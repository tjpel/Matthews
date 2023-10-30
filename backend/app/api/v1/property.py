from fastapi import APIRouter

import pandas as pd

from app.model.property import UserInputs
import app.ai as ai

routes = APIRouter(prefix="/property")


@routes.post("/predict")
def predict_property_value(
    user_inputs: UserInputs
):
    # Get user inputs from request body
    print(user_inputs)

    # Convert user_inputs to a Pandas DataFrame
    user_inputs_dict = user_inputs.model_dump()

    mapping_dict = {
        'netIncome': 'Net Income',
        'buildingSF': 'Size',
        'parkingSpaces': 'Number Of Parking Spaces',
        'studioUnits': 'Number Of Studios Units',
        'oneBedroomUnits': 'Number Of 1 Bedrooms Units',
        'twoBedroomUnits': 'Number Of 2 Bedrooms Units',
        'threeBedroomUnits': 'Number Of 3 Bedrooms Units'
    }

    # Use the pop method to rename keys inline
    for old, new in mapping_dict.items():
        user_inputs_dict[new] = user_inputs_dict.pop(old)

    # duplicate field???
    user_inputs_dict['Typical Floor (SF)'] = user_inputs_dict['Size']

    user_inputs_df = pd.DataFrame([user_inputs_dict])

    # Store data in database
    model = ai.all_models.get("v2_modelRandom_Forest_Pipeline")
    prediction = model.predict(user_inputs_df)[0]

    return {"prediction": prediction}
