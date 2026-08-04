from fastapi import FastAPI

from app import config, model
from app.schemas import (
    PropertyFeatures,
    PredictionResponse,
    BatchPredictionRequest,
    BatchPredictionResponse,
    ModelInfoResponse
)

app = FastAPI(title=config.APP_TITLE, version=config.APP_VERSION)

@app.get("/health")
def health() -> dict:
    return {"status":"ok"}

@app.post("/predict", response_model=PredictionResponse)
def predict_single(features:PropertyFeatures) -> PredictionResponse:
    preds = model.predict([features.model_dump()])
    return PredictionResponse(predicted_price=preds[0])

@app.post("/predict/batch", response_model=BatchPredictionResponse)
def predict_batch(request: BatchPredictionRequest) -> BatchPredictionResponse:
    rows = [p.model_dump() for p in request.properties]
    preds = model.predict(rows)
    return BatchPredictionResponse(prediction=preds)

@app.get("/model-info",response_model=ModelInfoResponse)
def model_info() -> ModelInfoResponse:
    return ModelInfoResponse(**model.get_model_info())
