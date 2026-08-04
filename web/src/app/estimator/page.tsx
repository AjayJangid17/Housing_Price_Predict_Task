"use client";

import { DEFAULT_PROPERTY } from "@/lib/propertyFields";
import { useEstimator } from "@/hooks/useEstimator";
import { ComparisonView } from "@/components/estimator/ComparisonView";
import { EstimateResult } from "@/components/estimator/EstimateResult";
import { HistoryTable } from "@/components/estimator/HistoryTable";
import { PriceBarChart } from "@/components/estimator/PriceBarChart";
import { PropertyForm } from "@/components/estimator/PropertyForm";

export default function EstimatorPage() {
  const { latest, loading, error, history, estimate } = useEstimator();

  return (
    <div className="space-y-8">
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">Property Value Estimator</h1>
          <p className="text-sm text-gray-600">
            Enter the property details, submit the form, and compare the latest result
            with the existing estimation history.
          </p>
        </div>

        <PropertyForm
          initialValues={DEFAULT_PROPERTY}
          onSubmit={estimate}
          loading={loading}
          error={error}
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <EstimateResult result={latest} />
        <PriceBarChart result={latest} history={history} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <ComparisonView latest={latest} history={history} />
        <HistoryTable history={history} />
      </div>
    </div>
  );
}
