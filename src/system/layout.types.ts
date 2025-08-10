import type {
  Responsive,
  ResponsiveSpace,
  CSSLength,
} from "../components/common.types";

/**
 * Общ layout API за Box/Flex/Grid/Container/Section.
 * Използва глобалните responsive типове от common.types.ts.
 */
export interface CommonLayoutProps {
  /** Padding shorthands */
  p?: ResponsiveSpace;
  px?: ResponsiveSpace;
  py?: ResponsiveSpace;
  pt?: ResponsiveSpace;
  pr?: ResponsiveSpace;
  pb?: ResponsiveSpace;
  pl?: ResponsiveSpace;

  /** Width / Height */
  width?: Responsive<CSSLength>;
  minWidth?: Responsive<CSSLength>;
  maxWidth?: Responsive<CSSLength>;
  height?: Responsive<CSSLength>;
  minHeight?: Responsive<CSSLength>;
  maxHeight?: Responsive<CSSLength>;

  /** Positioning */
  position?: Responsive<"static" | "relative" | "absolute" | "fixed" | "sticky">;
  inset?: Responsive<CSSLength>;
  top?: Responsive<CSSLength>;
  right?: Responsive<CSSLength>;
  bottom?: Responsive<CSSLength>;
  left?: Responsive<CSSLength>;

  /** Overflow */
  overflow?: Responsive<"visible" | "hidden" | "clip" | "scroll" | "auto">;
  overflowX?: Responsive<"visible" | "hidden" | "clip" | "scroll" | "auto">;
  overflowY?: Responsive<"visible" | "hidden" | "clip" | "scroll" | "auto">;

  /** Flex/Grid interoperability */
  flexBasis?: Responsive<CSSLength>;
  flexShrink?: Responsive<number | string>;
  flexGrow?: Responsive<number | string>;
  gridArea?: Responsive<string>;
  gridColumn?: Responsive<string>;
  gridColumnStart?: Responsive<string>;
  gridColumnEnd?: Responsive<string>;
  gridRow?: Responsive<string>;
  gridRowStart?: Responsive<string>;
  gridRowEnd?: Responsive<string>;
}
