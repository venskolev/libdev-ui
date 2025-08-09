// src/system/styleEngine.ts
import type { CSSProperties } from "react";

/** Breakpoint ключове */
export type BreakpointKey = "xs" | "sm" | "md" | "lg" | "xl";

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

/** Позволяваме вложени селектори и @media, така че indexer е задължителен */
export type CSSObject = CSSProperties & {
  [selectorOrAtRule: string]: any;
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

const isObject = (v: unknown): v is Record<string, any> =>
  !!v && typeof v === "object" && !Array.isArray(v);

const isFn = (v: unknown): v is (ctx: { theme: LibDevTheme }) => StyleArg =>
  typeof v === "function";


const mergeDeep = <T extends Record<string, any>, S extends Record<string, any>>(
  target: T,
  source: S
): T & S => {
  if (!isObject(target) || !isObject(source)) {
    // ако някой от аргументите не е обект, връщаме target
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

  const map: Array<[keyof CSSObject, Array<keyof CSSProperties>]> = [
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

const normalizeCSSObject = (obj: unknown, theme: LibDevTheme): CSSObject => {
  if (!isObject(obj)) return obj as CSSObject;
  let out = expandSpaceShorthands(obj as CSSObject, theme);
  out = extractBreakpoints(out, theme);
  return out;
};

const extractBreakpoints = (obj: CSSObject, theme: LibDevTheme): CSSObject => {
  const out: CSSObject = {};
  const bpKeys: BreakpointKey[] = ["xs", "sm", "md", "lg", "xl"];

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
