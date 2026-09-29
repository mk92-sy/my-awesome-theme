import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read how MyAwesomeTheme handles information when you use its browser-based color palette and contrast tools.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="app"><div className="shell info-page">
      <header className="info-page-header">
        <Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">✳</span><span>MyAwesomeTheme</span></Link>
        <Link className="info-back-link" href="/">Back to color generator</Link>
      </header>
      <article className="info-article">
        <p className="info-eyebrow">LEGAL</p><h1>Privacy Policy</h1><p className="info-muted">Last updated: September 29, 2026</p>
        <p className="info-lead">This page describes how MyAwesomeTheme handles information when you visit and use the website. Review and update it to reflect the actual hosting, analytics, advertising, and contact services configured for your deployment before publishing it as a final legal policy.</p>
        <h2>1. Information you enter</h2><p>Color values you enter are used by the application to generate palettes, preview colors, and calculate contrast in your browser. The application does not currently require an account or ask you to submit your name, email address, or profile information to use these tools.</p>
        <h2>2. Local processing and sharing</h2><p>Palette generation and contrast calculations are performed in the client-side application. Copy controls use your browser's clipboard feature. The selected base color may be placed in the page URL so it can be represented in a shareable link; anyone with that URL can see the color value in it.</p>
        <h2>3. Server and hosting logs</h2><p>The hosting provider and infrastructure used to deliver the website may process technical information such as IP address, request time, browser information, and security or error logs. Exact data, retention periods, and purposes depend on the providers configured for the live deployment. Review their current privacy documentation.</p>
        <h2>4. Cookies, analytics, and advertising</h2><p>This policy does not assert that analytics, advertising, or non-essential cookies are enabled. If these services are added, update this section to name providers, describe data and purposes, and explain applicable consent or opt-out choices.</p>
        <h2>5. Third-party services</h2><p>External websites are governed by their own privacy policies. Hosting, domain, CDN, analytics, or other vendors used by the deployed service may process information under their own terms.</p>
        <h2>6. Children</h2><p>This is a general-purpose design and development utility and is not specifically directed at children.</p>
        <h2>7. Changes</h2><p>This policy may be updated as the product, infrastructure, or applicable requirements change. Revise the “Last updated” date whenever a substantive change is published.</p>
        <h2>8. Contact</h2><p>A verified operator name and privacy contact address have not been supplied for this project. Add a monitored contact method and responsible operator details here before making this policy public as a final legal notice.</p>
        <div className="info-callout"><strong>Important</strong><p>This is a product-specific starter policy, not legal advice. Confirm deployment providers, jurisdiction, operator details, and applicable legal requirements before launch.</p></div>
      </article>
      <footer className="info-footer"><Link href="/">Color generator</Link><Link href="/about">About</Link></footer>
    </div></main>
  );
}
