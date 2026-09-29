import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: "MyAwesomeTheme — Color Palette & Design System Generator",
    template: "%s | MyAwesomeTheme",
  },
  description:
    "Create harmonious 50–950 color palettes from any HEX color. Preview colors in UI components, check WCAG contrast, and export tokens for Tailwind CSS v4, v3, and CSS variables.",
  applicationName: "MyAwesomeTheme",
  alternates: { canonical: "/" },
  keywords: [
    "color palette generator",
    "color system",
    "Tailwind CSS colors",
    "Tailwind CSS v4",
    "CSS variables",
    "WCAG contrast checker",
    "accessible color palette",
    "design system",
    "HEX color",
  ],
  category: "design",
  openGraph: {
    type: "website",
    siteName: "MyAwesomeTheme",
    title: "MyAwesomeTheme — Color Palette & Design System Generator",
    description:
      "Generate a complete color scale, preview it in UI components, check contrast, and export ready-to-use code.",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "MyAwesomeTheme — Color Palette & Design System Generator",
    description:
      "Generate color scales, preview UI colors, check contrast, and export Tailwind or CSS variables.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#84CC16",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem("mat-theme")==="dark"?"dark":"light";var l=localStorage.getItem("mat-locale")==="en"?"en":"ko";document.documentElement.dataset.theme=t;document.documentElement.dataset.locale=l;document.documentElement.lang=l;}catch(e){}})();` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
