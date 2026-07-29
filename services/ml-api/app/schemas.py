from pydantic import BaseModel, Field

#------INPUT-------
class PropertyFeatures(BaseModel):
    '''Field names Must match config.FEATURE_COLUMNS'''
    square_footage : int = Field(...,gt=0,description="Living area in sq ft")
    bedrooms : int = Field(...,ge=0,le=20)
    bathrooms : float = Field(...,ge=0,le=20)
    year_built : int = Field(...,ge=1800,le=2100)
    lot_size : int = Field(...,gt=0)
    distance_to_city_center : float = Field(...,ge=0)
    school_rating : float = Field(...,ge=0,le=10)

    model_config = {
        "json_schema_extra":{
            "example":{
                "square_footage": 1850,
                "bedrooms": 3,
                "bathrooms": 2,
                "year_built": 1998,
                "lot_size": 7500,
                "distance_to_city_center": 5.6,
                "school_rating": 8.2,
            }
        }
    }


# ----- OUTPUT -------
class PredictionResponse(BaseModel):
    predicted_price:float

class BatchPredictionRequest(BaseModel):
    properties: list[PropertyFeatures]

class BatchPredictionResponse(BaseModel):
    prediction: list[float]

class ModelInfoResponse(BaseModel):
    model_type: str
    features: list[str]
    coefficients: dict[str, float]
    intercept: float
    metrics: dict[str, float]