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
    // ако някой от аргументите не е обект, връщаме source (или target ако source е null/undefined)
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

// Шорткъти за margin/padding: p, px, py, pt, pr, pb, pl, m, mx, my, mt, mr, mb, ml
const expandSpaceShorthands = (obj: CSSObject, theme: LibDevTheme): CSSObject => {
  const out: CSSObject = { ...obj };
  const s = (v: any) => (typeof v === "number" ? theme.spacing(v) : v);

  const apply = (prop: keyof CSSProperties, v: any) => {
    if (v !== undefined) (out as any)[prop] = s(v);
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
    if (v !== undefined) {
      for (const p of props) apply(p, v);
      delete (out as any)[key];
    }
  }
  return out;
};

const hasBreakpointKeys = (v: unknown): v is Partial<Record<BreakpointKey, any>> =>
  !!v &&
  typeof v === "object" &&
  !Array.isArray(v) &&
  bpKeys.some((k) => Object.prototype.hasOwnProperty.call(v as object, k));

/**
 * Разширява responsive стойности per-property:
 * { width: { xs: "100%", sm: 400, md: 600 } } ->
 * {
 *   width: "100%",
 *   "@media (min-width:600px)": { width: 400 },
 *   "@media (min-width:900px)": { width: 600 },
 * }
 */
const expandResponsivePerProperty = (obj: CSSObject, theme: LibDevTheme): CSSObject => {
  const out: CSSObject = {};

  for (const key of Object.keys(obj)) {
    const val: any = (obj as any)[key];

    if (hasBreakpointKeys(val)) {
      if (val.xs !== undefined) {
        (out as any)[key] = val.xs;
      }
      for (const k of bpKeys) {
        const v = val[k];
        if (v === undefined) continue;
        const mq = theme.breakpoints.up(k);
        out[mq] = mergeDeep(out[mq] || {}, { [key]: v });
      }
    } else {
      (out as any)[key] = val;
    }
  }

  return out;
};

const normalizeCSSObject = (obj: unknown, theme: LibDevTheme): CSSObject => {
  if (!isObject(obj)) return obj as CSSObject;
  // 1) spacing shorthand-и
  let out = expandSpaceShorthands(obj as CSSObject, theme);
  // 2) responsive per-property (width: { xs, sm, md }, alignItems: { xs, md }, ...)
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
