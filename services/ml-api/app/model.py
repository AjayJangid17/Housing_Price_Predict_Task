from functools import lru_cache

import joblib
import pandas as pd

from app import config


@lru_cache
def load_artifact() -> dict:
    '''Load the saved model bundle once and cache it in memory'''
    return joblib.load(config.MODEL_PATH)

def predict(rows: list[dict]) -> list[float]:
    """rows = list of feature dicts (from PropertyFeatures.model_dump())"""
    artifact = load_artifact()
    model = artifact["model"]
    #Build a datafram with columns in the SAME order/names as training
    X = pd.DataFrame(rows,columns=config.FEATURE_COLUMNS)
    return model.predict(X).tolist()

def get_model_info()-> dict:
    artifact = load_artifact()
    model = artifact["model"]
    coefficients = {
        name : float(coef)
        for name, coef in zip(config.FEATURE_COLUMNS, model.coef_)
    }
    
    return {
        "model_type": type(model).__name__,
        "features": config.FEATURE_COLUMNS,
        "coefficients": coefficients,
        "intercept": float(model.intercept_),
        "metrics": artifact["metrics"],
    }