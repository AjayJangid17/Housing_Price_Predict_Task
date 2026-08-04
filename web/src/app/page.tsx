import Link from "next/link";

const apps = [
  {
    href: "/estimator",
    title: "PropertyValue Estimator",
    description:
      "Enter a property's features to get an instant price estimate, compare multiple properties, and review your estimation history.",
    cta: "Estimate a price",
    accent: "bg-emerald-600 hover:bg-emerald-700",
  },
  {
    href: "/market",
    title: "Property Market Analysis",
    description:
      "Explore market aggregates, filter and sort historical sales, run what-if predictions, and export data as CSV or PDF.",
    cta: "Analyze the market",
    accent: "bg-blue-600 hover:bg-blue-700",
  }
]

export default function Home() {
  return (
    <div className="flex flex-col gap-10">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Housing Portal</h1>
        <p className="text-lg text-gray-700">
          Two application over a shared ML price model - a value estimation and market analysis.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apps.map((app) => (
          <div
            key={app.href}
            className="rounded-xl border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-2">{app.title}</h2>
            <p className="text-gray-600 mb-4">{app.description}</p>
            <Link
              href={app.href}
              className={`inline-block rounded-full px-5 py-2 text-sm font-semibold text-white transition-colors ${app.accent}`}
            >
              {app.cta}
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
