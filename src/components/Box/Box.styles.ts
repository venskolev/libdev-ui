// src/components/Box/Box.styles.ts
import styled from "@emotion/styled";

/** Приемаме резолвнати стилове чрез $styles, за да не колидираме с реалния 'style' проп */
export const StyledBox = styled("div", {
  // Филтрираме вътрешните пропове + 'as', за да не стигат до DOM атрибут
  shouldForwardProp: (prop) =>
    prop !== "$styles" && prop !== "sl" && prop !== "component" && prop !== "as",
})<{ $styles?: Record<string, any> }>((props) => ({
  boxSizing: "border-box",
  minWidth: 0,
  ...(props.$styles || {}),
}));
