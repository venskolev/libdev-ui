// src/components/Radio/RadioGroup/RadioGroup.styles.ts
// LibDev UI – RadioGroup styles (Emotion)

import styled from "@emotion/styled";
import { css } from "@emotion/react";

/* ---------------------------------------------
 *  Стилизация на RadioGroup
 * ------------------------------------------- */
export const Root = styled.div<{ $orientation: "horizontal" | "vertical" }>`
  display: flex;
  flex-direction: ${({ $orientation }) => ($orientation === "horizontal" ? "row" : "column")};
  gap: 10px;
`;

export const orientationCss = (o: "horizontal" | "vertical") => css`
  flex-direction: ${o === "horizontal" ? "row" : "column"};
`;
