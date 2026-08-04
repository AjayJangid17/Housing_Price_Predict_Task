import os

ML_API_URL = os.getenv("ML_API_URL", "http://localhost:8000")
REQUEST_TIMEOUT = 10.0

#API metadata
APP_TITLE = "Property Value Estimator API"
APP_VERSION = "0.1.0"

#ml-api endpoints
PREDICT_PATH = "/predict"
BATCH_PREDICT_PATH = "/predict/batch"
