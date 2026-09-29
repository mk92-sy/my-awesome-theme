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
  const results = useMemo(() => palette.map((shade) => {
    const white = contrast(shade.hex, "#FFFFFF");
    const black = contrast(shade.hex, "#000000");
    return { ...shade, white, black, best: white >= black ? "#FFFFFF" : "#000000", ratio: Math.max(white, black) };
  }), [palette]);
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
          <p className="contrast-threshold">AA <b>{aa}:1</b><span /> AAA <b>{aaa}:1</b></p>
        </div>
        <div className="contrast-list">
          {results.map((shade) => (
            <div className="contrast-row" key={shade.step}>
              <span className="contrast-swatch" style={{ background: shade.hex }} />
              <div className="contrast-shade"><b>{shade.step}</b><span>{shade.hex}</span></div>
              <div className={textSize === "large" ? "contrast-preview large-text" : "contrast-preview normal-text"} style={{ background: shade.hex, color: shade.best }}>
                <b>Aa</b><span>{shade.best === "#FFFFFF" ? "White" : "Black"} text</span>
              </div>
              <div className="contrast-ratio"><b>{shade.ratio.toFixed(2)}:1</b><span>Best contrast</span></div>
              <div className="contrast-badges">
                <Status pass={shade.ratio >= aa}>AA</Status>
                <Status pass={shade.ratio >= aaa}>AAA</Status>
              </div>
            </div>
          ))}
        </div>
        <p className="contrast-note">Ratios are calculated against the higher-contrast of pure white and black. WCAG results shown here apply to that text color and the selected text size; always verify actual interface combinations.</p>
      </div>
    </section>
  );
}
