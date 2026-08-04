import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Housing Portal",
  description: "Property value estimation and market analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="mx-auto px-4 py-8 w-full flex-1 max-w-6xl">
          <PageTransition>{children}</PageTransition>
        </main>
        <footer className="bg-gray-100 py-4 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Housing Portal. FastApi &amp;. Spring Boot
        </footer>
      </body>
    </html>
  );
}
