import { useMemo } from "react";
import type { CSSProperties } from "react";
import {
  defaultTheme,
  resolveSl,
  type LibDevTheme,
  type SlProp,
} from "../system/styleEngine";
import { compileStyle } from "../system/resolveStyle";

/** Наличие на responsive стойности: { sm: ..., md: ... } и т.н. */
function hasResponsiveValues(obj: Record<string, any>): boolean {
  for (const v of Object.values(obj)) {
    if (
      v != null &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      // пазим safety: пропускаме Date, RegExp и т.н.
      Object.prototype.toString.call(v) === "[object Object]"
    ) {
      return true;
    }
  }
  return false;
}

export function useStyleResolver(theme?: LibDevTheme) {
  const th = theme ?? defaultTheme;

  return useMemo(() => {
    const resolve = (sl?: SlProp): CSSProperties | Record<string, any> | undefined => {
      if (!sl) return undefined;

      // Engine обединява sl (object | array | fn) до CSSObject
      const merged = (resolveSl(sl, th) || {}) as Record<string, any>;

      // 2) Ако има responsive стойности, връщаме ги as-is (оставяме Styled слой да ги обработи)
      if (hasResponsiveValues(merged)) {
        return merged; // типово е CSSObject / Record<string, any>
      }

      // 3) Ако е плосък обект → конвертираме токените към валиден CSS (var(...), px, ...)
      return compileStyle(merged) as CSSProperties;
    };

    return { theme: th, resolve };
  }, [th]);
}
