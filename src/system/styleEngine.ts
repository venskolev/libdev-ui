import type { CSSProperties } from "react";

/** Breakpoint keys */
export type BreakpointKey = "xs" | "sm" | "md" | "lg" | "xl";

/** Single value or per-breakpoint map */
export type Responsive<T> = T | Partial<Record<BreakpointKey, T>>;

/** Minimal theme for spacing & breakpoints */
export interface LibDevTheme {
  breakpoints: {
    values: Record<BreakpointKey, number>;
    up: (key: BreakpointKey) => string; // "@media (min-width:600px)"
  };
  spacing: (n: number) => number; // 1 -> 8 => 8px
}

/** Default theme */
export const defaultTheme: LibDevTheme = {
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
    up: (key: BreakpointKey) => {
      const bp = { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 }[key];
      return `@media (min-width:${bp}px)`;
    },
  },
  // коментар: числата вече се третират като пиксели 1:1 (2 -> 2px)
  spacing: (n: number) => n,
};

/**
 * Extended CSS object:
 * - every CSS property may be Responsive<T>
 * - nested selectors / at-rules allowed
 * - spacing shorthands accept Responsive<number|string>
 */
export type CSSObject = {
  [K in keyof CSSProperties]?: Responsive<CSSProperties[K]>;
} & {
  [selectorOrAtRule: string]: any;

  // spacing shorthands
  p?: Responsive<number | string>;
  px?: Responsive<number | string>;
  py?: Responsive<number | string>;
  pt?: Responsive<number | string>;
  pr?: Responsive<number | string>;
  pb?: Responsive<number | string>;
  pl?: Responsive<number | string>;

  m?: Responsive<number | string>;
  mx?: Responsive<number | string>;
  my?: Responsive<number | string>;
  mt?: Responsive<number | string>;
  mr?: Responsive<number | string>;
  mb?: Responsive<number | string>;
  ml?: Responsive<number | string>;
};

/** Allowed values for sl */
export type StyleArg =
  | CSSObject
  | null
  | false
  | undefined
  | ((ctx: { theme: LibDevTheme }) => StyleArg);

export type SlProp = StyleArg | StyleArg[];

/* ---------------- helpers ---------------- */

const bpKeys: BreakpointKey[] = ["xs", "sm", "md", "lg", "xl"];

const isObject = (v: unknown): v is Record<string, any> =>
  !!v && typeof v === "object" && !Array.isArray(v);

const isFn = (v: unknown): v is ((ctx: { theme: LibDevTheme }) => StyleArg) =>
  typeof v === "function";

const mergeDeep = <T extends Record<string, any>, S extends Record<string, any>>(
  target: T,
  source: S
): T & S => {
  if (!isObject(target) || !isObject(source)) {
    return (source ?? target) as T & S;
  }
  const out: Record<string, any> = { ...target };
  for (const key of Object.keys(source)) {
    const tv = (target as any)[key];
    const sv = (source as any)[key];
    out[key] = isObject(tv) && isObject(sv) ? mergeDeep(tv, sv) : sv;
  }
  return out as T & S;
};

const hasBreakpointKeys = (v: unknown): v is Partial<Record<BreakpointKey, any>> =>
  !!v &&
  typeof v === "object" &&
  !Array.isArray(v) &&
  bpKeys.some((k) => Object.prototype.hasOwnProperty.call(v as object, k));

/* ---------- prop aliases (MUI-like) ---------- */
const PROP_ALIASES: Record<string, string> = {
  bgcolor: "backgroundColor",
  bg: "backgroundColor",
  radius: "borderRadius", // allow sl={{ radius: "xl" }}
};

/* ---------- color-ish props ---------- */
const COLOR_PROPS = new Set([
  "color",
  "background",
  "backgroundColor",
  "borderColor",
  "outlineColor",
  "caretColor",
  "fill",
  "stroke",
]);

/* ---------- design tokens ---------- */

const RADIUS_TOKENS = new Set(["sm", "md", "lg", "xl", "2xl", "pill", "circle"]);
const SHADOW_TOKENS = new Set(["xs", "sm", "md", "lg", "xl"]);

const isPaletteToken = (v: unknown): v is string =>
  typeof v === "string" && v.includes(".");

/** our LD vars */
const toLdColorVar = (token: string) => `--ld-color-${token.replace(/\./g, "-")}`;
const toLdRadiusVar = (token: string) => `--ld-radius-${token}`;
const toLdShadowVar = (token: string) => `--ld-shadow-${token}`;

/** legacy bridges (if present in some apps) */
const toLegacyColorVar = (token: string) => `--color-${token.replace(/\./g, "-")}`;
const toLegacyRadiusVar = (token: string) => `--radius-${token}`;
const toLegacyShadowVar = (token: string) => `--shadow-${token}`;

