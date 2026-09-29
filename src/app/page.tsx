"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Moon, Palette, Sun, WandSparkles } from "lucide-react";
import { isValidHex, makePalette, normalizeHex, type Shade } from "@/lib/color-utils";
import ContrastChecker from "@/components/contrast-checker";
import SiteHeader from "@/components/site-header";

export default function Home() {
  const [base, setBase] = useState("#84CC16");
  const [input, setInput] = useState("#84CC16");
  const [format, setFormat] = useState<"v4" | "v3" | "css">("v4");
  const [dark, setDark] = useState(false);
  const [locale, setLocale] = useState<"ko" | "en">("ko");
  const ko = locale === "ko";
  const [copied, setCopied] = useState("");
  const [previewButtonStep, setPreviewButtonStep] = useState<number>(500);
  const palette = useMemo(() => makePalette(base), [base]);
  const previewButtonShade = palette.find((shade) => shade.step === previewButtonStep) ?? palette[5] ?? palette[0];

  useEffect(() => {
    const savedLocale = window.localStorage.getItem("mat-locale");
    const initialLocale = savedLocale === "en" ? "en" : "ko";
    setLocale(initialLocale);
    const onLocaleChange = (event: Event) => setLocale((event as CustomEvent<"ko" | "en">).detail);
    window.addEventListener("mat-locale-change", onLocaleChange);
    const savedTheme = window.localStorage.getItem("mat-theme") === "dark";
    setDark(savedTheme);

    const params = new URLSearchParams(window.location.search);
    const color = params.get("color");

    if (color && isValidHex(color)) {
      const normalized = normalizeHex(color);
      setBase(normalized);
      setInput(normalized);
    }
    return () => window.removeEventListener("mat-locale-change", onLocaleChange);
  }, []);

  const code = useMemo(() => {
    if (format === "v4") {
      return `@theme {\n${palette.map((s) => `  --color-brand-${s.step}: ${s.hex};`).join("\n")}\n}`;
    }

    if (format === "v3") {
      return `/** tailwind.config.ts */\nexport default {\n  theme: {\n    extend: {\n      colors: {\n        brand: {\n${palette
        .map((s) => `          ${s.step}: "${s.hex}",`)
        .join("\n")}\n        },\n      },\n    },\n  },\n};`;
    }

    return `:root {\n${palette.map((s) => `  --color-brand-${s.step}: ${s.hex};`).join("\n")}\n}`;
  }, [format, palette]);

  async function copy(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      window.setTimeout(() => setCopied(""), 1500);
    } catch {
      setCopied("");
    }
  }

  function generate() {
    if (!isValidHex(input)) return;

    const normalized = normalizeHex(input);

    setBase(normalized);
    setInput(normalized);

    const url = new URL(window.location.href);
    url.searchParams.set("color", normalized.replace("#", ""));
    window.history.replaceState({}, "", url);
  }

  return (
    <main className={dark ? "app dark" : "app"}>
      <div className="shell">
        <SiteHeader dark={dark} onToggleTheme={() => setDark((current) => !current)} />

        <section className="hero">
          <div className="eyebrow">
            <WandSparkles size={13} /> {ko ? "컬러 시스템 생성기" : "COLOR SYSTEM GENERATOR"}
          </div>
          <h1>
            {ko ? <>나만의 컬러 시스템을<span>.</span></> : <>Build your color system<span>.</span></>}
          </h1>
          <p>{ko ? "하나의 컬러로 완성하는 디자인 시스템." : "One color. A complete design system."}</p>
          <div className="hero-highlights" aria-label={ko ? "주요 기능" : "What you can do"}>
            <span><i /> {ko ? "50–950 컬러 스케일" : "50–950 color scale"}</span>
            <span><i /> {ko ? "WCAG 명도 대비 검사" : "WCAG contrast checks"}</span>
            <span><i /> {ko ? "Tailwind 및 CSS 내보내기" : "Tailwind & CSS exports"}</span>
          </div>
        </section>

        <section className="workspace">
          <div className="section-heading">
            <div>
              <span className="step-label">01</span>
              <h2>{ko ? "컬러 선택" : "Choose your color"}</h2>
            </div>
            <span className="subtle">{ko ? "원하는 컬러에서 시작하세요" : "Start with any color"}</span>
          </div>
          <div className="color-input-card">
            <div className="color-input-left">
              <label className="color-picker-wrap" aria-label={ko ? "기준 컬러 선택" : "Choose base color"}>
                <input
                  type="color"
                  value={isValidHex(input) ? normalizeHex(input) : base}
                  onChange={(e) => {
                    // 컬러피커 변경은 입력값에만 반영하고,
                    // Generate를 눌렀을 때 팔레트를 갱신합니다.
                    setInput(e.target.value.toUpperCase());
                  }}
                />
                <span style={{ background: isValidHex(input) ? normalizeHex(input) : base }} />
              </label>
              <div className="hex-field">
                <label htmlFor="hex">HEX</label>
                <input
                  id="hex"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && generate()}
                  spellCheck={false}
                />
              </div>
            </div>
            <button type="button" className="primary-button" onClick={generate} disabled={!isValidHex(input)} aria-label={ko ? "입력한 HEX 컬러로 팔레트 생성" : "Generate a palette from the entered HEX color"}>
              {ko ? "팔레트 생성" : "Generate palette"} <WandSparkles size={16} />
            </button>
          </div>
        </section>

        <section className="workspace palette-section">
          <div className="section-heading">
            <div>
              <span className="step-label">02</span>
              <h2>{ko ? "컬러 팔레트" : "Your palette"}</h2>
            </div>
            <button
              className="text-button"
              onClick={() => copy(palette.map((s) => `${s.step}  ${s.hex}`).join("\n"), "all")}
            >
              {copied === "all" ? <Check size={15} /> : <Copy size={15} />} {ko ? "전체 복사" : "Copy all"}
            </button>
          </div>
          <div className="palette-grid">
            {palette.map((shade: Shade) => (
              <button
                type="button"
                key={shade.step}
                className="swatch"
                onClick={() => copy(shade.hex, String(shade.step))}
                title={`Copy ${shade.hex}`}
              >
                <span className="swatch-color" style={{ background: shade.hex, color: shade.text }}>
                  {copied === String(shade.step) ? <Check size={17} /> : <Copy size={15} />}
                </span>
                <span className="swatch-meta">
                  <b>{shade.step}{shade.isAnchor ? (ko ? " · 선택됨" : " · Selected") : ""}</b>
                  <span>{shade.hex}</span>
                </span>
              </button>
            ))}
          </div>
          <p className="helper-text">{ko ? "선택한 컬러와 가장 가까운 단계에 자동으로 배치하고 ‘선택됨’으로 표시합니다. 컬러를 클릭하면 HEX 값이 복사됩니다." : "Your selected color is automatically placed at the closest shade level and marked “Selected”. Click any shade to copy its HEX value."}</p>
        </section>

        <section id="contrast-checker" className="workspace"><ContrastChecker palette={palette} locale={locale} /></section>

        <section className="workspace export-section" id="export">
          <div className="section-heading">
            <div>
              <span className="step-label">04</span>
              <h2>{ko ? "컬러 내보내기" : "Export your colors"}</h2>
            </div>
            <span className="subtle">{ko ? "프로젝트에 바로 적용하세요" : "Ready for your project"}</span>
          </div>
          <div className="export-card">
            <div className="export-toolbar">
              <div className="tabs">
                {(["v4", "v3", "css"] as const).map((f) => (
                  <button type="button" key={f} className={format === f ? "tab active" : "tab"} aria-pressed={format === f} onClick={() => setFormat(f)}>
                    {f === "v4" ? "Tailwind v4" : f === "v3" ? "Tailwind v3" : "CSS"}
                  </button>
                ))}
              </div>
              <button type="button" className="copy-code" onClick={() => copy(code, "code")}>
                {copied === "code" ? <Check size={15} /> : <Copy size={15} />}{" "}
                {copied === "code" ? "Copied" : "Copy code"}
              </button>
            </div>
            <pre className="code-block">
              <code>{code}</code>
            </pre>
          </div>
        </section>

        <section className="preview-section">
          <div className="section-heading">
            <div>
              <span className="step-label">05</span>
              <h2>{ko ? "실제 화면에서 미리보기" : "Preview in context"}</h2>
            </div>
            <span className="subtle">{ko ? "디자인 시스템의 마법을 경험하세요" : "A little design-system magic"}</span>
          </div>
          <div className="preview-button-color-control">
            <div className="preview-button-color-heading">
              <strong>{ko ? "버튼 컬러" : "Button color"}</strong>
              <span>{ko ? "생성한 팔레트에서 컬러를 선택해 미리보기 버튼에 적용하세요." : "Choose a shade from your generated palette to apply to the preview button."}</span>
            </div>
            <div className="preview-button-shades" role="group" aria-label={ko ? "미리보기 버튼 컬러" : "Preview button color"}>
              {palette.map((shade) => (
                <button
                  key={shade.step}
                  type="button"
                  className={previewButtonShade.step === shade.step ? "preview-button-shade active" : "preview-button-shade"}
                  aria-label={`Use shade ${shade.step}, ${shade.hex} for the preview button`}
                  aria-pressed={previewButtonShade.step === shade.step}
                  title={`${shade.step} · ${shade.hex}`}
                  onClick={() => setPreviewButtonStep(shade.step)}
                >
                  <span style={{ background: shade.hex }} />
                  <b>{shade.step}</b>
                </button>
              ))}
            </div>
          </div>
          <div className="preview-card">
            <div className="preview-top">
              <div>
                <span className="preview-dot" style={{ background: (palette.find((shade) => shade.isAnchor) ?? palette[5]).hex }} />
                <b>{ko ? "컴포넌트 예시" : "Example component"}</b>
              </div>
              <span className="preview-tag">{ko ? "실시간 미리보기" : "LIVE PREVIEW"}</span>
            </div>
            <div className="preview-content">
              <div>
                <span className="preview-kicker">{ko ? "다시 오신 것을 환영합니다" : "WELCOME BACK"}</span>
                <h3>{ko ? "확신을 가지고 디자인하세요." : "Design with confidence."}</h3>
                <p>{ko ? "실제 인터페이스 요소에 팔레트를 적용했습니다." : "Your palette, applied to real interface elements."}</p>
              </div>
              <button
                className="preview-cta"
                style={{
                  background: previewButtonShade.hex,
                  color: previewButtonShade.text,
                }}
              >
                {ko ? "시작하기" : "Get started"} <span>→</span>
              </button>
            </div>
            <div className="preview-bottom">
              <span>
                <i style={{ background: palette[2].hex }} /> {ko ? "접근성을 고려한 컬러 토큰" : "Accessible color tokens"}
              </span>
              <span>
                <i style={{ background: palette[7].hex }} /> {ko ? "일관된 UI 경험" : "Consistent across your UI"}
              </span>
            </div>
          </div>
        </section>

        <footer>
          <a className="brand footer-brand" href="#">
            <span className="brand-mark">
              <Palette size={16} />
            </span>
            MyAwesomeTheme
          </a>
          <span>{ko ? "컬러를 중요하게 생각하는 사람들을 위해." : "Made for people who care about color."}</span>
          <nav className="footer-links" aria-label="Footer navigation">
            <a href="/about">{ko ? "소개" : "About"}</a>
            <a href="/privacy">{ko ? "개인정보" : "Privacy"}</a>
          </nav>
          <span>© {new Date().getFullYear()} MyAwesomeTheme</span>
        </footer>
      </div>
    </main>
  );
}
