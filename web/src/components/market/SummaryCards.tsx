import { formatCurrency, formatNumber } from "@/lib/format";
import type { MarketSummary } from "@/lib/types";

interface SummaryCardsProps {
  summary: MarketSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const averageByBedrooms = Object.entries(summary.avgPriceByBedrooms ?? {});

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg bg-slate-50 p-4">
          <div className="text-sm text-gray-600">Properties</div>
          <div className="text-2xl font-bold">{formatNumber(summary.count)}</div>
        </div>
        <div className="rounded-lg bg-slate-50 p-4">
          <div className="text-sm text-gray-600">Average Price</div>
          <div className="text-2xl font-bold">{formatCurrency(summary.average_price)}</div>
        </div>
        <div className="rounded-lg bg-slate-50 p-4">
          <div className="text-sm text-gray-600">Lowest Price</div>
          <div className="text-2xl font-bold">{formatCurrency(summary.minPrice)}</div>
        </div>
        <div className="rounded-lg bg-slate-50 p-4">
          <div className="text-sm text-gray-600">Highest Price</div>
          <div className="text-2xl font-bold">{formatCurrency(summary.maxPrice)}</div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
          Average price by bedroom count
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {averageByBedrooms.length > 0 ? (
            averageByBedrooms.map(([bedrooms, value]) => (
              <span
                key={bedrooms}
                className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-800"
              >
                {bedrooms} bed: {formatCurrency(value)}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500">No bedroom aggregate data available.</span>
          )}
        </div>
      </div>
    </div>
  );
}
