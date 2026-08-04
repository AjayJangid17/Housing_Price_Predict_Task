from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

# A valid property payload reused across tests
SAMPLE_PROPERTY = {
    "square_footage": 1850,
    "bedrooms": 3,
    "bathrooms": 2,
    "year_built": 1998,
    "lot_size": 7500,
    "distance_to_city_center": 5.6,
    "school_rating": 8.2,
}


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_predict_single():
    response = client.post("/predict", json=SAMPLE_PROPERTY)
    assert response.status_code == 200
    body = response.json()
    assert "predicted_price" in body
    assert body["predicted_price"] > 0


def test_predict_batch():
    payload = {"properties": [SAMPLE_PROPERTY, SAMPLE_PROPERTY]}
    response = client.post("/predict/batch", json=payload)
    assert response.status_code == 200
    predictions = response.json()["prediction"]
    assert len(predictions) == 2


def test_model_info():
    response = client.get("/model-info")
    assert response.status_code == 200
    body = response.json()
    assert body["model_type"] == "LinearRegression"
    assert len(body["coefficients"]) == 7


def test_predict_invalid_input():
    bad_property = {**SAMPLE_PROPERTY, "school_rating": 50}  # exceeds le=10
    response = client.post("/predict", json=bad_property)
    assert response.status_code == 422
