import { formatCurrency } from "@/lib/format";
import type { EstimateResponse } from "@/lib/types";

interface PriceBarChartProps {
  result: EstimateResponse | null;
  history?: EstimateResponse[];
}

const CHART_HEIGHT = 180;
const MAX_BARS = 8;

export function PriceBarChart({ result, history = [] }: PriceBarChartProps) {
  if (!result) {
    return (
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Price comparison chart</h2>
        <p className="mt-3 text-sm text-gray-600">Submit the form to see a price chart.</p>
      </section>
    );
  }

  // History is stored oldest-first; take the most recent prior entries (excluding the latest).
  const recentHistory = history
    .filter((entry) => entry.id !== result.id)
    .slice(-(MAX_BARS - 1));
  const bars = [...recentHistory, result];

  const maxPrice = Math.max(...bars.map((bar) => bar.estimated_price), 1);

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Price comparison chart</h2>
      <p className="mt-1 text-sm text-gray-600">
        Latest estimate vs. your {recentHistory.length} most recent prior estimate
        {recentHistory.length === 1 ? "" : "s"}.
      </p>

      <div
        className="mt-6 flex items-end gap-3"
        style={{ height: CHART_HEIGHT }}
        role="img"
        aria-label={`Bar chart comparing estimated prices, latest is ${formatCurrency(result.estimated_price)}`}
      >
        {bars.map((bar, index) => {
          const isLatest = bar.id === result.id;
          const barHeight = Math.max(6, (bar.estimated_price / maxPrice) * (CHART_HEIGHT - 32));
          return (
            <div key={`${bar.id}-${index}`} className="flex flex-1 flex-col items-center justify-end gap-1">
              <span className="text-[11px] font-medium text-gray-600">
                {formatCurrency(bar.estimated_price)}
              </span>
              <div
                className={`w-full rounded-t-md transition-all duration-500 ease-out ${
                  isLatest ? "bg-emerald-600" : "bg-slate-300"
                }`}
                style={{ height: barHeight }}
                title={formatCurrency(bar.estimated_price)}
              />
              <span className="text-[10px] text-gray-400">{isLatest ? "Latest" : `#${index + 1}`}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
