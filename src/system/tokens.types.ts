// src/system/tokens.types.ts

/** Semantic roles we recognize at design-system level */
export type ColorRole =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "neutral"
  | "background"
  | "text"
  | "border"
  | "surface";

/** Common states/variants we autocomplete for dot-tokens */
export type ColorStateStrict =
  | "default"
  | "hover"
  | "active"
  | "disabled"
  | "muted"
  | "contrast"
  | "level0"
  | "level1"
  | "level2"
  // component-like variants that appear in real usage:
  | "outlinedBorder"
  | "solid"
  | "solidBg"
  | "soft"
  | "softBg"
  | "plain"
  | "plainColor";

/** Strict tokens with autocomplete (dot-variant) */
export type LDColorTokenStrict = `${ColorRole}` | `${ColorRole}.${ColorStateStrict}`;

/** Allow any custom dot-suffix if needed (future-proof) */
export type LDColorTokenLoose = `${ColorRole}.${string}`;

/** Requested kebab-case aliases (explicit only; keeps the surface small) */
export type LDAliasColorToken =
  | "background"
  | "background-level1"
  | "background-level2"
  | "text"
  | "text-secondary";

/** Public color token type used by the engine */
export type LDColorToken = LDColorTokenStrict | LDColorTokenLoose | LDAliasColorToken;

/** Radii & shadows we ship */
export type LDRadiusToken = "sm" | "md" | "lg" | "xl" | "2xl" | "pill" | "circle";
export type LDShadowToken = "xs" | "sm" | "md" | "lg" | "xl";

/** Helper, if you need it outside sl() */
export const cssVarForColor = (t: LDColorToken) =>
  // Работи и за dot-токени (text.secondary → --ld-color-text-secondary),
  // и за alias-токени (background-level1 → --ld-color-background-level1).
  `var(--ld-color-${String(t).replace(/\./g, "-")})`;
