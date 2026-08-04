"use client";

import { useState } from "react";

interface FilterState {
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  sortBy: string;
  order: string;
}

const emptyState: FilterState = {
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
  bathrooms: "",
  sortBy: "price",
  order: "asc",
};

interface MarketFiltersProps {
  initialValues?: Partial<FilterState>;
}

export function MarketFilters({ initialValues }: MarketFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({ ...emptyState, ...initialValues });

  const handleChange = (key: keyof FilterState, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    window.location.href = `/market?${params.toString()}`;
  };

  const resetFilters = () => {
    window.location.href = "/market";
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Filter market properties</h2>
        <p className="text-sm text-gray-600">Refine the property list and update the current view.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-gray-700">
          <span className="mb-1 block">Min price</span>
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => handleChange("minPrice", e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
        </label>
        <label className="text-sm text-gray-700">
          <span className="mb-1 block">Max price</span>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
        </label>
        <label className="text-sm text-gray-700">
          <span className="mb-1 block">Bedrooms</span>
          <input
            type="number"
            value={filters.bedrooms}
            onChange={(e) => handleChange("bedrooms", e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
        </label>
        <label className="text-sm text-gray-700">
          <span className="mb-1 block">Bathrooms</span>
          <input
            type="number"
            value={filters.bathrooms}
            onChange={(e) => handleChange("bathrooms", e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
        </label>
        <label className="text-sm text-gray-700">
          <span className="mb-1 block">Sort by</span>
          <select
            value={filters.sortBy}
            onChange={(e) => handleChange("sortBy", e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="price">Price</option>
            <option value="square_footage">Square Footage</option>
            <option value="bedrooms">Bedrooms</option>
          </select>
        </label>
        <label className="text-sm text-gray-700">
          <span className="mb-1 block">Order</span>
          <select
            value={filters.order}
            onChange={(e) => handleChange("order", e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={applyFilters}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Apply filters
        </button>
        <button
          type="button"
          onClick={resetFilters}
          className="rounded-md border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-slate-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
