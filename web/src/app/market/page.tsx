import { ExportButton } from "@/components/market/ExportButton";
import { MarketFilters } from "@/components/market/MarketFilters";
import { PropertiesTable } from "@/components/market/PropertiesTable";
import { SummaryCards } from "@/components/market/SummaryCards";
import { WhatIfTool } from "@/components/market/WhatIfTool";
import { getProperties, getSummary } from "@/lib/marketApi";
import type { PropertyQuery } from "@/lib/marketApi";

export const dynamic = "force-dynamic";

interface MarketPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function toNumber(value: string | string[] | undefined): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function toStringParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function MarketPage({ searchParams }: MarketPageProps) {
  const params = await searchParams;
  const query: PropertyQuery = {
    minPrice: toNumber(params.minPrice),
    maxPrice: toNumber(params.maxPrice),
    bedrooms: toNumber(params.bedrooms),
    bathrooms: toNumber(params.bathrooms),
    sortBy: toStringParam(params.sortBy) ?? "price",
    order: (toStringParam(params.order) as "asc" | "desc") ?? "asc",
  };

  const [summary, properties] = await Promise.all([
    getSummary(),
    getProperties(query),
  ]);
  return (
    <div className="space-y-8">
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Property Market Analysis</h1>
            <p className="text-sm text-gray-600">
              Review aggregate market metrics, inspect historical property listings,
              and run a market what-if prediction.
            </p>
          </div>
          <ExportButton />
        </div>

        <SummaryCards summary={summary} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <MarketFilters
            initialValues={{
              minPrice: params.minPrice ? String(query.minPrice ?? "") : "",
              maxPrice: params.maxPrice ? String(query.maxPrice ?? "") : "",
              bedrooms: params.bedrooms ? String(query.bedrooms ?? "") : "",
              bathrooms: params.bathrooms ? String(query.bathrooms ?? "") : "",
              sortBy: query.sortBy ?? "price",
              order: query.order ?? "asc",
            }}
          />
        </section>

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <WhatIfTool />
        </section>
      </div>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <PropertiesTable properties={properties} />
      </section>
    </div>
  );
}
