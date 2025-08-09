// src/system/styleEngine.ts
import type { CSSProperties } from "react";

/** Breakpoint ключове */
export type BreakpointKey = "xs" | "sm" | "md" | "lg" | "xl";

/** value или map по breakpoint-и */
export type Responsive<T> = T | Partial<Record<BreakpointKey, T>>;

/** Мини тема за spacing и breakpoints */
export interface LibDevTheme {
  breakpoints: {
    values: Record<BreakpointKey, number>;
    up: (key: BreakpointKey) => string; // "@media (min-width:600px)"
  };
  spacing: (n: number) => number; // 1 -> 8 => 8px
}

/** Дефолтна тема */
export const defaultTheme: LibDevTheme = {
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
    up: (key: BreakpointKey) => {
      const bp = { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 }[key];
      return `@media (min-width:${bp}px)`;
    },
  },
  spacing: (n: number) => n * 8,
};

/**
 * Разширен CSS обект:
 * - всяко CSS свойство приема Responsive<T>
 * - позволяваме вложени селектори / @media чрез indexer
 * - spacing shorthand-и с Responsive<number|string>
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

/** Позволени видове стойности за sl */
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

/* ---------- проп алиаси (MUI-стил) ---------- */

const PROP_ALIASES: Record<string, string> = {
  bgcolor: "backgroundColor",
  bg: "backgroundColor",
};

/* ---------- цветови/палетни пропове ---------- */

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

/* ---------- дизайн токени ---------- */

const RADIUS_TOKENS = new Set(["sm", "md", "lg", "xl", "2xl", "pill", "circle"]);
const SHADOW_TOKENS = new Set(["xs", "sm", "md", "lg", "xl"]);

/** конструира var() с optional fallback верига */
const varChain = (primary: string, ...fallbacks: string[]) => {
  if (!fallbacks.length) return `var(${primary})`;
  // var(--a, var(--b, var(--c)))
  return `var(${primary}, ${varChain(fallbacks[0], ...fallbacks.slice(1))})`;
};

const isPaletteToken = (v: unknown): v is string =>
  typeof v === "string" && v.includes(".");

const toJoyPaletteVar = (token: string) =>
  `--joy-palette-${token.replace(/\./g, "-")}`;

/** map стойности по property към съответните CSS var токени */
const mapDesignToken = (prop: string, val: any): any => {
  if (val == null) return val;

  // border radius токени
  if (
    (prop === "borderRadius" ||
      prop === "borderTopLeftRadius" ||
      prop === "borderTopRightRadius" ||
      prop === "borderBottomLeftRadius" ||
      prop === "borderBottomRightRadius") &&
    typeof val === "string"
  ) {
    if (val === "pill") return "9999px";
    if (val === "circle") return "50%";
    if (RADIUS_TOKENS.has(val)) {
      // Joy първо, после нашия
      return varChain(`--joy-radius-${val}`, `--radius-${val}`);
    }
  }

  // boxShadow токени
  if (prop === "boxShadow" && typeof val === "string" && SHADOW_TOKENS.has(val)) {
    return varChain(`--joy-shadow-${val}`, `--shadow-${val}`);
  }

  // палетни токени за цветови пропове
  if (COLOR_PROPS.has(prop) && isPaletteToken(val)) {
    const joyVar = toJoyPaletteVar(val);
    // fallback към нашата схема (пример: primary.solidBg → --color-primary-solidBg)
    const ours = `--color-${val.replace(/\./g, "-")}`;
    return varChain(joyVar, ours);
  }

  // ако стойността вече е var(...) или нормален CSS цвят/стойност — оставяме
  return val;
};

/* ----- spacing скалиране и проп мапинг ----- */

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
  if (typeof val === "number") return theme.spacing(val);
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



const expandSpaceShorthands = (obj: CSSObject, theme: LibDevTheme): CSSObject => {
  const out: CSSObject = { ...obj };

  const apply = (prop: keyof CSSProperties, v: any) => {
    const tv = transformPropValue(prop as string, v, theme);
    (out as any)[prop] = tv;
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

/**
 * Нормализира имена на пропове (алиаси) – например bgcolor → backgroundColor
 */
const normalizePropName = (prop: string) => PROP_ALIASES[prop] ?? prop;

/**
 * Разширява responsive стойности per-property и прилага
 * токени/скалиране върху стойностите + прилага алиаси на пропове.
 */
const expandResponsivePerProperty = (obj: CSSObject, theme: LibDevTheme): CSSObject => {
  const out: CSSObject = {};

  for (const rawKey of Object.keys(obj)) {
    const key = normalizePropName(rawKey);
    const raw = (obj as any)[rawKey];

    if (hasBreakpointKeys(raw)) {
      const transformed = transformPropValue(key, raw, theme) as Record<string, any>;
      // base от xs (ако има)
      if (transformed.xs !== undefined) {
        (out as any)[key] = transformed.xs;
      }
      // останалите breakpoints
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

  // 1) shorthand-и p*/m*
  let out = expandSpaceShorthands(obj as CSSObject, theme);

  // 2) директни spacing пропове/токени + responsive per-property → @media
  out = expandResponsivePerProperty(out, theme);

  // 3) top-level breakpoints + вложени селектори / @media
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
      // вложени селектори / @media
      out[key] = normalizeCSSObject(val, theme);
    } else {
      (out as any)[key] = val;
    }
  }
  return out;
};

/* --------------- public API --------------- */

/** Резолвва sl (обект | масив | функция) до финален CSSObject */
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
