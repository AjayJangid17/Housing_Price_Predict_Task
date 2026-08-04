"use client";

export default function MarketError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-900">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="mt-2">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 rounded-md bg-red-600 px-3 py-2 text-white hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
}
