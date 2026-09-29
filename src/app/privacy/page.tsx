import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import PrivacyContent from "@/components/privacy-content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read how MyAwesomeTheme handles information when you use its browser-based color palette and contrast tools.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Privacy Policy | MyAwesomeTheme",
    description:
      "How MyAwesomeTheme handles information when you use its color tools.",
    url: "/privacy",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto min-h-screen w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SiteHeader />
        <PrivacyContent />
        <footer className="flex items-center justify-between gap-4 border-t border-slate-200 py-8 text-sm text-slate-500">
          <Link href="/">Color generator</Link>
          <Link href="/about">About</Link>
        </footer>
      </div>
    </main>
  );
}
