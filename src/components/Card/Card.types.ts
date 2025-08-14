// src/components/Container/Card/Card.types.ts
// LibDev UI – Custom React UI components

import type {
  CSSProperties,
  ElementType,
  HTMLAttributes,
  ReactNode,
} from "react";
import type {
  Size as GlobalSize,
  Color as GlobalColor,
  Variant as GlobalVariant,
} from "../common.types";
import type { CommonLayoutProps } from "../../system/layout.types";
import type { SlProp } from "../../system/styleEngine";
import type { LDShadowToken } from "../../system/tokens.types";

/** Shadow control:
 * - string token → exact shadow (xs|sm|md|lg|xl)
 * - "none" or false → no shadow
 * - true → small shadow ("sm")
 * - undefined → auto by variant (solid=sm, soft=xs, else none)
 */
export type CardShadow = LDShadowToken | "none" | boolean;

/** Card color: extends global colors with 'neutral' and allows custom strings. */
export type CardColor = GlobalColor | "neutral" | (string & {});
/** Card variant: Joy-like + global Variant + custom string. */
export type CardVariant =
  | "outlined"
  | "plain"
  | "soft"
  | "solid"
  | GlobalVariant
  | (string & {});
/** Card size maps to global size tokens. */
export type CardSize = GlobalSize;
/** Root card orientation. */
export type Orientation = "vertical" | "horizontal";
/** Actions container orientation (includes horizontal-reverse). */
export type ActionsOrientation = "horizontal" | "horizontal-reverse" | "vertical";

export interface SlotComponents { root?: ElementType; }
export interface SlotProps {
  root?: HTMLAttributes<HTMLElement> & { sl?: SlProp; style?: CSSProperties };
}

/* ---------------------- Card (root) props ---------------------- */

export interface CardBaseProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    CommonLayoutProps {
  /** Used to render children inside the Card. */
  children?: ReactNode;
  /** The color of the component. */
  color?: CardColor;
  /** The global variant to use. */
  variant?: CardVariant;
  /** The size of the component. */
  size?: CardSize;
  /** The component orientation. */
  orientation?: Orientation;
  /** Invert implicit children colors to match variant & color. */
  invertedColors?: boolean;

  /** Box shadow control. */
  shadow?: CardShadow;

  /** Root element override (e.g., 'section' or a custom component). */
  component?: ElementType;
  /** Components used for each slot. */
  slots?: SlotComponents;
  /** Props used for each slot. */
  slotProps?: SlotProps;
  /** Styling slot (LibDev system): tokens, responsive, shorthands, etc. */
  sl?: SlProp;
}
export type CardProps = CardBaseProps;

/* Owner state for the styled layer */
export interface CardOwnerState {
  color?: CardColor;
  variant?: CardVariant;
  size?: CardSize;
  orientation?: Orientation;
  invertedColors?: boolean;
  shadow?: CardShadow;
}

/* ---------------------- Subcomponents props ---------------------- */

export interface CardContentBaseProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    CommonLayoutProps {
  children?: ReactNode;
  orientation?: Orientation;
  size?: CardSize;
  component?: ElementType;
  slots?: SlotComponents;
  slotProps?: SlotProps;
  sl?: SlProp;
}
export type CardContentProps = CardContentBaseProps;
export interface CardContentOwnerState { orientation?: Orientation; size?: CardSize; }

export interface CardActionsBaseProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    CommonLayoutProps {
  children?: ReactNode;
  orientation?: ActionsOrientation;
  size?: CardSize;
  buttonFlex?: number | string;
  component?: ElementType;
  slots?: SlotComponents;
  slotProps?: SlotProps;
  sl?: SlProp;
}
export type CardActionsProps = CardActionsBaseProps;
export interface CardActionsOwnerState { orientation?: ActionsOrientation; size?: CardSize; buttonFlex?: number | string; }

export interface CardCoverBaseProps
  extends HTMLAttributes<HTMLDivElement>,
    CommonLayoutProps {
  children?: ReactNode;
  component?: ElementType;
  slots?: SlotComponents;
  slotProps?: SlotProps;
  sl?: SlProp;
}
export type CardCoverProps = CardCoverBaseProps;

export interface CardOverflowBaseProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    CommonLayoutProps {
  children?: ReactNode;
  color?: CardColor;
  variant?: CardVariant;
  size?: CardSize;
  component?: ElementType;
  slots?: SlotComponents;
  slotProps?: SlotProps;
  sl?: SlProp;
}
export type CardOverflowProps = CardOverflowBaseProps;

export const cardClasses = {
  root: "ld-Card-root",
  content: "ld-CardContent-root",
  actions: "ld-CardActions-root",
  cover: "ld-CardCover-root",
  overflow: "ld-CardOverflow-root",
};
