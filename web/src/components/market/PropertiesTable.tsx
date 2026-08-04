"use client";

import { useMemo, useState } from "react";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { Property } from "@/lib/types";

interface PropertiesTableProps {
  properties: Property[];
}

type SortKey = keyof Property;

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "square_footage", label: "Sq Ft" },
  { key: "bedrooms", label: "Beds" },
  { key: "bathrooms", label: "Baths" },
  { key: "distance_to_city_center", label: "City dist." },
  { key: "school_rating", label: "School" },
  { key: "price", label: "Price" },
];

export function PropertiesTable({ properties }: PropertiesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(properties.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return properties.slice(start, start + PAGE_SIZE);
  }, [properties, currentPage]);

  const sortedProperties = useMemo(() => {
    if (!sortKey) return properties;
    const copy = [...properties];
    copy.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      const result = aVal > bVal ? 1 : -1;
      return sortDir === "asc" ? result : -result;
    });
    return copy;
  }, [properties, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Historical properties</h2>
        <p className="text-sm text-gray-600">
          A sample of market listings loaded from the Java market service. Click a column
          heading to sort this page&apos;s rows.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-gray-700">
            <tr>
              {COLUMNS.map((column) => {
                const isActive = sortKey === column.key;
                return (
                  <th key={column.key} className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => toggleSort(column.key)}
                      className="flex items-center gap-1 font-semibold hover:text-blue-600"
                    >
                      {column.label}
                      <span className="text-xs text-gray-400">
                        {isActive ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                      </span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paginatedHistory.map((property) => (
              <tr key={property.id} className="border-t">
                <td className="px-3 py-2">{property.id}</td>
                <td className="px-3 py-2">{formatNumber(property.square_footage)}</td>
                <td className="px-3 py-2">{property.bedrooms}</td>
                <td className="px-3 py-2">{property.bathrooms}</td>
                <td className="px-3 py-2">{property.distance_to_city_center}</td>
                <td className="px-3 py-2">{property.school_rating}</td>
                <td className="px-3 py-2 font-semibold">{formatCurrency(property.price)}</td>
              </tr>
            ))}
            {sortedProperties.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-3 py-6 text-center text-gray-500">
                  No properties match the current filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-md border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-md border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
