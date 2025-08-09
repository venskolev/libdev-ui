// src/components/Box/Box.tsx
import React from "react";
import { StyledBox } from "./Box.styles";
import type { BoxProps } from "./Box.types";
import { useStyleResolver } from "../../hooks/useStyleResolver";

export const Box: React.FC<BoxProps> = ({
  component = "div",
  sl,
  children,
  style,
  ...rest
}) => {
  const { resolve } = useStyleResolver();
  const resolved = sl ? resolve(sl) : undefined;

  return (
    <StyledBox
      as={component as any}
      $styles={resolved}
      style={style}
      {...rest}
    >
      {children}
    </StyledBox>
  );
};

Box.displayName = "Box";
