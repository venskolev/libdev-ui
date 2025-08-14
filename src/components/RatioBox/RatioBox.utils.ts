// src/components/Media/RatioBox/RatioBox.utils.ts
// LibDev UI – Custom React UI components

import type { RatioValue } from "./RatioBox.types";

/** Парсва ratio до { w, h, ratio, percent } */
export function parseRatio(value?: RatioValue): {
  w: number;
  h: number;
  ratio: number;   // w/h
  percent: number; // h/w * 100 (%)
} {
  // дефолт 16/9
  const defW = 16, defH = 9;

  if (value == null) {
    const r = defW / defH;
    return { w: defW, h: defH, ratio: r, percent: (1 / r) * 100 };
  }

  if (typeof value === "number" && isFinite(value) && value > 0) {
    const r = value;
    return { w: r, h: 1, ratio: r, percent: (1 / r) * 100 };
  }

  const s = String(value).trim();
  const m = s.match(/^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/);
  if (m) {
    const w = parseFloat(m[1]);
    const h = parseFloat(m[2]);
    if (w > 0 && h > 0) {
      const r = w / h;
      return { w, h, ratio: r, percent: (1 / r) * 100 };
    }
  }

  // опитай като plain число "1.5"
  const n = parseFloat(s);
  if (!Number.isNaN(n) && n > 0) {
    const r = n;
    return { w: r, h: 1, ratio: r, percent: (1 / r) * 100 };
  }

  // fallback към дефолта
  const r = defW / defH;
  return { w: defW, h: defH, ratio: r, percent: (1 / r) * 100 };
}
