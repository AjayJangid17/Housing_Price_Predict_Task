# Design: market-api service implementation

## Overview

The `market-api` is a Spring Boot 3 service that exposes market data operations through HTTP endpoints. It uses a CSV-backed in-memory model for dataset queries and calls the `ml-api` service for prediction.

## Architecture

1. `MarketController`
   - Exposes the public REST endpoints.
   - Converts HTTP requests into service calls.
   - Returns DTO-style responses.

2. `MarketService`
   - Loads the housing dataset from classpath resources.
   - Computes summary aggregates.
   - Applies price, bedroom, and sort filters.

3. `MlApiClient`
   - Sends a `PropertyFeatures` payload to `http://localhost:8000/predict`.
   - Maps the ML response into the market API response format.

4. `ExportService`
   - Produces CSV export content for filtered properties.
   - Returns a PDF-compatible placeholder response structure.

## Data flow

- `GET /market/summary` reads the dataset and computes aggregate statistics.
- `GET /market/properties` filters and sorts rows from the dataset.
- `POST /market/what-if` forwards the request to `ml-api` and returns the predicted result.
- `GET /market/export` uses the same filtered dataset logic and emits a downloadable response.

## Key decisions

- Keep the ML inference separate from the market service to preserve the existing architecture boundary.
- Load the dataset from the bundled CSV resource rather than introducing a database layer.
- Use Spring Boot HTTP client and simple caching to keep the service lightweight.

## API contract alignment

The implementation is aligned to the OpenAPI spec in `openspec/specs/market-api/openapi.yaml`, especially for:

- health response shape,
- property feature request payload,
- market summary structure,
- `what-if` delegate flow,
- export format naming.
