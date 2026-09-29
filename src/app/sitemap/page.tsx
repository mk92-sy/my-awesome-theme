import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Home, LockKeyhole, Palette, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Explore the MyAwesomeTheme color palette generator, tools, and site information.",
  alternates: { canonical: "/sitemap" },
};

const groups = [
  {
    title: "Explore",
    description: "Jump back into creating and refining your color system.",
    items: [
      { title: "Color Palette Generator", detail: "Create a complete 50–950 color scale from a HEX value.", href: "/", icon: Palette, tag: "Main tool" },
    ],
  },
  {
    title: "Tools & workflow",
    description: "Find the core features available on the home page.",
    items: [
      { title: "Contrast Checker", detail: "Check color combinations against WCAG contrast guidelines.", href: "/#contrast-checker", icon: Sparkles, tag: "Accessibility" },
      { title: "Export Color Tokens", detail: "Copy tokens for Tailwind CSS v4, v3, or CSS variables.", href: "/#export", icon: BookOpen, tag: "Developer tools" },
    ],
  },
  {
    title: "About this site",
    description: "Learn about the project and how site information is handled.",
    items: [
      { title: "About MyAwesomeTheme", detail: "What the tool does and how to use it.", href: "/about", icon: Home, tag: "About" },
      { title: "Privacy Policy", detail: "Read about privacy, data handling, and site practices.", href: "/privacy", icon: LockKeyhole, tag: "Legal" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <main className="sitemap-page">
      <div className="shell sitemap-shell">
        <header className="sitemap-header">
          <Link className="brand" href="/">
            <span className="brand-mark"><Palette size={19} /></span>
            <span>MyAwesomeTheme</span>
          </Link>
          <Link className="sitemap-home-link" href="/"><Home size={16} /> Back to generator</Link>
        </header>

        <section className="sitemap-hero">
          <div className="sitemap-eyebrow"><span /> SITE DIRECTORY</div>
          <h1>Everything, <span>in one place.</span></h1>
          <p>A simple guide to the tools, resources, and information across MyAwesomeTheme.</p>
          <div className="sitemap-stats" aria-label="Site directory summary">
            <div><strong>05</strong><span>Helpful destinations</span></div>
            <i />
            <div><strong>03</strong><span>Sections to explore</span></div>
          </div>
        </section>

        <div className="sitemap-groups">
          {groups.map((group, index) => (
            <section className="sitemap-group" key={group.title}>
              <div className="sitemap-group-heading">
                <span className="sitemap-index">0{index + 1}</span>
                <div><h2>{group.title}</h2><p>{group.description}</p></div>
              </div>
              <div className="sitemap-card-grid">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link className="sitemap-card" href={item.href} key={item.title}>
                      <span className="sitemap-card-icon"><Icon size={19} /></span>
                      <span className="sitemap-card-content">
                        <span className="sitemap-card-tag">{item.tag}</span>
                        <strong>{item.title}</strong>
                        <span className="sitemap-card-detail">{item.detail}</span>
                      </span>
                      <ArrowUpRight className="sitemap-card-arrow" size={18} />
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <footer className="sitemap-footer">
          <span>© {new Date().getFullYear()} MyAwesomeTheme</span>
          <nav aria-label="Footer navigation"><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/">Home</Link></nav>
        </footer>
      </div>
    </main>
  );
}
