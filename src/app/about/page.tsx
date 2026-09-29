import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import AboutContent from "@/components/about-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about MyAwesomeTheme, a free browser-based tool for generating color scales, checking contrast, previewing UI colors, and exporting design tokens.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About MyAwesomeTheme",
    description:
      "A browser-based color system toolkit for designers and developers.",
    url: "/about",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto min-h-screen w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SiteHeader />
        <AboutContent />
        <footer className="flex items-center justify-between gap-4 border-t border-slate-200 py-8 text-sm text-slate-500">
          <Link href="/">Color generator</Link>
          <Link href="/privacy">Privacy Policy</Link>
        </footer>
      </div>
    </main>
  );
}
