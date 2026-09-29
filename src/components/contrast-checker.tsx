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

export default function ContrastChecker({ palette }: { palette: Shade[] }) {
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
        <div><span className="step-label">05</span><h2>Accessibility checker</h2></div>
        <span className="subtle">WCAG 2.2 · Contrast ratio</span>
      </div>
      <div className="contrast-card">
        <div className="contrast-toolbar">
          <div className="contrast-controls">
            <div className="contrast-control-heading">
              <strong>Text size</strong>
              <span>Choose the text size to check</span>
            </div>
            <div className="contrast-size-tabs" role="group" aria-label="Text size">
              <button type="button" aria-pressed={textSize === "normal"} className={textSize === "normal" ? "contrast-size-tab active" : "contrast-size-tab"} onClick={() => setTextSize("normal")}>Normal text</button>
              <button type="button" aria-pressed={textSize === "large"} className={textSize === "large" ? "contrast-size-tab active" : "contrast-size-tab"} onClick={() => setTextSize("large")}>Large text</button>
            </div>
          </div>
          <div className="contrast-threshold">AA <b>{aa}:1</b><span /> AAA <b>{aaa}:1</b></div>
        </div>
        <div className="contrast-list">
          {results.map((shade) => (
            <div className="contrast-row" key={shade.step}>
              <span className="contrast-swatch" style={{ background: shade.hex }} />
              <div className="contrast-shade"><b>{shade.step}</b><span>{shade.hex}</span></div>
              <div className={textSize === "large" ? "contrast-preview large-text" : "contrast-preview normal-text"} style={{ background: shade.hex, color: shade.textColor }}>
                <b>Aa</b><span>{shade.textColor} text</span>
              </div>
              <div className="contrast-ratio"><b>{shade.ratio.toFixed(2)}:1</b><span>Best contrast</span></div>
              <div className="contrast-badges">
                <Status pass={shade.ratio >= aa}>AA</Status>
                <Status pass={shade.ratio >= aaa}>AAA</Status>
              </div>
            </div>
          ))}
        </div>
        <p className="contrast-note">Contrast ratios are calculated using the selected text color against each palette shade. “Best contrast” automatically chooses black or white per shade. WCAG results apply to the selected text size; always verify actual interface combinations.</p>
      </div>
    </section>
  );
}
