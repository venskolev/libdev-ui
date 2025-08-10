import React from "react";
import { StyledGrid } from "./Grid.styles";
import type { GridProps } from "./Grid.types";

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      component,
      columns,
      rows,
      areas,
      autoFlow,
      alignItems,
      justifyItems,
      alignContent,
      justifyContent,
      gap,
      gapX,
      gapY,
      ...rest
    },
    ref
  ) => {
    const asProps = component && component !== "div" ? { as: component } : {};

    return (
      <StyledGrid
        ref={ref}
        {...asProps}
        columns={columns}
        rows={rows}
        areas={areas}
        autoFlow={autoFlow}
        alignItems={alignItems}
        justifyItems={justifyItems}
        alignContent={alignContent}
        justifyContent={justifyContent}
        gap={gap}
        gapX={gapX}
        gapY={gapY}
        {...rest}
      />
    );
  }
);

Grid.displayName = "Grid";
