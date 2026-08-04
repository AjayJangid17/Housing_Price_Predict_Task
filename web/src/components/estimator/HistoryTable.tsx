"use client";

import { useMemo, useState } from "react";
import { formatCurrency } from "@/lib/format";
import type { EstimateResponse } from "@/lib/types";

interface HistoryTableProps {
  history: EstimateResponse[];
}

const PAGE_SIZE = 10;

export function HistoryTable({ history }: HistoryTableProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(history.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return history.slice(start, start + PAGE_SIZE);
  }, [history, currentPage]);

  if (history.length === 0) {
    return (
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">History</h2>
        <p className="mt-3 text-sm text-gray-600">No estimates have been recorded yet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">History</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-gray-700">
            <tr>
              <th className="px-3 py-2">Timestamp</th>
              <th className="px-3 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {paginatedHistory.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-3 py-2">{new Date(row.timestamp).toLocaleString()}</td>
                <td className="px-3 py-2 font-semibold">{formatCurrency(row.estimated_price)}</td>
              </tr>
            ))}
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
    </section>
  );
}
