"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Moon, Palette, Sun, WandSparkles } from "lucide-react";
import { isValidHex, makePalette, normalizeHex, type Shade } from "@/lib/color-utils";
import ContrastChecker from "@/components/contrast-checker";

export default function Home() {
  const [base, setBase] = useState("#84CC16");
  const [input, setInput] = useState("#84CC16");
  const [format, setFormat] = useState<"v4" | "v3" | "css">("v4");
  const [dark, setDark] = useState(false);
  const [copied, setCopied] = useState("");
  const [previewButtonStep, setPreviewButtonStep] = useState<number>(500);
  const palette = useMemo(() => makePalette(base), [base]);
  const previewButtonShade = palette.find((shade) => shade.step === previewButtonStep) ?? palette[5] ?? palette[0];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const color = params.get("color");

    if (color && isValidHex(color)) {
      const normalized = normalizeHex(color);
      setBase(normalized);
      setInput(normalized);
    }
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
        <header className="topbar">
          <a className="brand" href="#">
            <span className="brand-mark">
              <Palette size={19} />
            </span>
            <span>MyAwesomeTheme</span>
          </a>
          <div className="top-actions">
            <nav className="header-links" aria-label="Main navigation">
              <a href="/about">About</a>
              <a href="/privacy">Privacy</a>
            </nav>
            <button className="icon-button" aria-label="Toggle color theme" onClick={() => setDark(!dark)}>
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <section className="hero">
          <div className="eyebrow">
            <WandSparkles size={13} /> COLOR SYSTEM GENERATOR
          </div>
          <h1>
            Build your color system<span>.</span>
          </h1>
          <p>One color. A complete design system.</p>
          <div className="hero-highlights" aria-label="What you can do">
            <span><i /> 50–950 color scale</span>
            <span><i /> WCAG contrast checks</span>
            <span><i /> Tailwind &amp; CSS exports</span>
          </div>
        </section>

        <section className="workspace">
          <div className="section-heading">
            <div>
              <span className="step-label">01</span>
              <h2>Choose your color</h2>
            </div>
            <span className="subtle">Start with any color</span>
          </div>
          <div className="color-input-card">
            <div className="color-input-left">
              <label className="color-picker-wrap" aria-label="Choose base color">
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
            <button className="primary-button" onClick={generate}>
              Generate palette <WandSparkles size={16} />
            </button>
          </div>
        </section>

        <section className="workspace palette-section">
          <div className="section-heading">
            <div>
              <span className="step-label">02</span>
              <h2>Your palette</h2>
            </div>
            <button
              className="text-button"
              onClick={() => copy(palette.map((s) => `${s.step}  ${s.hex}`).join("\n"), "all")}
            >
              {copied === "all" ? <Check size={15} /> : <Copy size={15} />} Copy all
            </button>
          </div>
          <div className="palette-grid">
            {palette.map((shade: Shade) => (
              <button
                key={shade.step}
                className="swatch"
                onClick={() => copy(shade.hex, String(shade.step))}
                title={`Copy ${shade.hex}`}
              >
                <span className="swatch-color" style={{ background: shade.hex, color: shade.text }}>
                  {copied === String(shade.step) ? <Check size={17} /> : <Copy size={15} />}
                </span>
                <span className="swatch-meta">
                  <b>{shade.step}{shade.isAnchor ? " · Selected" : ""}</b>
                  <span>{shade.hex}</span>
                </span>
              </button>
            ))}
          </div>
          <p className="helper-text">Your selected color is automatically placed at the closest shade level and marked “Selected”. Click any shade to copy its HEX value.</p>
        </section>

        <section id="contrast-checker" className="workspace"><ContrastChecker palette={palette} /></section>

        <section className="workspace export-section" id="export">
          <div className="section-heading">
            <div>
              <span className="step-label">03</span>
              <h2>Export your colors</h2>
            </div>
            <span className="subtle">Ready for your project</span>
          </div>
          <div className="export-card">
            <div className="export-toolbar">
              <div className="tabs">
                {(["v4", "v3", "css"] as const).map((f) => (
                  <button key={f} className={format === f ? "tab active" : "tab"} onClick={() => setFormat(f)}>
                    {f === "v4" ? "Tailwind v4" : f === "v3" ? "Tailwind v3" : "CSS"}
                  </button>
                ))}
              </div>
              <button className="copy-code" onClick={() => copy(code, "code")}>
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
              <span className="step-label">04</span>
              <h2>Preview in context</h2>
            </div>
            <span className="subtle">A little design-system magic</span>
          </div>
          <div className="preview-button-color-control">
            <div className="preview-button-color-heading">
              <strong>Button color</strong>
              <span>Choose a shade from your generated palette to apply to the preview button.</span>
            </div>
            <div className="preview-button-shades" role="group" aria-label="Preview button color">
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
                <b>Example component</b>
              </div>
              <span className="preview-tag">LIVE PREVIEW</span>
            </div>
            <div className="preview-content">
              <div>
                <span className="preview-kicker">WELCOME BACK</span>
                <h3>Design with confidence.</h3>
                <p>Your palette, applied to real interface elements.</p>
              </div>
              <button
                className="preview-cta"
                style={{
                  background: previewButtonShade.hex,
                  color: previewButtonShade.text,
                }}
              >
                Get started <span>→</span>
              </button>
            </div>
            <div className="preview-bottom">
              <span>
                <i style={{ background: palette[2].hex }} /> Accessible color tokens
              </span>
              <span>
                <i style={{ background: palette[7].hex }} /> Consistent across your UI
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
          <span>Made for people who care about color.</span>
          <nav className="footer-links" aria-label="Footer navigation">
            <a href="/about">About</a>
            <a href="/privacy">Privacy</a>
          </nav>
          <span>© {new Date().getFullYear()} MyAwesomeTheme</span>
        </footer>
      </div>
    </main>
  );
}
