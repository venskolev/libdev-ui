// src/components/BoxMotion/BoxMotion.styles.ts
// LibDev UI – Custom React UI components

import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { motion } from "framer-motion";
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

  // BoxMotion-specific (да не „изтичат“ в DOM)
  "effect",
  "speed",
  "delay",
  "staggerChildren",
  "viewportOnce",
  "viewportAmount",
  "disabled",
  "variantsOverride",
  "scroll",
]);

export const StyledMotionDiv = styled(motion.div, {
  shouldForwardProp: (prop) => !STYLE_ONLY_PROPS.has(prop as string),
})<{
  /** Resolved SL styles (object) – идва от компонента, не от DOM проп */
  $styles?: Record<string, any>;
}>`
  box-sizing: border-box;
  min-width: 0;
  display: block;
  will-change: transform, opacity, filter;
  transform-style: preserve-3d; /* за 3D наклоните */

  /* Shared layout props (responsive) */
  ${applyCommonLayoutStyles}

  /* SL (Style Layer) – last layer, may override */
  ${({ $styles }) => ($styles ? css($styles as any) : null)}
`;
