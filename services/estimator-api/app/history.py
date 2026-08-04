import uuid
from datetime import datetime, timezone

from app.schemas import EstimateResponse, PropertyInput

#In-memory store - resets on restart
#this is just for local - will change to redis or database

_history: list[EstimateResponse] = []

def record(inputs: PropertyInput,price: float) -> EstimateResponse:
    """Build estimate record, store, & return"""
    estimate = EstimateResponse(
        id=str(uuid.uuid4()),
        timestamp=datetime.now(timezone.utc),
        estimated_price=price,
        inputs=inputs
    )
    _history.append(estimate)
    return estimate

def get_all() -> list[EstimateResponse]:
    return list(_history)

def clear() -> None:
    _history.clear()