import styled from "@emotion/styled";
import { css } from "@emotion/react";
import type { GridProps } from "./Grid.types";
import { buildResponsiveStyle, buildSpace } from "../../system/responsive";
import { applyCommonLayoutStyles } from "../../system/layout.mixin";

/** Style-only props that must NOT leak to the DOM */
const STYLE_ONLY_PROPS = new Set<string>([
  // polymorphic
  "as",
  "component",

  // grid-specific
  "columns", "rows", "areas", "autoFlow",
  "alignItems", "justifyItems", "alignContent", "justifyContent",
  "gap", "gapX", "gapY",

  // CommonLayoutProps
  "p","px","py","pt","pr","pb","pl",
  "width","minWidth","maxWidth","height","minHeight","maxHeight",
  "position","inset","top","right","bottom","left",
  "overflow","overflowX","overflowY",
  "flexBasis","flexShrink","flexGrow",
  "gridArea","gridColumn","gridColumnStart","gridColumnEnd",
  "gridRow","gridRowStart","gridRowEnd",
]);

export const StyledGrid = styled("div", {
  shouldForwardProp: (prop) => !STYLE_ONLY_PROPS.has(prop as string),
})<GridProps>`
  display: grid;

  /* Shared layout (padding, sizes, position, overflow, grid/flex interop) */
  ${applyCommonLayoutStyles}

  /* Template: columns / rows / areas */
  ${({ columns, theme }) =>
    buildResponsiveStyle(
      columns,
      (v) =>
        css`grid-template-columns: ${typeof v === "number" ? `repeat(${v}, minmax(0, 1fr))` : v};`,
      theme
    )}

  ${({ rows, theme }) =>
    buildResponsiveStyle(
      rows,
      (v) =>
        css`grid-template-rows: ${typeof v === "number" ? `repeat(${v}, auto)` : v};`,
      theme
    )}

  ${({ areas, theme }) =>
    buildResponsiveStyle(
      areas,
      (v) => css`grid-template-areas: ${toTemplateAreas(v)};`,
      theme
    )}

  /* Auto placement */
  ${({ autoFlow, theme }) =>
    buildResponsiveStyle(autoFlow, (v) => css`grid-auto-flow: ${v};`, theme)}

  /* Alignment */
  ${({ alignItems, theme }) =>
    buildResponsiveStyle(alignItems, (v) => css`align-items: ${v};`, theme)}

  ${({ justifyItems, theme }) =>
    buildResponsiveStyle(justifyItems, (v) => css`justify-items: ${v};`, theme)}

  ${({ alignContent, theme }) =>
    buildResponsiveStyle(alignContent, (v) => css`align-content: ${mapAxisContent(v)};`, theme)}

  ${({ justifyContent, theme }) =>
    buildResponsiveStyle(justifyContent, (v) => css`justify-content: ${mapAxisContent(v)};`, theme)}

  /* Gaps */
  ${({ gap, theme }) =>
    buildResponsiveStyle(
      gap,
      (v) => css`gap: ${typeof v === "number" ? buildSpace(theme, v) : v};`,
      theme
    )}

  ${({ gapX, theme }) =>
    buildResponsiveStyle(
      gapX,
      (v) => css`column-gap: ${typeof v === "number" ? buildSpace(theme, v) : v};`,
      theme
    )}

  ${({ gapY, theme }) =>
    buildResponsiveStyle(
      gapY,
      (v) => css`row-gap: ${typeof v === "number" ? buildSpace(theme, v) : v};`,
      theme
    )}
`;

/* Helpers */
function toTemplateAreas(value: string | string[]) {
  if (Array.isArray(value)) {
    // Each item is a row, wrap with quotes and join with a space (CSS allows newline or space)
    return value.map((row) => `"${row}"`).join(" ");
  }
  // If it's a string, assume author provided correct quotes/newlines
  return value as string;
}

function mapAxisContent(
  v: "start" | "center" | "end" | "stretch" | "between" | "around" | "evenly"
) {
  switch (v) {
    case "between":
      return "space-between";
    case "around":
      return "space-around";
    case "evenly":
      return "space-evenly";
    default:
      return v;
  }
}
