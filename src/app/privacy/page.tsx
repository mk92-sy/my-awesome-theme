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
    <main className="app">
      <div className="shell info-page">
        <SiteHeader />
        <PrivacyContent />
        <footer className="info-footer">
          <Link href="/">Color generator</Link>
          <Link href="/about">About</Link>
        </footer>
      </div>
    </main>
  );
}
