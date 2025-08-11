// src/components/Typography/Typography.styles.ts
// LibDev UI – Custom React UI components

import styled from "@emotion/styled";
import { css } from "@emotion/react";
import type { CSSProperties } from "react";

import type { TypographyOwnProps } from "./Typography.types";
import type { CommonLayoutProps } from "../../system/layout.types";
import { applyCommonLayoutStyles } from "../../system/layout.mixin";
import { cssVarForColor } from "../../system/tokens.types";

/* -------------------------------------------------------------
 * 1) Локален тип за стилизиращите пропсове към Styled компонент
 * ----------------------------------------------------------- */
// Заб.: Styled компонентът вижда _само_ пропсовете, нужни за CSS.
// Всичко останало се филтрира от shouldForwardProp (да не „изтича“ в DOM).
type StyledProps = Pick<
  TypographyOwnProps,
  | "variant"
  | "color"
  | "textColor"
  | "level"
  | "gutterBottom"
  | "noWrap"
  | "truncate"
  | "wrap"
  | "align"
  | "weight"
  | "startDecorator"
  | "endDecorator"
  | "sl"
> &
  CommonLayoutProps & {
    $hasStart?: boolean;
    $hasEnd?: boolean;
  };

/* -------------------------------------------------------------
 * 2) Списък с пропсове, които НЕ трябва да стигат до DOM
 * ----------------------------------------------------------- */
// Включваме: полиморфични (as/component), визуални, layout шорткъти, и вътрешни ($hasStart/$hasEnd)
const STYLE_ONLY_PROPS = new Set<string>([
  // polymorphic
  "as",
  "component",

  // visual
  "variant",
  "color",
  "textColor",
  "level",
  "gutterBottom",
  "noWrap",
  "truncate",
  "wrap",
  "align",
  "weight",
  "startDecorator",
  "endDecorator",
  "slots",
  "slotProps",
  "sl",

  // internal
  "$hasStart",
  "$hasEnd",

  // CommonLayoutProps – margin
  "m", "mx", "my", "mt", "mr", "mb", "ml",

  // CommonLayoutProps – padding
  "p", "px", "py", "pt", "pr", "pb", "pl",

  // sizing
  "width", "minWidth", "maxWidth", "height", "minHeight", "maxHeight",

  // positioning
  "position", "inset", "top", "right", "bottom", "left",

  // overflow
  "overflow", "overflowX", "overflowY",

  // flex/grid
  "flexBasis", "flexShrink", "flexGrow",
  "gridArea", "gridColumn", "gridColumnStart", "gridColumnEnd",
  "gridRow", "gridRowStart", "gridRowEnd",
]);

/* -------------------------------------------------------------
 * 3) Помощни функции за визуални правила
 * ----------------------------------------------------------- */

// a) Нива → базови стилове (ползваме rem и относителни стойности, без твърди цветове)
const LEVEL_STYLES: Record<string, CSSProperties> = {
  h1: { fontSize: "3rem", lineHeight: 1.2, fontWeight: 700 },
  h2: { fontSize: "2.25rem", lineHeight: 1.25, fontWeight: 700 },
  h3: { fontSize: "1.875rem", lineHeight: 1.3, fontWeight: 600 },
  h4: { fontSize: "1.5rem", lineHeight: 1.35, fontWeight: 600 },
  "title-lg": { fontSize: "1.25rem", lineHeight: 1.4, fontWeight: 600 },
  "title-md": { fontSize: "1.125rem", lineHeight: 1.45, fontWeight: 600 },
  "title-sm": { fontSize: "1rem", lineHeight: 1.5, fontWeight: 600 },
  "body-lg": { fontSize: "1rem", lineHeight: 1.6, fontWeight: 400 },
  "body-md": { fontSize: "0.9375rem", lineHeight: 1.6, fontWeight: 400 },
  "body-sm": { fontSize: "0.875rem", lineHeight: 1.5, fontWeight: 400 },
  "body-xs": { fontSize: "0.75rem", lineHeight: 1.45, fontWeight: 400 },
  inherit: {},
};

const getLevelCSS = (level?: string) => {
  const lv = (level && LEVEL_STYLES[level]) || LEVEL_STYLES["body-md"];
  return css`
    font-size: ${lv.fontSize ?? "inherit"};
    line-height: ${lv.lineHeight ?? "inherit"};
    font-weight: ${lv.fontWeight ?? "inherit"};
  `;
};

