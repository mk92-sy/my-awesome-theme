export type Shade = {
  step: number;
  hex: string;
  text: string;
  isAnchor?: boolean;
};

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

type RGB = {
  r: number;
  g: number;
  b: number;
};

type OKLCH = {
  l: number;
  c: number;
  h: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hexToRgb(hex: string): RGB {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((x) => x + x)
          .join("")
      : clean;

  const value = Number.parseInt(full, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function srgbToLinear(value: number) {
  const v = value / 255;

  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function linearToSrgb(value: number) {
  const v = clamp(value, 0, 1);

  return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
}

function rgbToOklch(rgb: RGB): OKLCH {
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);

  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);

  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;

  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;

  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  return {
    l: L,
    c: Math.sqrt(A * A + B * B),
    h: (Math.atan2(B, A) * 180) / Math.PI,
  };
}

function oklchToLinearRgb(color: OKLCH): RGB {
  const radians = (color.h * Math.PI) / 180;

  const a = color.c * Math.cos(radians);
  const b = color.c * Math.sin(radians);

  const l = color.l + 0.3963377774 * a + 0.2158037573 * b;
  const m = color.l - 0.1055613458 * a - 0.0638541728 * b;
  const s = color.l - 0.0894841775 * a - 1.291485548 * b;

  const L = l * l * l;
  const M = m * m * m;
  const S = s * s * s;

  return {
    r: 4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
    g: -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
    b: -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
  };
}

function isInGamut(rgb: RGB) {
  const epsilon = 1e-7;

  return (
    rgb.r >= -epsilon &&
    rgb.r <= 1 + epsilon &&
    rgb.g >= -epsilon &&
    rgb.g <= 1 + epsilon &&
    rgb.b >= -epsilon &&
    rgb.b <= 1 + epsilon
  );
}

// sRGB 색역을 벗어나면 색상각과 명도는 유지하고
// 채도만 이진 탐색으로 낮춘다.
function gamutMap(color: OKLCH): RGB {
  let result = oklchToLinearRgb(color);

  if (isInGamut(result)) {
    return result;
  }

  let low = 0;
  let high = color.c;

  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2;

    const candidate = oklchToLinearRgb({
      ...color,
      c: mid,
    });

    if (isInGamut(candidate)) {
      low = mid;
      result = candidate;
    } else {
      high = mid;
    }
  }

  return result;
}

function oklchToHex(color: OKLCH): string {
  const rgb = gamutMap(color);

  const channels = [rgb.r, rgb.g, rgb.b].map((value) => {
    const srgb = linearToSrgb(value);
    return Math.round(clamp(srgb, 0, 1) * 255)
      .toString(16)
      .padStart(2, "0");
  });

  return `#${channels.join("")}`.toUpperCase();
}

function relativeLuminance(hex: string) {
  const rgb = hexToRgb(hex);

  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function isValidHex(value: string) {
  return /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
}

export function normalizeHex(value: string) {
  const clean = value.replace("#", "");

  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((x) => x + x)
          .join("")
      : clean;

  return `#${full}`.toUpperCase();
}

export function makePalette(base: string): Shade[] {
  const normalizedBase = normalizeHex(base);
  const original = rgbToOklch(hexToRgb(normalizedBase));

  // 기본 명도 기준표. 입력 색의 OKLCH 명도와 가장 가까운 단계에
  // 앵커를 자동 배치하되, 극단적인 색도 주변 색을 생성할 공간을 둔다.
  const targetLightness = [0.98, 0.94, 0.88, 0.8, 0.7, 0.6, 0.48, 0.4, 0.32, 0.24];
  let anchorIndex = 1;

  for (let i = 1; i < targetLightness.length - 1; i++) {
    if (
      Math.abs(targetLightness[i] - original.l) <
      Math.abs(targetLightness[anchorIndex] - original.l)
    ) {
      anchorIndex = i;
    }
  }

  // 선택색을 앵커로 고정하고, 밝은 쪽/어두운 쪽 목표 명도를
  // 각각 선형 보간해 자연스러운 명도 흐름을 만든다.
  const lightness = targetLightness.map((target, index) => {
    if (index === anchorIndex) return original.l;

    if (index < anchorIndex) {
      const start = targetLightness[0];
      const span = anchorIndex;
      const t = index / span;
      return start + (original.l - start) * t;
    }

    const span = targetLightness.length - 1 - anchorIndex;
    const t = (index - anchorIndex) / span;
    return original.l + (targetLightness[targetLightness.length - 1] - original.l) * t;
  });

  return STEPS.map((step, index) => {
    const chromaScale =
      index < anchorIndex
        ? 0.65 + (index / Math.max(anchorIndex, 1)) * 0.35
        : 1 - ((index - anchorIndex) / Math.max(STEPS.length - 1 - anchorIndex, 1)) * 0.3;

    const hex =
      index === anchorIndex
        ? normalizedBase
        : oklchToHex({
            l: lightness[index],
            c: original.c * chromaScale,
            h: original.h,
          });

    const luminance = relativeLuminance(hex);

    return {
      step,
      hex,
      text: luminance > 0.179 ? "#171717" : "#FFFFFF",
      isAnchor: index === anchorIndex,
    };
  });
}
