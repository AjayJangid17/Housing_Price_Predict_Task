import httpx
from fastapi import HTTPException

from app import config

def _post(path: str, payload: dict) -> dict:
    """Post to the ml-api and return it's Json"""
    url = f"{config.ML_API_URL}{path}"
    print("url",url)
    print("payload",payload)
    try:
        response = httpx.post(url, json=payload, timeout=config.REQUEST_TIMEOUT)
        response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        #ml-api ran but rejected the request
        raise HTTPException(status_code=exc.response.status_code, detail=exc.response.text)
    except httpx.RequestError:
        #ml-api did not respond
        raise HTTPException(status_code=503, detail=f"ML API is unavailable at {url}")
    return response.json()

def predict_one(features:dict) -> dict:
    data = _post(config.PREDICT_PATH, features)
    return data["predicted_price"]

def predict_many(properties: list[dict]) -> list[float]:
    data = _post(config.BATCH_PREDICT_PATH,{'properties':properties})
    return data["prediction"]