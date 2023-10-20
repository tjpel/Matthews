from pathlib import Path
import pickle
import os
from typing import Dict, Any
from sklearn.base import BaseEstimator

current_dir = Path(__file__).parent.resolve()

def load_all_models(directory: Path) -> Dict[str, BaseEstimator]:
    models = {}
    for dirpath, dirnames, filenames in os.walk(directory):
        for filename in filenames:
            if filename.endswith(".pkl"):
                model_name = filename.split(".")[0]
                path = Path(dirpath).joinpath(filename)
                with open(path, "rb") as file:
                    model = pickle.load(file)
                models[model_name] = model
    return models

# Load all models in the current directory and its subdirectories
all_models = load_all_models(current_dir)
