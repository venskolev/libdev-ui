// src/components/Container/Card/Card.utils.ts
// LibDev UI – Custom React UI components

import type {
  CardColor,
  CardVariant,
  CardSize,
  Orientation,
  ActionsOrientation,
  CardOwnerState,
  CardShadow,
} from "./Card.types";
import { cardClasses } from "./Card.types";
import {
  cssVarForColor,
  type LDRadiusToken,
  type LDShadowToken,
  type LDColorToken,
} from "../../system/tokens.types";

/* ========================= Color/variant recipes ========================= */

const KNOWN_BASES = new Set([
  "primary","secondary","success","danger","warning","info","background","text","border","surface",
]);
const cap = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
function getPaletteBase(color?: CardColor):
  | "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "background" | "text" | "border" | "surface"
  | null {
  if (!color || color === "neutral") return "secondary";
  const c = String(color);
  return KNOWN_BASES.has(c) ? (c as any) : null;
}
function makeToken(
  base: NonNullable<ReturnType<typeof getPaletteBase>>,
  part: "plainColor" | "softBg" | "solidBg" | "outlinedBorder"
): LDColorToken {
  return `${base}.${part}` as LDColorToken;
}
function isDirectCssColor(v?: string): boolean {
  if (!v) return false;
  const s = v.trim().toLowerCase();
  return s.startsWith("#") || s.startsWith("rgb(") || s.startsWith("hsl(") || s.startsWith("var(") ||
    ["white","black","transparent","currentcolor","inherit","initial","revert","unset",
     "red","green","blue","yellow","orange","purple","navy","teal","aqua","gray","silver","maroon","olive","fuchsia","lime"].includes(s);
}

export function buildVariantRecipe(
  color: CardColor | undefined,
  variant: CardVariant | undefined,
  opts?: { inverted?: boolean }
) {
  const v = variant ?? "outlined";
  const inv = !!opts?.inverted;
  const base = getPaletteBase(color);
  const isCustom = !base;
  const onSolid = "var(--ld-color-white)";

  if (!isCustom) {
    const plainColor = cssVarForColor(makeToken(base, "plainColor"));
    const softBg = cssVarForColor(makeToken(base, "softBg"));
    const solidBg = cssVarForColor(makeToken(base, "solidBg"));
    const outlinedBorder = cssVarForColor(makeToken(base, "outlinedBorder"));

    switch (v) {
      case "plain":
        return { backgroundColor: "transparent", color: plainColor } as const;
      case "soft":
        return { backgroundColor: softBg, color: plainColor } as const;
      case "solid":
        return { backgroundColor: solidBg, color: inv ? plainColor : onSolid } as const;
      case "outlined":
      default:
        return { backgroundColor: "transparent", color: plainColor, border: `1px solid ${outlinedBorder}` } as const;
    }
  }

  // custom color branch
  const raw = String(color ?? "").trim() || "currentColor";
  const asColor = isDirectCssColor(raw) ? raw : raw;

  switch (v) {
    case "plain":    return { backgroundColor: "transparent", color: asColor } as const;
    case "soft":     return { backgroundColor: asColor, color: onSolid } as const;
    case "solid":    return { backgroundColor: asColor, color: onSolid } as const;
    case "outlined":
    default:         return { backgroundColor: "transparent", color: asColor, border: `1px solid ${asColor}` } as const;
  }
}

/* ========================= Size / radius / shadow ========================= */

export function paddingForSize(size: CardSize | undefined): string {
  switch (size) { case "sm": return "12px"; case "lg": return "20px"; default: return "16px"; }
}
export function gapForSize(size: CardSize | undefined): string {
  switch (size) { case "sm": return "8px"; case "lg": return "16px"; default: return "12px"; }
}
export function radiusTokenForSize(size: CardSize | undefined): LDRadiusToken {
  switch (size) { case "sm": return "md"; case "lg": return "xl"; default: return "lg"; }
}
export function radiusForSize(size: CardSize | undefined): string {
  const token = radiusTokenForSize(size);
  return `var(--ld-radius-${token})`;
}

