// src/components/Media/RatioBox/RatioBox.types.ts
// LibDev UI – Custom React UI components

import type {
  CSSProperties,
  ElementType,
  HTMLAttributes,
  ReactNode,
} from "react";
import type { CommonLayoutProps } from "../../system/layout.types";
import type { SlProp } from "../../system/styleEngine";

/** Accepted ratio values: number (w/h) or string "16/9", "4:3", "1", "3:4" */
export type RatioValue = number | string;

export interface RatioBoxSlots {
  root?: ElementType;
  content?: ElementType;
}

export interface RatioBoxSlotProps {
  root?: HTMLAttributes<HTMLElement> & { sl?: SlProp; style?: CSSProperties };
  content?: HTMLAttributes<HTMLElement> & { sl?: SlProp; style?: CSSProperties };
}

export interface RatioBoxBaseProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    CommonLayoutProps {
  /** Child to be sized inside the ratio box (img/video/any). */
  children?: ReactNode;
  /** Aspect ratio as width/height (e.g., 16/9, "4:3", 1). Default: 16/9. */
  ratio?: RatioValue;
  /** Object fit for direct media (img/video). Default: "cover". */
  objectFit?: CSSProperties["objectFit"];
  /** Override element type for the root. */
  component?: ElementType;
  /** Slot components. */
  slots?: RatioBoxSlots;
  /** Slot props (supports sl). */
  slotProps?: RatioBoxSlotProps;
  /** Styling slot for the root. */
  sl?: SlProp;
}

export type RatioBoxProps = RatioBoxBaseProps;

/** Public class names */
export const ratioBoxClasses = {
  root: "ld-RatioBox-root",
  content: "ld-RatioBox-content",
};
