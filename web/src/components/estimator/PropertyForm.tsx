"use client";

import { useMemo, useState } from "react";
import { DEFAULT_PROPERTY, PROPERTY_FIELDS, validatePropertyInput } from "@/lib/propertyFields";
import type { PropertyInput } from "@/lib/types";

interface PropertyFormProps {
  initialValues?: PropertyInput;
  onSubmit: (values: PropertyInput) => Promise<void> | void;
  loading?: boolean;
  error?: string | null;
}

export function PropertyForm({
  initialValues = DEFAULT_PROPERTY,
  onSubmit,
  loading = false,
  error = null,
}: PropertyFormProps) {
  const [values, setValues] = useState<PropertyInput>(initialValues);
  const validationErrors = useMemo(() => validatePropertyInput(values), [values]);

  const updateValue = (name: keyof PropertyInput, rawValue: string) => {
    const inputValue = Number(rawValue);
    setValues((current) => ({
      ...current,
      [name]: inputValue,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validatePropertyInput(values);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {PROPERTY_FIELDS.map((field) => (
          <label key={field.name} className="block text-sm font-medium text-gray-700">
            <span className="mb-1 block">{field.label}</span>
            <input
              type="number"
              min={field.min}
              max={field.max}
              step={field.step ?? 1}
              value={values[field.name]}
              onChange={(event) => updateValue(field.name, event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500"
            />
            {validationErrors[field.name] ? (
              <span className="mt-1 block text-xs text-red-600">{validationErrors[field.name]}</span>
            ) : null}
          </label>
        ))}
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
      >
        {loading ? "Estimating..." : "Estimate Price"}
      </button>
    </form>
  );
}
