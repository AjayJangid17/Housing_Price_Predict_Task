# Task 1 — Housing Price Prediction API

A containerised regression API (Python 3.12 · FastAPI · scikit-learn) that predicts
housing prices. This guide gets it running locally or in Docker in a few steps.

---

## Prerequisites

| Tool | Why | Check |
|------|-----|-------|
| **Python 3.12+** | Runtime | `python --version` |
| **uv** | Dependency manager ([install](https://docs.astral.sh/uv/getting-started/installation/)) | `uv --version` |
| **Docker Desktop** *(optional)* | Containerised run | `docker --version` |

---

## Option A — Run locally (uv)

### 1. Clone and enter the repo
```powershell
git clone https://github.com/AjayJangid17/Housing_Price_Predict_Task.git
cd Housing_Price_Predict_Task
```

### 2. Install dependencies (from the repo root)
```powershell
uv sync
```
This creates a `.venv` at the repo root with all dependencies from `uv.lock`.

### 3. Activate the environment
```powershell
.\.venv\Scripts\Activate.ps1
```
> If PowerShell blocks activation, run:
> `Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned` first,
> or skip activation and prefix commands with `uv run` (e.g. `uv run python -m app.train`).

### 4. Train the model
```powershell
cd services\ml-api
python -m app.train
```
Trains a `LinearRegression` model, prints the metrics (R², MAE, RMSE), and writes
`models/model.joblib`. **Run this once before starting the API locally.**

### 5. Start the API
```powershell
python -m uvicorn app.main:app --reload
```
Server runs at **http://127.0.0.1:8000**.

### 6. Open the interactive docs (Swagger)
Go to **http://127.0.0.1:8000/docs** and use **"Try it out"** on any endpoint.

---

## Option B — Run with Docker

From the `services/ml-api` folder (Docker Desktop running):
```powershell
cd services\ml-api
docker build -t ml-api .
docker run -p 8000:8000 ml-api
```
Then open **http://localhost:8000/docs**.

> The Docker build **trains the model automatically** from the bundled dataset, so
> you don't need to run the training step separately.

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/health` | Liveness check → `{"status": "ok"}` |
| `POST` | `/predict` | Predict the price for **one** property |
| `POST` | `/predict/batch` | Predict prices for **many** properties |
| `GET`  | `/model-info` | Model coefficients, intercept, and metrics |

### Example — single prediction
`POST /predict`
```json
{
  "square_footage": 1850,
  "bedrooms": 3,
  "bathrooms": 2,
  "year_built": 1998,
  "lot_size": 7500,
  "distance_to_city_center": 5.6,
  "school_rating": 8.2
}
```
Response:
```json
{ "predicted_price": 265000.0 }
```

### Example — batch prediction
`POST /predict/batch`
```json
{
  "properties": [
    { "square_footage": 1850, "bedrooms": 3, "bathrooms": 2, "year_built": 1998, "lot_size": 7500, "distance_to_city_center": 5.6, "school_rating": 8.2 },
    { "square_footage": 2400, "bedrooms": 4, "bathrooms": 3, "year_built": 2010, "lot_size": 10500, "distance_to_city_center": 8.2, "school_rating": 9 }
  ]
}
```

### Example — with curl
```powershell
curl http://127.0.0.1:8000/health
curl http://127.0.0.1:8000/model-info
```

---

## Run the tests
From `services/ml-api` (model must be trained first):
```powershell
python -m pytest -v
```

---

## Project structure (Task 1)
```
Housing_Price_Predict_Task/
├── pyproject.toml            # shared dependencies (repo root)
├── uv.lock                   # locked versions
├── dataset/                  # original datasets
└── services/
    └── ml-api/
        ├── app/
        │   ├── config.py     # paths + feature columns
        │   ├── schemas.py    # Pydantic request/response models
        │   ├── model.py      # load model, predict, model-info
        │   ├── train.py      # train + save model.joblib
        │   └── main.py       # FastAPI app + endpoints
        ├── data/             # training CSV
        ├── models/           # saved model.joblib (generated)
        ├── tests/            # pytest API tests
        ├── Dockerfile
        └── requirements.txt  # exported for the Docker image
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `uv trampoline failed to canonicalize script path` | Run via module: `python -m uvicorn ...` / `python -m pytest`. |
| `FileNotFoundError: model.joblib` | Run `python -m app.train` first (local run only). |
| Port 8000 already in use | Run on another port: `python -m uvicorn app.main:app --port 8001`. |
| Docker: `docker: command not found` | Start Docker Desktop and re-open the terminal. |
