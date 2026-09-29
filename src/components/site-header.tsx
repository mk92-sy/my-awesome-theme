"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Moon, Sun, Palette, Languages } from "lucide-react";

type Locale = "en" | "ko";
const messages = {
  en: { about: "About", privacy: "Privacy", back: "Back to color generator", theme: "Toggle color theme", language: "한국어" },
  ko: { about: "소개", privacy: "개인정보", back: "컬러 생성기로 돌아가기", theme: "테마 전환", language: "English" },
};

export default function SiteHeader({ dark = false, onToggleTheme }: { dark?: boolean; onToggleTheme?: () => void }) {
  const [locale, setLocale] = useState<Locale>("en");
  useEffect(() => {
    const saved = window.localStorage.getItem("mat-locale");
    if (saved === "ko" || saved === "en") setLocale(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.locale = locale;
    window.localStorage.setItem("mat-locale", locale);
  }, [locale]);
  const t = messages[locale];
  return (
    <header className="topbar site-header">
      <Link className="brand" href="/" aria-label="MyAwesomeTheme home">
        <span className="brand-mark"><Palette size={19} /></span>
        <span>MyAwesomeTheme</span>
      </Link>
      <div className="top-actions">
        <nav className="header-links" aria-label="Main navigation">
          <Link href="/about">{t.about}</Link>
          <Link href="/privacy">{t.privacy}</Link>
        </nav>
        <button className="language-button" onClick={() => setLocale(locale === "en" ? "ko" : "en")} aria-label="Switch language">
          <Languages size={16} /> {t.language}
        </button>
        {onToggleTheme && <button className="icon-button" aria-label={t.theme} onClick={onToggleTheme}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>}
      </div>
    </header>
  );
}
