// src/components/Container/Container.styles.ts
// LibDev UI – Custom React UI components

import styled from "@emotion/styled";
import { css } from "@emotion/react";
import type { ContainerProps } from "./Container.types";
import { buildResponsiveStyle, type ThemeLike } from "../../system/responsive";
import { applyCommonLayoutStyles } from "../../system/layout.mixin";

// CSS променливи за максимални ширини по размер
export const containerSizes = {
  "1": "var(--ld-container-1, 448px)",
  "2": "var(--ld-container-2, 688px)",
  "3": "var(--ld-container-3, 880px)",
  "4": "var(--ld-container-4, 1136px)",
} as const;

// Пропсове, които не трябва да изтичат към DOM (style-only)
const STYLE_ONLY_PROPS = new Set<string>([
  // Container специфични
  "size",
  "align",
  "asChild",

  // Общи layout пропсове – не трябва да се виждат като DOM атрибути
  "m", "mx", "my", "mt", "mr", "mb", "ml",
  "p", "px", "py", "pt", "pr", "pb", "pl",
  "width", "minWidth", "maxWidth", "height", "minHeight", "maxHeight",
  "position", "inset", "top", "right", "bottom", "left",
  "overflow", "overflowX", "overflowY",
  "flexBasis", "flexShrink", "flexGrow",
  "gridArea", "gridColumn", "gridColumnStart", "gridColumnEnd",
  "gridRow", "gridRowStart", "gridRowEnd",
]);

// Комбиниран тип за достъп до theme и общите пропсове в стиловете
type StyledAllProps = ContainerProps & { theme?: ThemeLike };

// Styled компонент с shouldForwardProp филтър
export const StyledContainer = styled("div", {
  // Филтрираме style-only пропсове да не се подадат към DOM
  shouldForwardProp: (prop) => !STYLE_ONLY_PROPS.has(prop as string),
})<StyledAllProps>((props) => {
  // Използваме css() за коректен SerializedStyles
  return css`
    /* Базови правила за контейнер */
    margin-left: auto;
    margin-right: auto;
    width: 100%;

    /* Отзивчив max-width на база size */
    ${buildResponsiveStyle(
      props.size,
      (val) =>
        css`
          max-width: ${containerSizes[val as keyof typeof containerSizes]};
        `,
      props.theme
    )}

    /* Отзивчиво подравняване (left/center/right) */
    ${buildResponsiveStyle(
      props.align,
      (val) => {
        if (val === "left") {
          return css`
            margin-left: 0;
            margin-right: auto;
          `;
        }
        if (val === "right") {
          return css`
            margin-left: auto;
            margin-right: 0;
          `;
        }
        // center (default)
        return css`
          margin-left: auto;
          margin-right: auto;
        `;
      },
      props.theme
    )}

    /* Общи layout пропсове (spacing, sizing, position, overflow, flex/grid) */
    ${applyCommonLayoutStyles(props)}
  `;
});
