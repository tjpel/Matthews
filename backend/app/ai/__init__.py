from pathlib import Path
import pickle

from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor

current_dir = Path(__file__).parent.resolve()


def load_model(filename: str) -> any:
    path = current_dir.joinpath(filename)
    with open(path, "rb") as file:
        return pickle.load(file)


gradient_boosting: GradientBoostingRegressor = load_model("gradient_boosting_model.pkl")
random_forest: RandomForestRegressor = load_model("random_forest_model.pkl")
gradient_boosting_best: GradientBoostingRegressor = load_model("gradient_boosting_high_performing_model_v2.pkl")
