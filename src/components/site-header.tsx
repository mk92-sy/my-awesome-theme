"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Moon, Sun, Palette } from "lucide-react";

type Locale = "en" | "ko";
const messages = {
  en: { about: "About", privacy: "Privacy", theme: "Toggle color theme" },
  ko: { about: "소개", privacy: "개인정보", theme: "테마 전환" },
};

export default function SiteHeader({ dark: darkProp, onToggleTheme }: { dark?: boolean; onToggleTheme?: () => void }) {
  const pathname = usePathname();
  const [locale, setLocale] = useState<Locale>("ko");
  const [dark, setDark] = useState(false);
  const [settingsReady, setSettingsReady] = useState(false);

  useEffect(() => {
    const savedLocale = window.localStorage.getItem("mat-locale");
    const initialLocale: Locale = savedLocale === "en" ? "en" : "ko";
    setLocale(initialLocale);
    document.documentElement.lang = initialLocale;
    const savedTheme = window.localStorage.getItem("mat-theme") === "dark";
    setDark(savedTheme);
    document.querySelectorAll<HTMLElement>(".app").forEach((el) => el.classList.toggle("dark", savedTheme));
    document.documentElement.dataset.theme = savedTheme ? "dark" : "light";
    setSettingsReady(true);
  }, []);


  const toggleTheme = () => {
    const next = !(darkProp ?? dark);
    setDark(next);
    window.localStorage.setItem("mat-theme", next ? "dark" : "light");
    document.documentElement.dataset.theme = next ? "dark" : "light";
    document.querySelectorAll<HTMLElement>(".app").forEach((el) => el.classList.toggle("dark", next));
    onToggleTheme?.();
  };
  const t = messages[locale];

  return (
    <header className="topbar site-header">
      <Link className="brand" href="/" aria-label="MyAwesomeTheme home">
        <span className="brand-mark"><Palette size={19} /></span>
        <span>MyAwesomeTheme</span>
      </Link>
      <div className="top-actions">
        {settingsReady ? (
          <>
            <nav className="header-links" aria-label="Main navigation">
              <Link href="/about" className={pathname === "/about" ? "active" : undefined} aria-current={pathname === "/about" ? "page" : undefined}>{t.about}</Link>
              <Link href="/privacy" className={pathname === "/privacy" ? "active" : undefined} aria-current={pathname === "/privacy" ? "page" : undefined}>{t.privacy}</Link>
            </nav>
            <label className="locale-select-wrap">
              <select className="locale-select" aria-label="Language" value={locale} onChange={(e) => { const next = e.target.value as Locale; setLocale(next); document.documentElement.lang = next; document.documentElement.dataset.locale = next; window.localStorage.setItem("mat-locale", next); }}>
                <option value="ko">KO</option>
                <option value="en">EN</option>
              </select>
            </label>
            <button className="icon-button" aria-label={t.theme} onClick={toggleTheme}>
              {(darkProp ?? dark) ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </>
        ) : (
          <div className="header-settings-skeleton" aria-hidden="true">
            <div className="header-skeleton-nav-group"><span className="header-skeleton-nav header-skeleton-about" /><span className="header-skeleton-nav header-skeleton-privacy" /></div>
            <span className="header-skeleton-locale" />
            <span className="header-skeleton-theme" />
          </div>
        )}
      </div>
    </header>
  );
}
