import { formatCurrency } from "@/lib/format";
import type { EstimateResponse } from "@/lib/types";

interface ComparisonViewProps {
  latest: EstimateResponse | null;
  history: EstimateResponse[];
}

export function ComparisonView({ latest, history }: ComparisonViewProps) {
  const latestPrice = latest?.estimated_price ?? 0;
  const averageHistory =
    history.length > 0
      ? history.reduce((sum, row) => sum + row.estimated_price, 0) / history.length
      : 0;
  const delta = latestPrice - averageHistory;

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Comparison</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg bg-emerald-50 p-4">
          <div className="text-sm text-gray-600">Latest estimate</div>
          <div className="text-2xl font-bold">{formatCurrency(latestPrice)}</div>
        </div>
        <div className="rounded-lg bg-blue-50 p-4">
          <div className="text-sm text-gray-600">Average of history</div>
          <div className="text-2xl font-bold">{formatCurrency(averageHistory)}</div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-700">
        Difference from historical average: <span className="font-semibold">{formatCurrency(delta)}</span>
      </div>
    </section>
  );
}
