import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ColorKit — Build your color system",
  description: "Generate beautiful color systems and export them to Tailwind CSS or CSS variables.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
