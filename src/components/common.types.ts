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
 * - нашите токени ("sm" | "md" | "lg" | "xl" | "2xl" | "pill" | "circle")
 * - или custom CSS стойност ("12px", "50%")
 */
export type Radius = LDRadiusToken | (string & {});

/** Ако ти трябва и за пропове някъде */
export type Shadow = LDShadowToken | (string & {});
