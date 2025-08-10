// src/components/common.types.ts
import type {
  LDColorToken,
  LDRadiusToken,
  LDShadowToken,
} from "../system/tokens.types";

export type Size = "sm" | "md" | "lg";
export type Variant = "filled" | "outlined" | "ghost";

/**
 * Public Color prop:
 * - LD token ("primary", "background.level1", "primary.outlinedBorder", ...)
 * - или alias-токен ("background", "background-level1", "background-level2", "text", "text-secondary")
 * - или произволен CSS цвят/var(...)/hex/rgb(...)
 */
export type Color = LDColorToken | (string & {});

/**
 * Public Radius prop:
 * - Токени ("sm" | "md" | "lg" | "xl" | "2xl" | "pill" | "circle")
 * - или custom CSS стойност ("12px", "50%")
 */
export type Radius = LDRadiusToken | (string & {});

/** Пропове */
export type Shadow = LDShadowToken | (string & {});

/* ------------------------------------------------------------------
 * ГЛОБАЛНИ РЕСПОНСИВ ТИПОВЕ (добавени, без да нарушават текущото API)
 * ------------------------------------------------------------------ */

/** Breakpoint ключове, които ще ползваме консистентно в цялата библиотека */
export type BreakpointKey = "xs" | "sm" | "md" | "lg" | "xl";

/** Единична стойност или обект по breakpoint (напр. { xs: "...", md: "..." }) */
export type Responsive<T> = T | Partial<Record<BreakpointKey, T>>;

/** CSS дължина – число (=> px) или произволен string (%, rem, var(...), и т.н.) */
export type CSSLength = number | string;

/** Пространства/размери, които могат да са число (=> px/spacing) или string */
export type Space = CSSLength;

/** Удобен alias, когато очакваме responsive spacing */
export type ResponsiveSpace = Responsive<Space>;

/** Понякога е удобно и responsive boolean */
export type ResponsiveBoolean = Responsive<boolean>;
