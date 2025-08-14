// src/components/Media/RatioBox/RatioBox.styles.ts
// LibDev UI – Custom React UI components

import styled from "@emotion/styled";
import { css } from "@emotion/react";
import type { RatioBoxProps } from "./RatioBox.types";
import { parseRatio } from "./RatioBox.utils";
import { applyCommonLayoutStyles } from "../../system/layout.mixin";
import { resolveSl, defaultTheme, type LibDevTheme } from "../../system/styleEngine";

const STYLE_ONLY_PROPS = new Set<string>([
  "component", "ratio", "objectFit", "slots", "slotProps", "sl",
  // layout props
  "m","mx","my","mt","mr","mb","ml",
  "p","px","py","pt","pr","pb","pl",
  "width","minWidth","maxWidth","height","minHeight","maxHeight",
  "position","inset","top","right","bottom","left",
  "overflow","overflowX","overflowY",
  "flexBasis","flexShrink","flexGrow",
  "gridArea","gridColumn","gridColumnStart","gridColumnEnd",
  "gridRow","gridRowStart","gridRowEnd",
]);

const shouldForwardProp = (prop: string) => !STYLE_ONLY_PROPS.has(prop);

const pickTheme = (theme?: any): LibDevTheme =>
  theme?.breakpoints && theme?.spacing ? (theme as LibDevTheme) : defaultTheme;

const applySl = (sl: any, theme?: any) => {
  if (!sl) return null;
  const th = pickTheme(theme);
  const resolved = resolveSl(sl, th) as Record<string, any>;
  return css(resolved as any);
};

/* ---------------- Root ---------------- */
export const StyledRatioBoxRoot = styled("div", { shouldForwardProp })<RatioBoxProps>(
  ({ theme, ratio, objectFit = "cover", sl, ...rest }) => {
    const { percent } = parseRatio(ratio);
    const layoutCss = applyCommonLayoutStyles({ ...(rest as any), theme: pickTheme(theme) });
    const slCss = applySl(sl, theme);

    return css`
      /* Container keeps the intrinsic ratio via padding trick */
      position: relative;
      display: block;
      width: 100%;

      &::before {
        content: "";
        display: block;
        padding-bottom: ${percent}%;
      }

      /* Positioned content layer */
      & > .ld-RatioBox-content {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: inherit;
        display: block;
      }

      /* Common media defaults (img/video) */
      & > .ld-RatioBox-content > img,
      & > .ld-RatioBox-content > video {
        width: 100%;
        height: 100%;
        object-fit: ${objectFit};
        display: block;
      }

      ${layoutCss}
      ${slCss}
    `;
  }
);

/* ---------------- Content (slot) ---------------- */
export const StyledRatioBoxContent = styled("div", { shouldForwardProp })<{
  sl?: any;
}>(({ theme, sl, ...rest }) => {
  const layoutCss = applyCommonLayoutStyles({ ...(rest as any), theme: pickTheme(theme) });
  const slCss = applySl(sl, theme);
  return css`
    ${layoutCss}
    ${slCss}
  `;
});
