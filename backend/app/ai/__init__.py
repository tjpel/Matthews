from pathlib import Path
import pickle
from sklearn.base import BaseEstimator

current_dir = Path(__file__).parent.resolve()


def load_model(path: Path) -> BaseEstimator:
    with open(path, "rb") as file:
        return pickle.load(file)


# Load all models in the current directory and its subdirectories
model = load_model(current_dir.joinpath("./v2_model/v2_modelRandom_Forest_Pipeline.pkl"))
