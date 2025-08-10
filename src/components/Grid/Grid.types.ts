import type { ElementType, HTMLAttributes } from "react";
import type { Responsive } from "../common.types";
import type { CommonLayoutProps } from "../../system/layout.types";

export interface GridProps
  extends HTMLAttributes<HTMLDivElement>,
    CommonLayoutProps {
  /** Polymorphic root element (like Box) */
  component?: ElementType;

  /** Grid template */
  columns?: Responsive<number | string>;   // number => repeat(n, minmax(0,1fr))
  rows?: Responsive<number | string>;      // number => repeat(n, auto)
  areas?: Responsive<string | string[]>;   // string[] => each item is a row: ["a a b","c d d"]

  /** Auto placement */
  autoFlow?: Responsive<"row" | "column" | "dense" | "row dense" | "column dense">;

  /** Alignment */
  alignItems?: Responsive<"start" | "center" | "end" | "stretch" | "baseline">;
  justifyItems?: Responsive<"start" | "center" | "end" | "stretch">;
  alignContent?: Responsive<"start" | "center" | "end" | "stretch" | "between" | "around" | "evenly">;
  justifyContent?: Responsive<"start" | "center" | "end" | "stretch" | "between" | "around" | "evenly">;

  /** Gaps */
  gap?: Responsive<string | number>;
  gapX?: Responsive<string | number>; // column-gap
  gapY?: Responsive<string | number>; // row-gap
}
