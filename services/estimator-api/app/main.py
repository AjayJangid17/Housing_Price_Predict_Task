from fastapi import FastAPI

from app import history, ml_client, config
from app.schemas import (
    CompareRequest,
    CompareResponse,
    EstimateResponse,
    PropertyInput
)

app = FastAPI(title=config.APP_TITLE,version=config.APP_VERSION)

@app.get('/health')
def health() -> dict:
    return {"status":"ok"}

@app.post("/estimate")
def estimate(property_input: PropertyInput) -> EstimateResponse:
    print('Inside estimate api-->',property_input)
    price = ml_client.predict_one(property_input.model_dump())
    print('price',price)
    return history.record(property_input,price)

@app.post("/estimate/compare")
def compare(request: CompareRequest) -> CompareResponse:
    rows = [p.model_dump() for p in request.properties]
    prices = ml_client.predict_many(rows)
    results = [history.record(p,price) for p,price in zip(request.properties,prices)]
    print('results',results)
    return CompareResponse(results=results)

@app.get("/estimate/history")
def get_history() -> list[EstimateResponse]:
    return history.get_all()
