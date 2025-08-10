import React from "react";
import { StyledFlex } from "./Flex.styles";
import { FlexProps } from "./Flex.types";

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      component,
      direction,
      align,
      justify,
      wrap,
      gap,
      gapX,
      gapY,
      ...rest
    },
    ref
  ) => {
    // подаваме `as` САМО ако има custom component
    const asProps = component ? { as: component } : {};

    return (
      <StyledFlex
        ref={ref}
        {...asProps}
        direction={direction}
        align={align}
        justify={justify}
        wrap={wrap}
        gap={gap}
        gapX={gapX}
        gapY={gapY}
        {...rest}
      />
    );
  }
);

Flex.displayName = "Flex";
