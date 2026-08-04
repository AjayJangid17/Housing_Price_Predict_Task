# Housing Price Prediction API

Small FastAPI service that predicts house prices from 7 property features.
Part of a larger portal project (this is the ML API, Task 1).

## Endpoints
- GET  /health        - health check
- POST /predict       - single prediction
- POST /predict/batch - multiple predictions
- GET  /model-info    - coefficients + metrics

## Run it
(local: uv sync -> python -m app.train -> uvicorn app.main:app)
Full steps: docs/task1-ml-api.md

## Model
LinearRegression, 7 features. R^2 ~0.98, MAE ~$7.9k on a 20% test split.
Model + metrics are saved together in models/model.joblib.

## Notes / decisions
- LinearRegression, not something fancier. The task asked for coefficients + it's interpretable, and it already scored R² ≈ 0.98 on the holdout — so a RandomForest/boosting model would've been over-engineering for no real gain

- Pydantic for validation. Bad input gets an automatic 422 and Swagger documents the schema — no hand-written validation.

- Next can be added : CI (GitHub Actions) — run pytest and build the image on every push.