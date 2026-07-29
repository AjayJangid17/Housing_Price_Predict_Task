import joblib
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

from app import config


def main():
    #load data
    df = pd.read_csv(config.DATA_PATH)
    X = df[config.FEATURE_COLUMNS]
    y = df[config.TARGET_COLUMN]

    #Hold out 20% to measure honest performance 
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    #Train a simple linear regression
    model = LinearRegression()
    model.fit(X_train,y_train)

    #Evaluate on the unseen test set
    preds = model.predict(X_test)
    metrics = {
        "r2": float(r2_score(y_test, preds)),
        "mae": float(mean_absolute_error(y_test,preds)),
        "rmse":float(mean_squared_error(y_test, preds) ** 0.5),
    }

    # Save model + metrics together as one artifact 
    config.MODEL_PATH.parent.mkdir(parents=True,exist_ok=True)
    artifact = {
        "model": model,
        "feature_columns": config.FEATURE_COLUMNS,
        "metrics": metrics
    }
    joblib.dump(artifact, config.MODEL_PATH)
    print(f"Saved model ->{config.MODEL_PATH}")
    print("Metrics",metrics)

if __name__ == "__main__":
    main()