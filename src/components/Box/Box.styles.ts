import styled from "@emotion/styled";
import { css } from "@emotion/react";
import type { BoxProps } from "./Box.types";
import { applyCommonLayoutStyles } from "../../system/layout.mixin";

/** Пропсове, които са само за стилизиране и НЕ трябва да стигат до DOM */
const STYLE_ONLY_PROPS = new Set<string>([
  // polymorphic & style engine
  "as",
  "component",
  "sl",
  "$styles",

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

/** Приемаме резолвнати стилове чрез $styles, за да не колидираме с реалния 'style' проп */
export const StyledBox = styled("div", {
  shouldForwardProp: (prop) => !STYLE_ONLY_PROPS.has(prop as string),
})<Omit<BoxProps, "as"> & { $styles?: Record<string, any> }>`
  box-sizing: border-box;
  min-width: 0;

  /* Общи layout пропсове (responsive) */
  ${applyCommonLayoutStyles}

  /* SL (Style Layer) – последен слой, може да override-ва */
  ${({ $styles }) => ($styles ? css($styles as any) : null)}
`;
