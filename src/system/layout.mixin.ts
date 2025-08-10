import { css } from "@emotion/react";
import type { CommonLayoutProps } from "./layout.types";
import {
  buildResponsiveStyle,
  buildSpace,
  buildLen,
  type ThemeLike,
} from "./responsive";

/**
 * Инструмент за общи layout пропсове (padding, width/height, позициониране, overflow, flex/grid interop).
 * Връща Emotion CSS блок, който може да се включи в styled компоненти.
 */
export function layoutMixin(
  props: (CommonLayoutProps & { theme?: ThemeLike }) | undefined
) {
  if (!props) return null;

  const {
    theme,

    // padding shorthands
    p, px, py, pt, pr, pb, pl,

    // sizes
    width, minWidth, maxWidth, height, minHeight, maxHeight,

    // positioning
    position, inset, top, right, bottom, left,

    // overflow
    overflow, overflowX, overflowY,

    // flex/grid interop
    flexBasis, flexShrink, flexGrow,
    gridArea, gridColumn, gridColumnStart, gridColumnEnd,
    gridRow, gridRowStart, gridRowEnd,
  } = props;

  return css`
    /* -------- Padding -------- */
    ${buildResponsiveStyle(p,  (v) => css`padding: ${buildSpace(theme, v)};`, theme)}
    ${buildResponsiveStyle(px, (v) => css`padding-left: ${buildSpace(theme, v)}; padding-right: ${buildSpace(theme, v)};`, theme)}
    ${buildResponsiveStyle(py, (v) => css`padding-top: ${buildSpace(theme, v)}; padding-bottom: ${buildSpace(theme, v)};`, theme)}
    ${buildResponsiveStyle(pt, (v) => css`padding-top: ${buildSpace(theme, v)};`, theme)}
    ${buildResponsiveStyle(pr, (v) => css`padding-right: ${buildSpace(theme, v)};`, theme)}
    ${buildResponsiveStyle(pb, (v) => css`padding-bottom: ${buildSpace(theme, v)};`, theme)}
    ${buildResponsiveStyle(pl, (v) => css`padding-left: ${buildSpace(theme, v)};`, theme)}

    /* -------- Width / Height -------- */
    ${buildResponsiveStyle(width,     (v) => css`width: ${buildLen(v)};`, theme)}
    ${buildResponsiveStyle(minWidth,  (v) => css`min-width: ${buildLen(v)};`, theme)}
    ${buildResponsiveStyle(maxWidth,  (v) => css`max-width: ${buildLen(v)};`, theme)}
    ${buildResponsiveStyle(height,    (v) => css`height: ${buildLen(v)};`, theme)}
    ${buildResponsiveStyle(minHeight, (v) => css`min-height: ${buildLen(v)};`, theme)}
    ${buildResponsiveStyle(maxHeight, (v) => css`max-height: ${buildLen(v)};`, theme)}

    /* -------- Positioning -------- */
    ${buildResponsiveStyle(position, (v) => css`position: ${v};`, theme)}

    /* inset като шорткът за top,right,bottom,left */
    ${buildResponsiveStyle(inset, (v) => css`
      top: ${buildLen(v)};
      right: ${buildLen(v)};
      bottom: ${buildLen(v)};
      left: ${buildLen(v)};
    `, theme)}

    ${buildResponsiveStyle(top,    (v) => css`top: ${buildLen(v)};`, theme)}
    ${buildResponsiveStyle(right,  (v) => css`right: ${buildLen(v)};`, theme)}
    ${buildResponsiveStyle(bottom, (v) => css`bottom: ${buildLen(v)};`, theme)}
    ${buildResponsiveStyle(left,   (v) => css`left: ${buildLen(v)};`, theme)}

    /* -------- Overflow -------- */
    ${buildResponsiveStyle(overflow,  (v) => css`overflow: ${v};`, theme)}
    ${buildResponsiveStyle(overflowX, (v) => css`overflow-x: ${v};`, theme)}
    ${buildResponsiveStyle(overflowY, (v) => css`overflow-y: ${v};`, theme)}

    /* -------- Flex/Grid interop -------- */
    ${buildResponsiveStyle(flexBasis, (v) => css`flex-basis: ${buildLen(v)};`, theme)}
    ${buildResponsiveStyle(flexShrink,(v) => css`flex-shrink: ${v};`, theme)}
    ${buildResponsiveStyle(flexGrow,  (v) => css`flex-grow: ${v};`, theme)}

    ${buildResponsiveStyle(gridArea,       (v) => css`grid-area: ${v};`, theme)}
    ${buildResponsiveStyle(gridColumn,     (v) => css`grid-column: ${v};`, theme)}
    ${buildResponsiveStyle(gridColumnStart,(v) => css`grid-column-start: ${v};`, theme)}
    ${buildResponsiveStyle(gridColumnEnd,  (v) => css`grid-column-end: ${v};`, theme)}
    ${buildResponsiveStyle(gridRow,        (v) => css`grid-row: ${v};`, theme)}
    ${buildResponsiveStyle(gridRowStart,   (v) => css`grid-row-start: ${v};`, theme)}
    ${buildResponsiveStyle(gridRowEnd,     (v) => css`grid-row-end: ${v};`, theme)}
  `;
}

/**
 * Хелпър за включване директно в styled компонент:
 *   ${applyCommonLayoutStyles};
 */
export const applyCommonLayoutStyles = (props: CommonLayoutProps & { theme?: ThemeLike }) =>
  layoutMixin(props);
