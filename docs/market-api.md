# Market API Guide

This document describes the Spring Boot `market-api` service and how to run it locally.

## What the service does

`market-api` exposes market-level housing analytics over the dataset, supports filtered property listing, and forwards hypothetical property pricing requests to the Python `ml-api` service.

## Prerequisites

- Java 21+
- Maven
- A running `ml-api` service on `http://localhost:8000`

## Run locally

From the repository root:

```bash
cd services/market-api
mvn spring-boot:run
```

The service will start on:

```text
http://localhost:8080
```

## Run with packaged jar

```bash
cd services/market-api
mvn -DskipTests package
java -jar target/market-api-0.0.1-SNAPSHOT.jar
```

## Endpoints

### 1. Health check

- Method: `GET`
- Path: `/health`
- Purpose: Confirms that the service is running.

Example:

```bash
curl http://localhost:8080/health
```

Response:

```json
{
  "status": "ok"
}
```

### 2. Market summary

- Method: `GET`
- Path: `/market/summary`
- Purpose: Returns aggregated market statistics from the dataset.

Example:

```bash
curl http://localhost:8080/market/summary
```

Example response shape:

```json
{
  "count": 500,
  "averagePrice": 265000.0,
  "minPrice": 120000,
  "maxPrice": 540000,
  "avgPriceByBedrooms": {
    "2": 185000.0,
    "3": 265000.0,
    "4": 350000.0
  }
}
```

### 3. List filtered properties

- Method: `GET`
- Path: `/market/properties`
- Purpose: Returns properties with optional filters and sorting.

Query parameters:

- `minPrice` (optional)
- `maxPrice` (optional)
- `bedrooms` (optional)
- `sortBy` (optional, allowed: `price`, `square_footage`, `year_built`, `school_rating`)
- `order` (optional, allowed: `asc`, `desc`)

Example:

```bash
curl "http://localhost:8080/market/properties?minPrice=200000&maxPrice=300000&bedrooms=3&sortBy=price&order=asc"
```

### 4. What-if prediction

- Method: `POST`
- Path: `/market/what-if`
- Purpose: Sends a hypothetical property payload to the `ml-api` and returns the predicted price.

Request body example:

```json
{
  "squareFootage": 1850,
  "bedrooms": 3,
  "bathrooms": 2,
  "year_built": 1998,
  "lot_size": 7500,
  "distance_to_city_center": 5.6,
  "school_rating": 8.2
}
```

Example:

```bash
curl -X POST http://localhost:8080/market/what-if \
  -H "Content-Type: application/json" \
  -d '{
    "squareFootage": 1850,
    "bedrooms": 3,
    "bathrooms": 2,
    "year_built": 1998,
    "lot_size": 7500,
    "distance_to_city_center": 5.6,
    "school_rating": 8.2
  }'
```

Example response:

```json
{
  "predictedPrice": 265000.0,
  "inputs": {
    "squareFootage": 1850,
    "bedrooms": 3,
    "bathrooms": 2,
    "year_built": 1998,
    "lot_size": 7500,
    "distance_to_city_center": 5.6,
    "school_rating": 8.2
  }
}
```

If the downstream `ml-api` is unavailable, the endpoint returns HTTP `503` with:

```json
{
  "error": "ml-api is unavailable"
}
```

### 5. Export filtered properties

- Method: `GET`
- Path: `/market/export`
- Purpose: Exports the filtered property dataset as a CSV or PDF-compatible response.

Query parameters:

- `format` (required, `csv` or `pdf`)
- `minPrice` (optional)
- `maxPrice` (optional)
- `bedrooms` (optional)

Example:

```bash
curl "http://localhost:8080/market/export?format=csv&minPrice=200000&maxPrice=300000&bedrooms=3" -o properties.csv
```

## Docker usage

A Dockerfile is included in the module. Build and run it from the service directory:

```bash
cd services/market-api
docker build -t market-api .
docker run -p 8080:8080 market-api
```

## Notes

- `market-api` reads the housing dataset from the classpath resource in `src/main/resources/data/House Price Dataset.csv`.
- The `what-if` endpoint depends on the Python model service being available at `http://localhost:8000`.
