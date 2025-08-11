// src/components/Typography/Typography.utils.ts
// LibDev UI – Custom React UI components

import { css } from "@emotion/react";
import type { CSSProperties } from "react";
import type {
  LevelMapping,
  TextLevel,
  TextVariant,
  TypographyOwnProps,
} from "./Typography.types";
import { cssVarForColor } from "../../system/tokens.types";

/* -------------------------------------------------------------
 * Общи помощни константи и функции за Typography
 * Държим всичко без хардкоднати цветове – сочим към CSS променливи.
 * ----------------------------------------------------------- */

/** Базов mapping ниво → HTML елемент (може да се допише/override-не) */
export const DEFAULT_LEVEL_MAPPING: Required<LevelMapping> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  "title-lg": "p",
  "title-md": "p",
  "title-sm": "p",
  "body-lg": "p",
  "body-md": "p",
  "body-sm": "p",
  "body-xs": "span",
  inherit: "p",
};

/** Базови стилове по нива – размер, междуредие и тежест */
export const LEVEL_STYLES: Record<string, CSSProperties> = {
  h1: { fontSize: "3rem", lineHeight: 1.2, fontWeight: 700 },
  h2: { fontSize: "2.25rem", lineHeight: 1.25, fontWeight: 700 },
  h3: { fontSize: "1.875rem", lineHeight: 1.3, fontWeight: 600 },
  h4: { fontSize: "1.5rem", lineHeight: 1.35, fontWeight: 600 },
  "title-lg": { fontSize: "1.25rem", lineHeight: 1.4, fontWeight: 600 },
  "title-md": { fontSize: "1.125rem", lineHeight: 1.45, fontWeight: 600 },
  "title-sm": { fontSize: "1rem", lineHeight: 1.5, fontWeight: 600 },
  "body-lg": { fontSize: "1rem", lineHeight: 1.6, fontWeight: 400 },
  "body-md": { fontSize: "0.9375rem", lineHeight: 1.6, fontWeight: 400 },
  "body-sm": { fontSize: "0.875rem", lineHeight: 1.5, fontWeight: 400 },
  "body-xs": { fontSize: "0.75rem", lineHeight: 1.45, fontWeight: 400 },
  inherit: {},
};

/** Връща CSS за конкретно ниво (fallback към body-md) */
export const getLevelCSS = (level?: string) => {
  const lv = (level && LEVEL_STYLES[level]) || LEVEL_STYLES["body-md"];
  return css`
    font-size: ${lv.fontSize ?? "inherit"};
    line-height: ${lv.lineHeight ?? "inherit"};
    font-weight: ${lv.fontWeight ?? "inherit"};
  `;
};

/** Преобразува текстова тежест към числова, ако е нужно */
export const toNumericWeight = (w?: TypographyOwnProps["weight"]) => {
  if (typeof w === "number") return w;
  switch (w) {
    case "light":
      return 300;
    case "regular":
      return 400;
    case "medium":
      return 500;
    case "bold":
      return 700;
    default:
      return undefined;
  }
};

/** Изчислява крайния текстов цвят – direct override > LD token > inherit */
export const getTextColorValue = (
  color?: TypographyOwnProps["color"],
  textColor?: string
) => {
  if (textColor) return textColor; 
  if (color) return cssVarForColor(color as any); 
  return undefined; 
};

/** Визуални правила по вариант (plain/soft/solid/outlined) – без hex, само променливи */
export const variantCSS = (variant: TextVariant, baseColor?: string) => {
  const textColor = baseColor ?? "inherit";
  switch (variant) {
    case "soft":
      return css`
        color: ${textColor};
        background-color: color-mix(in srgb, ${textColor} 12%, transparent);
        padding: 0.1em 0.3em;
        border-radius: var(--ld-radius-sm, 4px);
      `;
    case "solid":
      return css`
        color: var(--ld-color-white, #fff);
        background-color: ${textColor};
        padding: 0.1em 0.35em;
        border-radius: var(--ld-radius-sm, 4px);
      `;
    case "outlined":
      return css`
        color: ${textColor};
        border: 1px solid color-mix(in srgb, ${textColor} 60%, transparent);
        padding: 0.05em 0.3em;
        border-radius: var(--ld-radius-sm, 4px);
      `;
    case "plain":
    default:
      return css`
        color: ${textColor};
      `;
  }
};

/** Семантичен елемент според `level` и mapping (с дефолтна таблица) */
export const resolveSemanticTag = (
  level: TextLevel | undefined,
  mapping?: LevelMapping
): React.ElementType => {
  const map = { ...DEFAULT_LEVEL_MAPPING, ...(mapping ?? {}) } as Required<LevelMapping>;
  return (level && map[level]) || "span";
};
