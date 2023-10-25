from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from typing import Union, Type
import joblib

class ModelPredictor:
    def __init__(self, model_path: str, model_type: Union[Type, None] = None, mae: int = 550000):
        """
        Initialize the ModelPredictor class and load the model from the given path.

        Parameters:
        - model_path (str): The file path to the model.
        - model_type (Type, optional): The expected type of the model. Default is None.
        """
        self.model = self.load_model(model_path, model_type)
        self.mae = mae

    def load_model(self, model_path: str, model_type: Union[Type, None] = None):
        """
        Load the model from the specified path and optionally check its type.

        Parameters:
        - model_path (str): The file path to the model.
        - model_type (Type, optional): The expected type of the model. Default is None.

        Returns:
        - The loaded model, or None if an error occurred.
        """
        try:
            model = joblib.load(model_path)
            if model_type is not None and not isinstance(model, model_type):
                print(f"Model type mismatch: Expected {model_type}, got {type(model)}")
                return None
            return model
        except Exception as e:
            print(f"An error occurred while loading the model: {e}")
            return None
        
    # TODO: Add data validation and preprocessing methods here

    def predict(self, input_data) -> list:
        """
        Make a prediction using the loaded model, and calculate range.
        Output formatted as [range_minimum, range_maximum]
        """
        if self.model is not None:
            try:
                prediction = self.model.predict(input_data)
                range_min = prediction - 0.5*self.mae
                range_max = prediction + 0.5*self.mae
                return [range_min, range_max]
            except Exception as e:
                print(f"An error occurred while making the prediction: {e}")
                return None
        else:
            print("Model is not loaded.")
            return None