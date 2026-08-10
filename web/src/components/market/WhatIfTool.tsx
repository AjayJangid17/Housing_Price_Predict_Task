"use client";

import { useState } from "react";
import { DEFAULT_PROPERTY, PROPERTY_FIELDS, validatePropertyInput } from "@/lib/propertyFields";
import type { PropertyInput, WhatifResponse } from "@/lib/types";
import { FEATURES_LABLES } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

interface Contribution {
  name: keyof PropertyInput;
  label: string;
  delta: number;
  impact: number;
}

export function WhatIfTool() {
  const [values, setValues] = useState<PropertyInput>(DEFAULT_PROPERTY);
  const [result, setResult] = useState<WhatifResponse | null>(null);
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

      if (typeof payload?.predicted_price !== "number" || !payload?.coefficients) {
        throw new Error("Prediction response did not include model details.");
      }
      setResult(payload as WhatifResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not run what-if prediction.");
    } finally {
      setLoading(false);
    }
  };

  // Baseline = a typical home (DEFAULT_PROPERTY). Delta vs baseline shows the
  // impact of the changes the user made, broken down feature by feature.
  const baselinePrice = result
    ? result.intercept +
      PROPERTY_FIELDS.reduce(
        (sum, field) => sum + result.coefficients[field.name] * DEFAULT_PROPERTY[field.name],
        0
      )
    : null;

  const contributions: Contribution[] = result
    ? PROPERTY_FIELDS.map((field) => {
        const delta = result.inputs[field.name] - DEFAULT_PROPERTY[field.name];
        return {
          name: field.name,
          label: field.label,
          delta,
          impact: result.coefficients[field.name] * delta,
        };
      }).filter((c) => Math.abs(c.delta) > 1e-9)
    : [];

  const deltaVsBaseline = result && baselinePrice !== null ? result.predicted_price - baselinePrice : null;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">What-if scenario tester</h2>
        <p className="text-sm text-gray-600">
          Adjust feature values to see how each change moves the price compared to a typical home.
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

      {result && deltaVsBaseline !== null ? (
        <div className="space-y-3">
          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
            <div className="font-semibold">Change vs. a typical home</div>
            <div className="mt-1 text-2xl font-bold">
              {deltaVsBaseline >= 0 ? "+" : "-"}
              {formatCurrency(Math.abs(deltaVsBaseline))}
            </div>
            <p className="mt-1 text-xs text-blue-800">
              Typical home baseline: {formatCurrency(baselinePrice ?? 0)} &middot; This scenario:{" "}
              {formatCurrency(result.predicted_price)}
            </p>
          </div>

          {contributions.length > 0 ? (
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-2 text-sm font-semibold text-gray-700">What drove the change</div>
              <ul className="space-y-1.5 text-sm">
                {contributions.map((c) => (
                  <li key={c.name} className="flex items-center justify-between">
                    <span className="text-gray-600">
                      {FEATURES_LABLES[c.name]} ({c.delta >= 0 ? "+" : ""}
                      {c.delta})
                    </span>
                    <span className={c.impact >= 0 ? "font-medium text-emerald-700" : "font-medium text-red-700"}>
                      {c.impact >= 0 ? "+" : "-"}
                      {formatCurrency(Math.abs(c.impact))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-xs text-gray-500">No changes from the typical home baseline yet.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
