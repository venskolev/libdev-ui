import React from "react";
import { StyledBox } from "./Box.styles";
import type { BoxProps } from "./Box.types";
import { useStyleResolver } from "../../hooks/useStyleResolver";

export const Box: React.FC<BoxProps> = ({
  component = "div",
  sl,
  children,
  style,
  as: _asIgnored, // поглъщаме външния `as`, използвай `component`
  ...rest
}) => {
  const { resolve } = useStyleResolver();
  const resolved = sl ? resolve(sl) : undefined;

  // Подай `as` само ако е различен от "div", за да не се вижда as="div" в DOM
  const asProps = component && component !== "div" ? { as: component as any } : {};

  return (
    <StyledBox
      {...rest}          // rest преди нашия `as`, за да „спечели“ при колизия
      {...asProps}
      $styles={resolved} // фин слой стилове
      style={style}
    >
      {children}
    </StyledBox>
  );
};

Box.displayName = "Box";