/** Изчислява окончателната сянка спрямо пропса и/или варианта. */
export function computeShadow(
  shadow: CardShadow | undefined,
  variant?: CardVariant
): LDShadowToken | null {
  if (shadow === "none" || shadow === false) return null;
  if (shadow === true) return "sm";
  if (typeof shadow === "string") return shadow as LDShadowToken;
  // auto by variant
  if (variant === "solid") return "sm";
  if (variant === "soft") return "xs";
  return null;
}

/* ========================= Orientation / classes ========================= */

export function isHorizontal(orientation?: Orientation): boolean { return orientation === "horizontal"; }
export function isVertical(orientation?: Orientation): boolean { return !orientation || orientation === "vertical"; }
export function actionsDirection(orientation?: ActionsOrientation): string {
  switch (orientation) { case "horizontal-reverse": return "row-reverse";
    case "vertical": return "column"; default: return "row"; }
}
export function getCardRootClasses(state: CardOwnerState): string[] {
  const classes: string[] = [cardClasses.root];
  if (state.variant) classes.push(`ld-Card-variant${cap(String(state.variant))}`);
  if (state.color) classes.push(`ld-Card-color${cap(String(state.color))}`);
  if (state.size) classes.push(`ld-Card-size${cap(String(state.size))}`);
  if (isHorizontal(state.orientation)) classes.push("ld-Card-horizontal"); else classes.push("ld-Card-vertical");
  if (state.invertedColors) classes.push("ld-Card-colorContext");
  return classes;
}
export function getCardDataAttrs(state: CardOwnerState) {
  return {
    "data-variant": state.variant,
    "data-size": state.size,
    "data-color": state.color,
    "data-orientation": state.orientation ?? "vertical",
    "data-inverted-colors": state.invertedColors ? "true" : undefined,
  };
}

/* ========================= Public style recipes ========================= */

/** Card root recipe: variant/color CSS + spacing/radius + default white background + shadow. */
export function buildRootStyleRecipe(state: CardOwnerState): Record<string, string> {
  const recipe = buildVariantRecipe(state.color, state.variant, { inverted: !!state.invertedColors });

  // По подразбиране → бял фон за "outlined" и "plain"
  const wantWhiteByDefault = state.variant === "outlined" || state.variant === "plain";
  const backgroundColor = wantWhiteByDefault
    ? "var(--ld-color-white)"
    : (recipe.backgroundColor ?? "var(--ld-color-white)");

  const out: Record<string, string> = {
    padding: paddingForSize(state.size),
    borderRadius: radiusForSize(state.size),
    display: "flex",
    flexDirection: isHorizontal(state.orientation) ? "row" : "column",
    gap: gapForSize(state.size),
    backgroundColor,
    color: recipe.color ?? "inherit",
  };

  if (recipe.border) out.border = recipe.border;

  // Shadow: пропс → auto → none
  const elev = computeShadow(state.shadow, state.variant);
  if (elev) out.boxShadow = `var(--ld-shadow-${elev})`;

  return out;
}

/** Overflow section */
export function buildOverflowStyleRecipe(args: {
  color?: CardColor; variant?: CardVariant; size?: CardSize;
}): Record<string, string> {
  const recipe = buildVariantRecipe(args.color, args.variant);
  const out: Record<string, string> = {
    padding: paddingForSize(args.size),
    borderRadius: radiusForSize(args.size),
    backgroundColor: recipe.backgroundColor ?? "transparent",
    color: recipe.color ?? "inherit",
  };
  if (recipe.border) out.border = recipe.border;
  return out;
}

/** Content area */
export function buildContentStyleRecipe(args: { orientation?: Orientation; size?: CardSize; }): Record<string, string> {
  return {
    padding: paddingForSize(args.size),
    display: "flex",
    flexDirection: isHorizontal(args.orientation) ? "row" : "column",
    gap: gapForSize(args.size),
    flex: "1 1 auto",
  };
}

/** Actions area */
export function buildActionsStyleRecipe(args: {
  orientation?: ActionsOrientation; size?: CardSize; buttonFlex?: number | string;
}): Record<string, string> {
  const dir = actionsDirection(args.orientation);
  const out: Record<string, string> = {
    padding: paddingForSize(args.size),
    display: "flex",
    flexDirection: dir,
    gap: gapForSize(args.size),
    alignItems: "center",
  };
  if (args.buttonFlex != null) out["--ld-card-action-flex" as any] = String(args.buttonFlex);
  return out;
}
