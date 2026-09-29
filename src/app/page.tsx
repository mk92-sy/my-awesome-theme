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
    <main className={dark ? "min-h-screen bg-slate-950 text-slate-100" : "min-h-screen bg-slate-50 text-slate-900"}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SiteHeader dark={dark} onToggleTheme={() => setDark((current) => !current)} />

        <section className="py-16 text-center sm:py-24">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-lime-200 bg-lime-50 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-lime-800 dark:border-lime-900 dark:bg-lime-950 dark:text-lime-300">
            <WandSparkles size={13} /> {ko ? "컬러 시스템 생성기" : "COLOR SYSTEM GENERATOR"}
          </div>
          <h1>
            {ko ? <>나만의 컬러 시스템을<span>.</span></> : <>Build your color system<span>.</span></>}
          </h1>
          <p>{ko ? "하나의 컬러로 완성하는 디자인 시스템." : "One color. A complete design system."}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-600 dark:text-slate-400" aria-label={ko ? "주요 기능" : "What you can do"}>
            <span><i /> {ko ? "50–950 컬러 스케일" : "50–950 color scale"}</span>
            <span><i /> {ko ? "WCAG 명도 대비 검사" : "WCAG contrast checks"}</span>
            <span><i /> {ko ? "Tailwind 및 CSS 내보내기" : "Tailwind & CSS exports"}</span>
          </div>
        </section>

        <section className="my-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-lime-600">01</span>
              <h2>{ko ? "컬러 선택" : "Choose your color"}</h2>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">{ko ? "원하는 컬러에서 시작하세요" : "Start with any color"}</span>
          </div>
          <div className="flex flex-col items-stretch justify-between gap-5 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center dark:bg-slate-800">
            <div className="flex min-w-0 items-center gap-4">
              <label className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200" aria-label={ko ? "기준 컬러 선택" : "Choose base color"}>
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
              <div className="flex min-w-0 flex-col gap-1 text-xs font-semibold text-slate-500">
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
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-600 px-5 py-3 font-semibold text-white transition hover:bg-lime-700 disabled:cursor-not-allowed disabled:opacity-50" onClick={generate} disabled={!isValidHex(input)} aria-label={ko ? "입력한 HEX 컬러로 팔레트 생성" : "Generate a palette from the entered HEX color"}>
              {ko ? "팔레트 생성" : "Generate palette"} <WandSparkles size={16} />
            </button>
          </div>
        </section>

        <section className="workspace palette-section">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-lime-600">02</span>
              <h2>{ko ? "컬러 팔레트" : "Your palette"}</h2>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-lime-700 transition hover:bg-lime-50 dark:text-lime-300 dark:hover:bg-slate-800"
              onClick={() => copy(palette.map((s) => `${s.step}  ${s.hex}`).join("\n"), "all")}
            >
              {copied === "all" ? <Check size={15} /> : <Copy size={15} />} {ko ? "전체 복사" : "Copy all"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10">
            {palette.map((shade: Shade) => (
              <button
                type="button"
                key={shade.step}
                className="group min-w-0 overflow-hidden rounded-xl border border-slate-200 text-left transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700"
                onClick={() => copy(shade.hex, String(shade.step))}
                title={`Copy ${shade.hex}`}
              >
                <span className="flex h-20 items-center justify-center" style={{ background: shade.hex, color: shade.text }}>
                  {copied === String(shade.step) ? <Check size={17} /> : <Copy size={15} />}
                </span>
                <span className="flex flex-col gap-1 p-3 text-xs">
                  <b>{shade.step}{shade.isAnchor ? (ko ? " · 선택됨" : " · Selected") : ""}</b>
                  <span>{shade.hex}</span>
                </span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">{ko ? "선택한 컬러와 가장 가까운 단계에 자동으로 배치하고 ‘선택됨’으로 표시합니다. 컬러를 클릭하면 HEX 값이 복사됩니다." : "Your selected color is automatically placed at the closest shade level and marked “Selected”. Click any shade to copy its HEX value."}</p>
        </section>

        <section id="contrast-checker" className="my-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900"><ContrastChecker palette={palette} locale={locale} /></section>

        <section className="workspace export-section" id="export">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-lime-600">04</span>
              <h2>{ko ? "컬러 내보내기" : "Export your colors"}</h2>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">{ko ? "프로젝트에 바로 적용하세요" : "Ready for your project"}</span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-3 dark:border-slate-700">
              <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                {(["v4", "v3", "css"] as const).map((f) => (
                  <button type="button" key={f} className={format === f ? "rounded-lg bg-white px-3 py-2 text-sm font-semibold text-lime-700 shadow-sm dark:bg-slate-700 dark:text-lime-300" : "rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-950 dark:text-slate-300"} aria-pressed={format === f} onClick={() => setFormat(f)}>
                    {f === "v4" ? "Tailwind v4" : f === "v3" ? "Tailwind v3" : "CSS"}
                  </button>
                ))}
              </div>
              <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-lime-600 dark:hover:bg-lime-500" onClick={() => copy(code, "code")}>
                {copied === "code" ? <Check size={15} /> : <Copy size={15} />}{" "}
                {copied === "code" ? "Copied" : "Copy code"}
              </button>
            </div>
            <pre className="max-h-96 overflow-auto bg-slate-950 p-5 text-sm leading-6 text-lime-200">
              <code>{code}</code>
            </pre>
          </div>
        </section>

        <section className="my-10 rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-lime-600">05</span>
              <h2>{ko ? "실제 화면에서 미리보기" : "Preview in context"}</h2>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">{ko ? "디자인 시스템의 마법을 경험하세요" : "A little design-system magic"}</span>
          </div>
          <div className="mb-6 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <div className="mb-4 flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
              <strong>{ko ? "버튼 컬러" : "Button color"}</strong>
              <span>{ko ? "생성한 팔레트에서 컬러를 선택해 미리보기 버튼에 적용하세요." : "Choose a shade from your generated palette to apply to the preview button."}</span>
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label={ko ? "미리보기 버튼 컬러" : "Preview button color"}>
              {palette.map((shade) => (
                <button
                  key={shade.step}
                  type="button"
                  className={previewButtonShade.step === shade.step ? "flex flex-col items-center gap-1 rounded-lg border-2 border-lime-600 p-2 text-xs ring-2 ring-lime-200 dark:border-lime-400 dark:ring-lime-900" : "flex flex-col items-center gap-1 rounded-lg border border-slate-200 p-2 text-xs dark:border-slate-700"}
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
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <div>
                <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: (palette.find((shade) => shade.isAnchor) ?? palette[5]).hex }} />
                <b>{ko ? "컴포넌트 예시" : "Example component"}</b>
              </div>
              <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-semibold text-lime-800 dark:bg-lime-950 dark:text-lime-300">{ko ? "실시간 미리보기" : "LIVE PREVIEW"}</span>
            </div>
            <div className="flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
              <div>
                <span className="text-xs font-bold tracking-widest text-slate-400">{ko ? "다시 오신 것을 환영합니다" : "WELCOME BACK"}</span>
                <h3>{ko ? "확신을 가지고 디자인하세요." : "Design with confidence."}</h3>
                <p>{ko ? "실제 인터페이스 요소에 팔레트를 적용했습니다." : "Your palette, applied to real interface elements."}</p>
              </div>
              <button
                className="inline-flex shrink-0 items-center gap-3 rounded-xl px-5 py-3 font-semibold shadow-sm transition hover:brightness-95"
                style={{
                  background: previewButtonShade.hex,
                  color: previewButtonShade.text,
                }}
              >
                {ko ? "시작하기" : "Get started"} <span>→</span>
              </button>
            </div>
            <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:justify-between dark:border-slate-700 dark:text-slate-400">
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
          <a className="inline-flex items-center gap-2 font-semibold text-slate-900 dark:text-white" href="#">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-lime-100 text-lime-700 dark:bg-lime-950 dark:text-lime-300">
              <Palette size={16} />
            </span>
            MyAwesomeTheme
          </a>
          <span>{ko ? "컬러를 중요하게 생각하는 사람들을 위해." : "Made for people who care about color."}</span>
          <nav className="flex items-center gap-4" aria-label="Footer navigation">
            <a href="/about">{ko ? "소개" : "About"}</a>
            <a href="/privacy">{ko ? "개인정보" : "Privacy"}</a>
          </nav>
          <span>© {new Date().getFullYear()} MyAwesomeTheme</span>
        </footer>
      </div>
    </main>
  );
}
