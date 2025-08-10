import styled from "@emotion/styled";
import { css } from "@emotion/react";
import type { BoxProps } from "./Box.types";
import { applyCommonLayoutStyles } from "../../system/layout.mixin";

/** Props only for styles/behavior; must NOT reach the DOM */
const STYLE_ONLY_PROPS = new Set<string>([
  // polymorphic & style engine
  "as",
  "component",
  "sl",
  "$styles",

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

/** Resolved styles via $styles, so we don't collide with the real 'style' prop */
export const StyledBox = styled("div", {
  shouldForwardProp: (prop) => !STYLE_ONLY_PROPS.has(prop as string),
})<Omit<BoxProps, "as"> & { $styles?: Record<string, any> }>`
  box-sizing: border-box;
  min-width: 0;

  /* Shared layout props (responsive) */
  ${applyCommonLayoutStyles}

  /* SL (Style Layer) – last layer, may override */
  ${({ $styles }) => ($styles ? css($styles as any) : null)}
`;
