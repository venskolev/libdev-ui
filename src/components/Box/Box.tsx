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
  as: _asIgnored, // ← 1) поглъщаме външния `as`
  ...rest
}) => {
  const { resolve } = useStyleResolver();
  const resolved = sl ? resolve(sl) : undefined;

  return (
    <StyledBox
      {...rest}                 // ← 2) rest преди нашето `as=...`
      as={component as any}     //    нашият `as` винаги печели
      $styles={resolved}
      style={style}
    >
      {children}
    </StyledBox>
  );
};

Box.displayName = "Box";
