"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    { href: "/", label: "Home" },
    { href: "/estimator", label: "Value Estimator" },
    { href: "/market", label: "Market Analysis" }
]

export default function Nav() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-10 border-b bg-white/80 py-3 backdrop-blur">
            <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4">
                <Link href="/" className="text-lg font-semibold">
                    Housing Portal
                </Link>
                <div className="flex gap-1 rounded-full border bg-slate-50 p-1">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
                                    isActive
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "text-gray-600 hover:bg-slate-200 hover:text-gray-900"
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </header>
    );
}