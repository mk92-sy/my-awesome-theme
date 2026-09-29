"use client";

import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import type { Shade } from "@/lib/color-utils";

function luminance(hex: string) {
  const rgb = hex.replace("#", "").match(/.{2}/g)!.map((v) => parseInt(v, 16) / 255);
  const linear = rgb.map((v) => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}
function contrast(a: string, b: string) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
function Status({ pass, children }: { pass: boolean; children: React.ReactNode }) {
  return <span className={pass ? "contrast-status pass" : "contrast-status fail"}>{pass ? <Check size={13} /> : <X size={13} />}{children}</span>;
}

export default function ContrastChecker({ palette, locale = "ko" }: { palette: Shade[]; locale?: "ko" | "en" }) {
  const ko = locale === "ko";
  const [textSize, setTextSize] = useState<"normal" | "large">("normal");
  const [textColorMode, setTextColorMode] = useState<"best" | "black" | "white" | "custom">("best");
  const [customHex, setCustomHex] = useState("#FFFFFF");
  const normalizedCustomHex = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(customHex)
    ? "#" + (customHex.replace("#", "").length === 3
        ? customHex.replace("#", "").split("").map((char) => char + char).join("")
        : customHex.replace("#", "")).toUpperCase()
    : null;
  const results = useMemo(() => palette.map((shade) => {
    const white = contrast(shade.hex, "#FFFFFF");
    const black = contrast(shade.hex, "#000000");
    const best = white >= black ? "#FFFFFF" : "#000000";
    const textColor = textColorMode === "black" ? "#000000"
      : textColorMode === "white" ? "#FFFFFF"
      : textColorMode === "custom" ? normalizedCustomHex ?? best
      : best;
    return { ...shade, best, textColor, ratio: contrast(shade.hex, textColor) };
  }), [palette, textColorMode, normalizedCustomHex]);
  const aa = textSize === "normal" ? 4.5 : 3;
  const aaa = textSize === "normal" ? 7 : 4.5;

  return (
    <section className="workspace contrast-section">
      <div className="section-heading">
        <div><span className="step-label">03</span><h2>{ko ? "접근성·명도 대비 검사" : "Accessibility & contrast checker"}</h2></div>
        <span className="subtle">{ko ? "WCAG 2.2 · 명도 대비율" : "WCAG 2.2 · Contrast ratio"}</span>
      </div>
      <div className="contrast-card">
        <div className="contrast-toolbar">
          <div className="contrast-controls">
            <div className="contrast-control-heading">
              <strong>{ko ? "텍스트 크기" : "Text size"}</strong>
              <span>{ko ? "검사할 텍스트 크기를 선택하세요" : "Choose the text size to check"}</span>
            </div>
            <div className="contrast-size-tabs" role="group" aria-label="Text size">
              <button type="button" aria-pressed={textSize === "normal"} className={textSize === "normal" ? "contrast-size-tab active" : "contrast-size-tab"} onClick={() => setTextSize("normal")}>{ko ? "일반 텍스트" : "Normal text"}</button>
              <button type="button" aria-pressed={textSize === "large"} className={textSize === "large" ? "contrast-size-tab active" : "contrast-size-tab"} onClick={() => setTextSize("large")}>{ko ? "큰 텍스트" : "Large text"}</button>
            </div>
          </div>
          <div className="contrast-threshold">AA <b>{aa}:1</b><span /> AAA <b>{aaa}:1</b></div>
        </div>
        <div className="contrast-color-controls">
          <div className="contrast-color-heading">
            <strong>{ko ? "텍스트 컬러" : "Text color"}</strong>
            <span>{ko ? "팔레트의 각 컬러와 비교할 전경색을 선택하세요." : "Choose the foreground color to test against every palette shade."}</span>
          </div>
          <div className="contrast-color-options" role="group" aria-label={ko ? "텍스트 컬러 모드" : "Text color mode"}>
            {([
              ["best", ko ? "최고 대비" : "Best contrast"],
              ["black", ko ? "검정" : "Black"],
              ["white", ko ? "흰색" : "White"],
              ["custom", ko ? "사용자 지정 HEX" : "Custom HEX"],
            ] as const).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                className={textColorMode === mode ? "contrast-color-option active" : "contrast-color-option"}
                aria-pressed={textColorMode === mode}
                onClick={() => setTextColorMode(mode)}
              >
                {mode === "black" && <i className="color-choice-dot black" />}
                {mode === "white" && <i className="color-choice-dot white" />}
                {label}
              </button>
            ))}
          </div>
          {textColorMode === "custom" && (
            <div className="contrast-custom-input">
              <label htmlFor="contrast-custom-hex">{ko ? "사용자 지정 텍스트 HEX" : "Custom text HEX"}</label>
              <div className="contrast-hex-entry">
                <input
                  type="color"
                  aria-label="Pick custom text color"
                  value={normalizedCustomHex ?? "#FFFFFF"}
                  onChange={(event) => setCustomHex(event.target.value.toUpperCase())}
                />
                <input
                  id="contrast-custom-hex"
                  type="text"
                  value={customHex}
                  placeholder="#FFFFFF"
                  aria-invalid={!normalizedCustomHex}
                  onChange={(event) => setCustomHex(event.target.value)}
                  spellCheck={false}
                />
              </div>
              {!normalizedCustomHex && <span className="contrast-input-error">{ko ? "올바른 3자리 또는 6자리 HEX 컬러를 입력하세요." : "Enter a valid 3- or 6-digit HEX color."}</span>}
            </div>
          )}
        </div>
        <div className="contrast-list">
          {results.map((shade) => (
            <div className="contrast-row" key={shade.step}>
              <span className="contrast-swatch" style={{ background: shade.hex }} />
              <div className="contrast-shade"><b>{shade.step}</b><span>{shade.hex}</span></div>
              <div className={textSize === "large" ? "contrast-preview large-text" : "contrast-preview normal-text"} style={{ background: shade.hex, color: shade.textColor }}>
                <b>Aa</b><span>{ko ? `${shade.textColor} 텍스트` : `${shade.textColor} text`}</span>
              </div>
              <div className="contrast-ratio"><b>{shade.ratio.toFixed(2)}:1</b><span>{textColorMode === "best" ? (ko ? "최고 대비" : "Best contrast") : (ko ? "텍스트 대비" : "Text contrast")}</span></div>
              <div className="contrast-badges">
                <Status pass={shade.ratio >= aa}>AA</Status>
                <Status pass={shade.ratio >= aaa}>AAA</Status>
              </div>
            </div>
          ))}
        </div>
        <p className="contrast-note">{ko ? "각 팔레트 컬러와 선택한 텍스트 컬러의 명도 대비율을 계산합니다. ‘최고 대비’는 각 컬러마다 검정 또는 흰색을 자동 선택하며, 검정·흰색·사용자 지정 HEX는 모든 행에 동일한 전경색을 적용합니다. WCAG 결과는 선택한 텍스트 크기를 기준으로 하며 실제 UI 조합에서도 확인하세요." : "Contrast ratios are calculated using the selected text color against each palette shade. “Best contrast” automatically chooses black or white per shade; Black, White, and Custom HEX apply the selected foreground color to all rows. WCAG results apply to the selected text size; always verify actual interface combinations."}</p>
      </div>
    </section>
  );
}
