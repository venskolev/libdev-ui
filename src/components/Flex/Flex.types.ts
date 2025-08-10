import type { ElementType, HTMLAttributes } from "react";
import type { Responsive } from "../common.types";
import type { CommonLayoutProps } from "../../system/layout.types";

export interface FlexProps
  extends HTMLAttributes<HTMLDivElement>,
    CommonLayoutProps {
  /** Полиморфен елемент (като при Box) */
  component?: ElementType;

  /** Flex-specific */
  direction?: Responsive<"row" | "row-reverse" | "column" | "column-reverse">;
  align?: Responsive<"stretch" | "start" | "center" | "end" | "baseline">;
  justify?: Responsive<"start" | "center" | "end" | "between" | "around" | "evenly">;
  wrap?: Responsive<"nowrap" | "wrap" | "wrap-reverse">;

  gap?: Responsive<string | number>;
  gapX?: Responsive<string | number>;
  gapY?: Responsive<string | number>;
}
