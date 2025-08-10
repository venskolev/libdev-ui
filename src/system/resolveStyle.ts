// src/system/resolveStyle.ts

import type { CSSProperties } from "react";

/* ------------------------------------------------------------
 * Превежда семантични стойности (напр. "xl", "background-level1")
 * към CSS променливи от :root (напр. var(--ld-radius-xl)).
 * Поддържа и директни стойности (#111, 12px, var(...)).
 * ---------------------------------------------------------- */

export type StyleLike = {
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;

  // spacing шорткъти
  p?: number | string; // padding
  m?: number | string; // margin

  // цветове
  bgcolor?: string;
  color?: string;

  // радиус
  borderRadius?: number | string;

  // произволни CSS свойства (ще ги прелеем 1:1)
  [key: string]: any;
};

const isCssVarCall = (v: string) => v.trim().startsWith("var(");
const isCustomProp = (v: string) => v.trim().startsWith("--");
const isLengthString = (v: string) =>
  /^-?\d+(\.\d+)?(px|rem|em|vh|vw|%)$/.test(v.trim());
const toPx = (v: number) => `${v}px`;

// списък от ключови думи за цвят – НЕ ги увиваме във var()
const CSS_COLOR_KEYWORDS = new Set([
  "black","silver","gray","white","maroon","red","purple","fuchsia","green","lime",
  "olive","yellow","navy","blue","teal","aqua","orange","transparent","currentcolor",
  "inherit","initial","revert","unset","aliceblue","antiquewhite"
]);

function resolveLength(v: number | string | undefined): string | undefined {
  if (v == null) return undefined;
  if (typeof v === "number") return toPx(v);
  const s = v.trim();
  if (isCssVarCall(s) || isCustomProp(s) || isLengthString(s)) return s;
  // оставяме calc(...) и пр.
  return s;
}

function resolveRadius(v: number | string | undefined): string | undefined {
  if (v == null) return undefined;
  if (typeof v === "number") return toPx(v);
  const s = v.trim();
  // ако е var(--...), --custom или абсолютна дължина → остави
  if (isCssVarCall(s) || isCustomProp(s) || isLengthString(s)) return s;
  // семантичен токен ("sm" | "md" | "lg" | "xl" | ...)
  return `var(--ld-radius-${s})`;
}

function resolveColor(v: string | undefined): string | undefined {
  if (!v) return undefined;
  const s = v.trim();

  // директни стойности → оставяме
  if (
    isCssVarCall(s) ||
    isCustomProp(s) ||
    s.startsWith("#") ||
    s.startsWith("rgb") ||
    s.startsWith("hsl") ||
    CSS_COLOR_KEYWORDS.has(s.toLowerCase())
  ) {
    return s;
  }

  // семантичен/алиас или dot-токен ("background-level1", "text-secondary", "primary.hover")
  const token = s.replace(/\./g, "-");
  return `var(--ld-color-${token})`;
}

export function compileStyle(sl?: StyleLike): CSSProperties | undefined {
  if (!sl) return undefined;

  const {
    p,
    m,
    bgcolor,
    borderRadius,
    color,
    ...rest
  } = sl;

  const style: Record<string, any> = { ...rest };

  // width/height полета (ако са числа → px)
  for (const key of [
    "width",
    "height",
    "minWidth",
    "maxWidth",
    "minHeight",
    "maxHeight",
  ] as const) {
    if (sl[key] != null) style[key] = resolveLength(sl[key] as any);
  }

  // spacing шорткъти
  if (p != null) style.padding = typeof p === "number" ? toPx(p) : p;
  if (m != null) style.margin = typeof m === "number" ? toPx(m) : m;

  // цветове
  if (bgcolor != null) style.backgroundColor = resolveColor(bgcolor);
  if (color != null) style.color = resolveColor(color);

  // радиус
  if (borderRadius != null) style.borderRadius = resolveRadius(borderRadius);

  return style as CSSProperties;
}
