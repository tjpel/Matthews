import pandas as pd
from app import ai
from app.model.property import UserInputs


if __name__ == "__main__":
    data = UserInputs(
      netIncome = 150000.0,
      buildingSF = 20000.0,
      typicalFloorSF = 5000.0,
      size = 3000.0,
      numberOfParkingSpaces = 50,
      numberOfStudiosUnits = 10,
      numberOf1BedroomsUnits = 20,
      numberOf2BedroomsUnits = 15,
      numberOf3BedroomsUnits = 5
    )

    user_inputs_dict = data.model_dump()
    user_inputs_df = pd.DataFrame([user_inputs_dict])

    model = ai.all_models.get("vA_allParLeher_Gradient Boosting")
    prediction = model.predict(user_inputs_df)[0]

    print("Prediction: {}".format(prediction))