/* // b) Тежест → число (ако е ключова дума) */
const toNumericWeight = (w?: TypographyOwnProps["weight"]) => {
  if (typeof w === "number") return w;
  switch (w) {
    case "light":
      return 300;
    case "regular":
      return 400;
    case "medium":
      return 500;
    case "bold":
      return 700;
    default:
      return undefined;
  }
};

/* // c) Извеждане на основния текстов цвят */
const getTextColorValue = (color?: TypographyOwnProps["color"], textColor?: string) => {
  // приоритет: textColor (директен CSS override) → LD токен → undefined (наследяване)
  if (textColor) return textColor;
  if (color) return cssVarForColor(color as any);
  return undefined;
};

/* // d) Варианти (plain/soft/solid/outlined) – без твърди hex-ове; ползваме `color-mix` и CSS променливи */
const variantCSS = (variant: TypographyOwnProps["variant"], baseColor?: string) => {
  const textColor = baseColor ?? "inherit";
  switch (variant) {
    case "soft":
      return css`
        color: ${textColor};
        background-color: color-mix(in srgb, ${textColor} 12%, transparent);
        padding: 0.1em 0.3em;
        border-radius: var(--ld-radius-sm, 4px);
      `;
    case "solid":
      return css`
        color: var(--ld-color-white, #fff);
        background-color: ${textColor};
        padding: 0.1em 0.35em;
        border-radius: var(--ld-radius-sm, 4px);
      `;
    case "outlined":
      return css`
        color: ${textColor};
        border: 1px solid color-mix(in srgb, ${textColor} 60%, transparent);
        padding: 0.05em 0.3em;
        border-radius: var(--ld-radius-sm, 4px);
      `;
    case "plain":
    default:
      return css`
        color: ${textColor};
      `;
  }
};

/* -------------------------------------------------------------
 * 4) Styled компонентът
 * ----------------------------------------------------------- */

export const StyledTypography = styled("span", {
  /* // Не пропускаме „стайл“ пропсовете към DOM */
  shouldForwardProp: (prop) => !STYLE_ONLY_PROPS.has(prop as string),
})<StyledProps>`
  /* --- A) Типографски размери според ниво --- */
  ${({ level }) => getLevelCSS(level)}

  /* Ако е подадена конкретна тежест – override-ва тази от нивото */
  ${({ weight }) =>
    weight !== undefined &&
    css`
      font-weight: ${toNumericWeight(weight)};
    `}

  /* --- B) Подравняване --- */
  ${({ align }) =>
    align &&
    css`
      text-align: ${align};
    `}

  /* --- C) Пренасяне и съкращаване --- */
  ${({ noWrap, truncate, wrap }) => {
    if (truncate || noWrap) {
      // За ellipsis трябва ограничение и inline-block
      return css`
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      `;
    }
    if (wrap === "nowrap") {
      return css`
        white-space: nowrap;
      `;
    }
    if (wrap === "balance") {
      return css`
        text-wrap: balance;
      `;
    }
    if (wrap === "pretty") {
      return css`
        text-wrap: pretty;
      `;
    }
    return null;
  }}

  /* --- D) Декоратори преди/след текста --- */
  ${({ $hasStart, $hasEnd }) =>
    ($hasStart || $hasEnd) &&
    css`
      display: inline-flex;
      align-items: baseline;
      gap: 0.35em;

      .ld-typography-startDecorator,
      .ld-typography-endDecorator {
        display: inline-flex;
        align-items: center;
        line-height: 1;
      }
    `}

  /* --- E) Долна междина (gutterBottom) --- */
  ${({ gutterBottom }) =>
    gutterBottom &&
    css`
      margin-bottom: 0.35em;
    `}

  /* --- F) Вариант и цветове (чрез LD токени/променливи) --- */
  ${({ variant = "plain", color, textColor }) =>
    variantCSS(variant, getTextColorValue(color, textColor))}

  /* --- G) Глобални layout пропсове (margin/padding/size/pos/overflow/flex/grid) --- */
  ${({ ...props }) => applyCommonLayoutStyles(props as CommonLayoutProps)}
`;
