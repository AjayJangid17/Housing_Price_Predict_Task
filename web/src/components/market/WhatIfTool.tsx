"use client";

import { useState } from "react";
import { DEFAULT_PROPERTY, PROPERTY_FIELDS, validatePropertyInput } from "@/lib/propertyFields";
import type { PropertyInput } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

export function WhatIfTool() {
  const [values, setValues] = useState<PropertyInput>(DEFAULT_PROPERTY);
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateValue = (name: keyof PropertyInput, value: string) => {
    setValues((current) => ({
      ...current,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validatePropertyInput(values);
    if (Object.keys(validationErrors).length > 0) {
      setError("Please fix the highlighted values before submitting.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/market/what-if", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error ?? "Could not run what-if prediction.");
      }

      const predicted = payload?.predicted_price ?? payload?.predictedPrice;
      if (typeof predicted !== "number") {
        throw new Error("Prediction response did not include a price.");
      }
      setResult(predicted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not run what-if prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">What-if scenario tester</h2>
        <p className="text-sm text-gray-600">
          Adjust feature values to estimate how the market might value a similar property.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {PROPERTY_FIELDS.map((field) => (
            <label key={field.name} className="text-sm font-medium text-gray-700">
              <span className="mb-1 block">{field.label}</span>
              <input
                type="number"
                min={field.min}
                max={field.max}
                step={field.step ?? 1}
                value={values[field.name]}
                onChange={(event) => updateValue(field.name, event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </label>
          ))}
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Running prediction..." : "Run what-if prediction"}
        </button>
      </form>

      {result !== null ? (
        <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
          <div className="font-semibold">Predicted market price</div>
          <div className="mt-1 text-2xl font-bold">{formatCurrency(result)}</div>
        </div>
      ) : null}
    </div>
  );
}
