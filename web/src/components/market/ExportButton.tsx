export function ExportButton() {
  return (
    <div className="flex gap-2">
      <a
        href="/api/market/export?format=csv"
        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        Export CSV
      </a>
      <a
        href="/api/market/export?format=pdf"
        className="rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
      >
        Export PDF
      </a>
    </div>
  );
}