/** sensible defaults so things still render without global CSS */
const DEFAULT_RADII: Record<string, string> = {
  sm: "4px",
  md: "8px",
  lg: "16px",
  xl: "20px",
  "2xl": "24px",
  pill: "9999px",
  circle: "50%",
};

const DEFAULT_SHADOWS: Record<string, string> = {
  xs: "0 1px 2px rgba(0,0,0,.06)",
  sm: "0 1px 3px rgba(0,0,0,.10)",
  md: "0 4px 12px rgba(0,0,0,.12)",
  lg: "0 8px 24px rgba(0,0,0,.16)",
  xl: "0 14px 40px rgba(0,0,0,.20)",
};

const DEFAULT_COLORS: Record<string, string> = {
  "background.level1": "#0e0e12",
  primary: "#3b82f6",
  "primary.hover": "#2563eb",
  secondary: "#e5e7eb",
  // extend as needed
};

/* ---------- FIX: varChain must NOT wrap literals ---------- */

const isCustomPropName = (s: string) => s.startsWith("--");

const CSS_COLOR_KEYWORDS = new Set([
  "black","silver","gray","white","maroon","red","purple","fuchsia","green","lime",
  "olive","yellow","navy","blue","teal","aqua","orange","transparent","currentcolor",
  "inherit","initial","revert","unset","aliceblue","antiquewhite"
]);

/** var() chain, но НИКОГА не увива литерали (white, 20px, #fff, rgb(...)) */
const varChain = (primary: string, ...fallbacks: string[]) => {
  let tail = "";

  // build fallback chain from right to left
  for (let i = fallbacks.length - 1; i >= 0; i--) {
    const f = fallbacks[i];
    if (!f) continue;

    // ако е custom property → var(--x[, tail]); иначе е литерал → просто стойност
    if (isCustomPropName(f)) {
      tail = `var(${f}${tail ? `, ${tail}` : ""})`;
    } else {
      tail = f;
    }
  }

  return `var(${primary}${tail ? `, ${tail}` : ""})`;
};

/** map values per property to our CSS variables */
const mapDesignToken = (prop: string, val: any): any => {
  if (val == null) return val;
  if (typeof val !== "string") return val;
  const raw = val.trim();

  // already CSS var or raw css color/value – keep as is
  if (
    raw.startsWith("var(") ||
    raw.startsWith("#") ||
    raw.startsWith("rgb(") ||
    raw.startsWith("hsl(")
  ) {
    return val;
  }

  // ---------------- RADIUS TOKENS ----------------
  if (
    prop === "borderRadius" ||
    prop === "borderTopLeftRadius" ||
    prop === "borderTopRightRadius" ||
    prop === "borderBottomLeftRadius" ||
    prop === "borderBottomRightRadius"
  ) {
    if (raw === "pill") return "9999px";
    if (raw === "circle") return "50%";
    if (RADIUS_TOKENS.has(raw)) {
      const fb = DEFAULT_RADII[raw] ?? raw; // e.g. "20px"
      // Вече няма да увиваме литерала във var()
      return varChain(toLdRadiusVar(raw), toLegacyRadiusVar(raw), fb);
    }
    return val; // not a token
  }

  // ---------------- SHADOW TOKENS ----------------
  if (prop === "boxShadow" && SHADOW_TOKENS.has(raw)) {
    const fb = DEFAULT_SHADOWS[raw] ?? "none";
    return varChain(toLdShadowVar(raw), toLegacyShadowVar(raw), fb);
  }

  // ---------------- COLOR TOKENS ----------------
  if (COLOR_PROPS.has(prop)) {
    // директна CSS ключова дума → остави
    if (CSS_COLOR_KEYWORDS.has(raw.toLowerCase())) return raw;

    if (isPaletteToken(raw)) {
      const ld = toLdColorVar(raw);
      const legacy = toLegacyColorVar(raw);
      const fb = DEFAULT_COLORS[raw]; // може да липсва
      return fb ? varChain(ld, legacy, fb) : varChain(ld, legacy);
    }

    // bare role като "primary" → пробваме токени
    const ldBase = `--ld-color-${raw}`;
    const legacyBase = `--color-${raw}`;
    const fbBase = DEFAULT_COLORS[raw];
    if (fbBase) {
      return varChain(ldBase, legacyBase, fbBase);
    }

    // не е известен token (пример: "white") → върни директно стойността
    return raw;
  }

  return val;
};

/* ----- spacing scaling & mapping ----- */

const SPACING_PROPS = new Set<keyof CSSProperties>([
  "margin",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "padding",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "gap",
  "rowGap",
  "columnGap",
]);

const scaleIfSpacing = (prop: string, val: any, theme: LibDevTheme) => {
  if (!SPACING_PROPS.has(prop as keyof CSSProperties)) return val;
  if (typeof val === "number") return `${theme.spacing(val)}px`; // ← добавяме px тук
  return val;
};

