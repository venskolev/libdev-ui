import styled from "@emotion/styled";

/** Приемаме резолвнати стилове чрез $styles, за да не колидираме с реалния 'style' проп */
export const StyledBox = styled("div", {
  shouldForwardProp: (prop) => prop !== "$styles",
})<{ $styles?: Record<string, any> }>((props) => ({
  boxSizing: "border-box",
  minWidth: 0,
  ...(props.$styles || {}),
}));
