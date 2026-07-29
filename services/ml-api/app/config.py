from pathlib import Path

Base_DIR = Path(__file__).resolve().parent.parent

DATA_PATH = Base_DIR / "data" / "House Price Dataset.csv"
MODEL_PATH = Base_DIR / "models" / "model.joblib"

# The 7 input features — (must match at train & predict time)
FEATURE_COLUMNS = [
    "square_footage",
    "bedrooms",
    "bathrooms",
    "year_built",
    "lot_size",
    "distance_to_city_center",
    "school_rating",
]

TARGET_COLUMN = "price"

# API metadata
APP_TITLE = "Housing Price Prediction API"
APP_VERSION = "0.1.0"

