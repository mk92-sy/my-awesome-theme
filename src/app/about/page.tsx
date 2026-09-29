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
    <main className="app">
      <div className="shell info-page">
        <SiteHeader />
        <AboutContent />
        <footer className="info-footer">
          <Link href="/">Color generator</Link>
          <Link href="/privacy">Privacy Policy</Link>
        </footer>
      </div>
    </main>
  );
}
