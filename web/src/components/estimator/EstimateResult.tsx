import { formatCurrency } from "@/lib/format";
import type { EstimateResponse } from "@/lib/types";

interface EstimateResultProps {
  result: EstimateResponse | null;
}

export function EstimateResult({ result }: EstimateResultProps) {
  if (!result) {
    return (
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Latest estimate</h2>
        <p className="mt-3 text-sm text-gray-600">Submit the form to see the prediction result.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Latest estimate</h2>
      <div className="mt-4 space-y-3">
        <div className="text-3xl font-bold text-emerald-700">
          {formatCurrency(result.estimated_price)}
        </div>
        <div className="text-sm text-gray-600">
          <div>Recorded at: {new Date(result.timestamp).toLocaleString()}</div>
          <div>Reference id: {result.id}</div>
        </div>
      </div>
    </section>
  );
}
