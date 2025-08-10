// src/system/responsive.ts
// LibDev UI – Custom React UI components

import { css } from "@emotion/react";
import type {
  BreakpointKey,
  Responsive,
  Space,
  CSSLength,
} from "../components/common.types";

/** Default px за breakpoints, ако theme не предоставя */
export const DEFAULT_BREAKPOINTS: Record<BreakpointKey, number> = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

export type ThemeLike = {
  /** Опционална spacing скала: 1 -> 8 => 8px и т.н. */
  spacing?: (n: number) => number;
  breakpoints?: {
    /** Картата с px стойности за ключовете */
    values?: Partial<Record<BreakpointKey, number>>;
    /** Функция за генериране на media query, ако е налична */
    up?: (key: BreakpointKey) => string; // напр. "@media (min-width:600px)"
  };
};

/** Връща @media (min-width:...) за даден breakpoint */
export function getMediaQuery(theme: ThemeLike | undefined, key: BreakpointKey): string {
  if (theme?.breakpoints?.up) return theme.breakpoints.up(key);
  const px = theme?.breakpoints?.values?.[key] ?? DEFAULT_BREAKPOINTS[key];
  return `@media (min-width:${px}px)`;
}

/** number -> px, string -> директно */
export function toCssLength(v: CSSLength): string {
  return typeof v === "number" ? `${v}px` : v;
}

/** Преобразува Space към валидна CSS стойност, уважавайки theme.spacing ако има */
export function toSpace(theme: ThemeLike | undefined, v: Space): string {
  if (typeof v === "number") {
    // Ако има spacing скала – използвай я (пример: 1 => 8px)
    if (theme?.spacing) return `${theme.spacing(v)}px`;
    // Иначе числото е директен px размер
    return `${v}px`;
  }
  // string: %, rem, var(...), calc(...), и др.
  return v;
}

/**
 * Генерира responsive CSS за даден prop.
 * Пример:
 *   buildResponsiveStyle(direction, v => css`flex-direction:${v};`, theme)
 */
export function buildResponsiveStyle<T>(
  value: Responsive<T> | undefined,
  toCss: (v: T) => ReturnType<typeof css>,
  theme?: ThemeLike
) {
  if (value == null) return null;

  // Единична стойност (не-обект)
  if (typeof value !== "object" || Array.isArray(value)) {
    return toCss(value as T);
  }

  // Обект по breakpoint: { xs?: T, sm?: T, md?: T, lg?: T, xl?: T }
  const parts: Array<ReturnType<typeof css>> = [];
  (["xs", "sm", "md", "lg", "xl"] as BreakpointKey[]).forEach((bp) => {
    const v = (value as Partial<Record<BreakpointKey, T>>)[bp];
    if (v == null) return;
    const mq = getMediaQuery(theme, bp);
    parts.push(css`
      ${mq} {
        ${toCss(v)}
      }
    `);
  });
  return parts;
}

/** Удобни шорткъти, когато искаме само конверсии */
export const buildSpace = (theme: ThemeLike | undefined, v: Space) => toSpace(theme, v);
export const buildLen = (v: CSSLength) => toCssLength(v);
