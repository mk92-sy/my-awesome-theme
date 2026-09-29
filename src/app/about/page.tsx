import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about MyAwesomeTheme, a free browser-based tool for generating color scales, checking contrast, previewing UI colors, and exporting design tokens.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="app">
      <div className="shell info-page">
        <header className="info-page-header">
          <Link className="brand" href="/">
            <span className="brand-mark" aria-hidden="true">✳</span>
            <span>MyAwesomeTheme</span>
          </Link>
          <Link className="info-back-link" href="/">Back to color generator</Link>
        </header>
        <article className="info-article">
          <p className="info-eyebrow">ABOUT THE TOOL</p>
          <h1>Build a consistent color system, starting with one color.</h1>
          <p className="info-lead">
            MyAwesomeTheme is a browser-based color palette and design-token tool for designers and developers.
            Start with a HEX color, generate a tonal scale, preview it in a sample interface, and export the values
            for your project.
          </p>
          <h2>What you can do</h2>
          <ul>
            <li><strong>Generate color scales:</strong> create a range of shades from 50 to 950 from a selected color.</li>
            <li><strong>Preview UI colors:</strong> try generated shades on a sample button before using them in your interface.</li>
            <li><strong>Check contrast:</strong> compare palette shades with black, white, or a custom text color and view contrast ratios and WCAG AA/AAA results.</li>
            <li><strong>Export design tokens:</strong> copy generated values as Tailwind CSS v4 theme tokens, Tailwind CSS v3 configuration, or CSS custom properties.</li>
          </ul>
          <h2>Who it is for</h2>
          <p>
            The tool is intended for people creating websites, applications, component libraries, and design systems.
            It provides a convenient starting point; always validate colors in your full product, including typography,
            states, and real usage contexts.
          </p>
          <h2>Accessibility note</h2>
          <p>
            Contrast results are calculated for the selected foreground and background colors against the WCAG
            contrast thresholds shown in the checker. Automated contrast checks do not guarantee that an entire
            interface meets every accessibility requirement.
          </p>
          <div className="info-callout">
            <strong>Privacy</strong>
            <p>Color generation is performed in your browser. Read the <Link href="/privacy">Privacy Policy</Link> for details about data handling and third-party infrastructure.</p>
          </div>
        </article>
        <footer className="info-footer"><Link href="/">Color generator</Link><Link href="/privacy">Privacy Policy</Link></footer>
      </div>
    </main>
  );
}
