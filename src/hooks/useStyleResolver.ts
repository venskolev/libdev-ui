import { useMemo } from "react";
import { defaultTheme, resolveSl, type LibDevTheme, type SlProp } from "../system/styleEngine";

export function useStyleResolver(theme?: LibDevTheme) {
  const th = theme ?? defaultTheme;

  return useMemo(
    () => ({
      theme: th,
      resolve: (sl: SlProp) => resolveSl(sl, th),
    }),
    [th]
  );
}
