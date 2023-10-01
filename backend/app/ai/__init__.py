from pathlib import Path
import pickle

from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor

current_dir = Path(__file__).parent.resolve()


def load_model(filename: str) -> any:
    path = current_dir.joinpath(filename)
    with open(path, "rb") as file:
        return pickle.load(file)


gradient_boosting: GradientBoostingRegressor = load_model("Gradient Boosting_model.pkl")
# random_forest: RandomForestRegressor = load_model("Random Forest_model.pkl")
