import styled from "@emotion/styled";
import { css } from "@emotion/react";
import type { GridProps } from "./Grid.types";
import { buildResponsiveStyle, buildSpace } from "../../system/responsive";
import { applyCommonLayoutStyles } from "../../system/layout.mixin";

/** Пропсове само за стил/поведение, които НЕ трябва да стигат до DOM атрибути */
const STYLE_ONLY_PROPS = new Set<string>([
  // полиморфизъм
  "as",
  "component",

  // grid-специфични
  "columns", "rows", "areas", "autoFlow",
  "alignItems", "justifyItems", "alignContent", "justifyContent",
  "gap", "gapX", "gapY",

  // CommonLayoutProps — margin шорткъти
  "m", "mx", "my", "mt", "mr", "mb", "ml",

  // CommonLayoutProps — padding шорткъти
  "p", "px", "py", "pt", "pr", "pb", "pl",

  // размери
  "width", "minWidth", "maxWidth", "height", "minHeight", "maxHeight",

  // позициониране
  "position", "inset", "top", "right", "bottom", "left",

  // overflow
  "overflow", "overflowX", "overflowY",

  // flex/grid interop
  "flexBasis", "flexShrink", "flexGrow",
  "gridArea", "gridColumn", "gridColumnStart", "gridColumnEnd",
  "gridRow", "gridRowStart", "gridRowEnd",
]);

export const StyledGrid = styled("div", {
  shouldForwardProp: (prop) => !STYLE_ONLY_PROPS.has(prop as string),
})<GridProps>`
  display: grid;

  /* Общи layout правила (margin, padding, размери, позициониране, overflow, interop) */
  ${applyCommonLayoutStyles}

  /* Шаблони: колони / редове / зони (areas) */
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

  /* Автоматично подреждане на елементи */
  ${({ autoFlow, theme }) =>
    buildResponsiveStyle(autoFlow, (v) => css`grid-auto-flow: ${v};`, theme)}

  /* Подравняване */
  ${({ alignItems, theme }) =>
    buildResponsiveStyle(alignItems, (v) => css`align-items: ${v};`, theme)}

  ${({ justifyItems, theme }) =>
    buildResponsiveStyle(justifyItems, (v) => css`justify-items: ${v};`, theme)}

  ${({ alignContent, theme }) =>
    buildResponsiveStyle(alignContent, (v) => css`align-content: ${mapAxisContent(v)};`, theme)}

  ${({ justifyContent, theme }) =>
    buildResponsiveStyle(justifyContent, (v) => css`justify-content: ${mapAxisContent(v)};`, theme)}

  /* Разстояния между клетки */
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

/* Хелпъри */
function toTemplateAreas(value: string | string[]) {
  if (Array.isArray(value)) {
    // Масив: всеки елемент е ред. Слагаме кавички и свързваме с интервал (CSS позволява и нов ред).
    return value.map((row) => `"${row}"`).join(" ");
  }
  // Низ: приемаме, че авторът е подал коректно кавички/нови редове.
  return value as string;
}

function mapAxisContent(
  v: "start" | "center" | "end" | "stretch" | "between" | "around" | "evenly"
) {
  switch (v) {
    case "between": return "space-between";
    case "around":  return "space-around";
    case "evenly":  return "space-evenly";
    default:        return v;
  }
}
