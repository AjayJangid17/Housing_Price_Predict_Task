// Centralized service ports for local development and Docker
export const PORTS = {
  mlApi: 8000,
  estimatorApi: 8001,
  marketApi: 8080,
  web: 3000,
} as const;

export const ML_API_URL =
  process.env.ML_API_URL ?? `http://127.0.0.1:${PORTS.mlApi}`;

export const ESTIMATOR_API_URL =
  process.env.ESTIMATOR_API_URL ?? `http://127.0.0.1:${PORTS.estimatorApi}`;

export const MARKET_API_URL =
  process.env.MARKET_API_URL ?? `http://127.0.0.1:${PORTS.marketApi}`;