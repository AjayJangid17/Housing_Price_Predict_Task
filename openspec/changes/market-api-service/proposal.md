# Proposal: market-api service implementation

## Summary

Build a Spring Boot `market-api` service that exposes dataset-driven housing market analytics and delegates the predictive price flow to the existing Python `ml-api` service. The service should provide a health endpoint, aggregate market summary, filtered property listing, what-if pricing, and file export support.

## Problem

The repository already contains the housing dataset, the ML prediction service, and an OpenAPI contract for the market API, but the Java market service was only scaffolded. The missing piece was the actual implementation of the API contract and runtime wiring.

## Why

This change turns the spec into a working backend service that can:

- serve analytics over the dataset,
- provide reusable property filtering and sorting,
- forward hypothetical property requests to the ML service,
- return downloadable CSV/PDF-style export results.

## Goals

- Implement the endpoints defined by the OpenAPI spec.
- Keep the service decoupled from the ML model logic by calling `ml-api` over HTTP.
- Use the dataset already bundled with the repo for market-level read operations.

## Non-goals

- Rewriting the ML model training pipeline.
- Replacing the Python `ml-api` with a new inference engine.
- Building a full database-backed marketplace persistence layer.