const transformPropValue = (prop: string, val: any, theme: LibDevTheme) => {
  if (hasBreakpointKeys(val)) {
    const out: Record<string, any> = {};
    for (const k of bpKeys) {
      if ((val as any)[k] === undefined) continue;
      const v = (val as any)[k];
      out[k] = mapDesignToken(prop, scaleIfSpacing(prop, v, theme));
    }
    return out;
  }
  const scaled = scaleIfSpacing(prop, val, theme);
  return mapDesignToken(prop, scaled);
};

const expandSpaceShorthands = (obj: CSSObject, _theme: LibDevTheme): CSSObject => {
  const out: CSSObject = { ...obj };

  // ❗️ Не скалираме тук. Само разпъваме шорткъти → real props.
  const apply = (prop: keyof CSSProperties, v: any) => {
    (out as any)[prop] = v; // оставяме „суровото“ v
  };

  const map: Array<[string, Array<keyof CSSProperties>]> = [
    ["p", ["padding"]],
    ["px", ["paddingLeft", "paddingRight"]],
    ["py", ["paddingTop", "paddingBottom"]],
    ["pt", ["paddingTop"]],
    ["pr", ["paddingRight"]],
    ["pb", ["paddingBottom"]],
    ["pl", ["paddingLeft"]],
    ["m", ["margin"]],
    ["mx", ["marginLeft", "marginRight"]],
    ["my", ["marginTop", "marginBottom"]],
    ["mt", ["marginTop"]],
    ["mr", ["marginRight"]],
    ["mb", ["marginBottom"]],
    ["ml", ["marginLeft"]],
  ];

  for (const [key, props] of map) {
    const v = (out as any)[key];
    if (v === undefined) continue;
    for (const p of props) apply(p, v);
    delete (out as any)[key];
  }
  return out;
};


/** Normalize prop names (aliases) – e.g. bgcolor → backgroundColor */
const normalizePropName = (prop: string) => PROP_ALIASES[prop] ?? prop;

/**
 * Expand per-property responsive values and apply
 * tokens/spacing scaling + aliases.
 */
const expandResponsivePerProperty = (obj: CSSObject, theme: LibDevTheme): CSSObject => {
  const out: CSSObject = {};

  for (const rawKey of Object.keys(obj)) {
    const key = normalizePropName(rawKey);
    const raw = (obj as any)[rawKey];

    if (hasBreakpointKeys(raw)) {
      const transformed = transformPropValue(key, raw, theme) as Record<string, any>;
      if (transformed.xs !== undefined) {
        (out as any)[key] = transformed.xs;
      }
      for (const k of bpKeys) {
        const v = transformed[k];
        if (v === undefined) continue;
        const mq = theme.breakpoints.up(k);
        out[mq] = mergeDeep(out[mq] || {}, { [key]: v });
      }
    } else {
      (out as any)[key] = transformPropValue(key, raw, theme);
    }
  }

  return out;
};

const normalizeCSSObject = (obj: unknown, theme: LibDevTheme): CSSObject => {
  if (!isObject(obj)) return obj as CSSObject;

  // 1) spacing shorthands
  let out = expandSpaceShorthands(obj as CSSObject, theme);

  // 2) direct props (tokens/spacing) + per-prop responsive → @media
  out = expandResponsivePerProperty(out, theme);

  // 3) top-level breakpoints + nested selectors / @media
  out = extractBreakpoints(out, theme);

  return out;
};

const extractBreakpoints = (obj: CSSObject, theme: LibDevTheme): CSSObject => {
  const out: CSSObject = {};

  for (const key of Object.keys(obj)) {
    const val = (obj as any)[key];

    if (bpKeys.includes(key as BreakpointKey)) {
      const mq = theme.breakpoints.up(key as BreakpointKey);
      out[mq] = mergeDeep(out[mq] || {}, normalizeCSSObject(val, theme));
    } else if (isObject(val)) {
      // nested selectors / @media
      out[key] = normalizeCSSObject(val, theme);
    } else {
      (out as any)[key] = val;
    }
  }
  return out;
};

/* --------------- public API --------------- */

/** Resolve sl (object | array | function) into final CSSObject */
export const resolveSl = (
  sl: SlProp,
  theme: LibDevTheme = defaultTheme
): CSSObject => {
  const list = Array.isArray(sl) ? sl : [sl];
  let acc: CSSObject = {};
  for (let item of list) {
    if (!item) continue;
    if (isFn(item)) {
      item = item({ theme });
      if (!item) continue;
    }
    const normalized = normalizeCSSObject(item, theme);
    acc = mergeDeep(acc, normalized);
  }
  return acc;
};
