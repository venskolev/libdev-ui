import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { FlexProps } from "./Flex.types";
import { buildResponsiveStyle, buildSpace } from "../../system/responsive";
import { applyCommonLayoutStyles } from "../../system/layout.mixin";

/** Props used only for styling; must NOT reach the DOM */
const STYLE_ONLY_PROPS = new Set<string>([
  // polymorphic
  "as",
  "component",

  // Flex-specific
  "direction", "align", "justify", "wrap", "gap", "gapX", "gapY",

  // CommonLayoutProps — margin
  "m", "mx", "my", "mt", "mr", "mb", "ml",

  // CommonLayoutProps — padding
  "p", "px", "py", "pt", "pr", "pb", "pl",

  // sizes
  "width", "minWidth", "maxWidth", "height", "minHeight", "maxHeight",

  // positioning
  "position", "inset", "top", "right", "bottom", "left",

  // overflow
  "overflow", "overflowX", "overflowY",

  // flex/grid interop
  "flexBasis", "flexShrink", "flexGrow",
  "gridArea", "gridColumn", "gridColumnStart", "gridColumnEnd",
  "gridRow", "gridRowStart", "gridRowEnd",
]);

export const StyledFlex = styled("div", {
  shouldForwardProp: (prop) => !STYLE_ONLY_PROPS.has(prop as string),
})<FlexProps>`
  display: flex;

  /* Shared layout (margin, padding, sizes, position, overflow, interop) */
  ${applyCommonLayoutStyles}

  /* flex-direction */
  ${({ direction, theme }) =>
    buildResponsiveStyle(direction, (v) => css`flex-direction: ${v};`, theme)}

  /* align-items */
  ${({ align, theme }) =>
    buildResponsiveStyle(align, (v) => css`align-items: ${mapAlign(v)};`, theme)}

  /* justify-content */
  ${({ justify, theme }) =>
    buildResponsiveStyle(justify, (v) => css`justify-content: ${mapJustify(v)};`, theme)}

  /* flex-wrap */
  ${({ wrap, theme }) =>
    buildResponsiveStyle(wrap, (v) => css`flex-wrap: ${v};`, theme)}

  /* gap */
  ${({ gap, theme }) =>
    buildResponsiveStyle(gap, (v) => css`gap: ${typeof v === "number" ? buildSpace(theme, v) : v};`, theme)}

  /* column-gap */
  ${({ gapX, theme }) =>
    buildResponsiveStyle(gapX, (v) => css`column-gap: ${typeof v === "number" ? buildSpace(theme, v) : v};`, theme)}

  /* row-gap */
  ${({ gapY, theme }) =>
    buildResponsiveStyle(gapY, (v) => css`row-gap: ${typeof v === "number" ? buildSpace(theme, v) : v};`, theme)}
`;

function mapAlign(v: "stretch" | "start" | "center" | "end" | "baseline") {
  switch (v) {
    case "start": return "flex-start";
    case "end":   return "flex-end";
    default:      return v;
  }
}

function mapJustify(v: "start" | "center" | "end" | "between" | "around" | "evenly") {
  switch (v) {
    case "start":   return "flex-start";
    case "end":     return "flex-end";
    case "between": return "space-between";
    case "around":  return "space-around";
    case "evenly":  return "space-evenly";
    default:        return v;
  }
}
