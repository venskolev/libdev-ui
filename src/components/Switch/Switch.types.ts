// src/components/Switch/Switch.types.ts
// LibDev UI – Switch types

import * as React from "react";
import type { Size, Color, Variant, Radius } from "../common.types";
import type { SlProp } from "../../system/styleEngine";

/**
 * Public slots for the Switch structure.
 * You can replace any slot via the `slots` prop and pass extra props via `slotProps`.
 */
export interface SwitchSlots {
  root?: React.ElementType;
  track?: React.ElementType;
  thumb?: React.ElementType;
  action?: React.ElementType;
  input?: React.ElementType;
  startDecorator?: React.ElementType;
  endDecorator?: React.ElementType;
}

/** Utility to type slot props with correct element attributes + our extras */
export type SlotComponentProps<
  E extends React.ElementType,
  P = Record<string, unknown>
> = P &
  Omit<React.ComponentPropsWithRef<E>, keyof P | "color" | "size" | "children">;

/** Internal owner state forwarded to styled slots */
export interface SwitchOwnerState {
  checked: boolean;
  disabled: boolean;
  readOnly: boolean;
  focusVisible: boolean;
  /** Design props */
  color?: Color | string;
  variant?: Variant;
  size?: Size;
  radius?: Radius | number | string;
  /** Animated border state derived from props/variant */
  borderAnimation: "none" | "gradient" | "glow" | "pulse";
  borderWidth?: number | string;
}

/** SlotProps map for fine-grained control per slot */
export interface SwitchSlotProps {
  root?: SlotComponentProps<"label">;
  track?: SlotComponentProps<"span">;
  thumb?: SlotComponentProps<"span">;
  action?: SlotComponentProps<"div">;
  input?: SlotComponentProps<"input", React.InputHTMLAttributes<HTMLInputElement>>;
  startDecorator?: SlotComponentProps<"span">;
  endDecorator?: SlotComponentProps<"span">;
}

/**
 * Switch props.
 *
 * Notes:
 * - Controlled vs uncontrolled follows the standard `checked` / `defaultChecked` pattern.
 * - The native input is always rendered for proper form integration.
 * - We do not expose Framer Motion props here to avoid typing conflicts; animations are internal.
 */
export interface SwitchProps {
  /** Controlled checked state */
  checked?: boolean;
  /** Uncontrolled initial state */
  defaultChecked?: boolean;

  /** Handlers */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;

  /** Behavior flags */
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  /** When true, Escape will clear (set to false) if allowed by UX */
  clearOnEscape?: boolean;

  /** Form integration */
  id?: string;
  name?: string;
  value?: string | number | string[];
  inputRef?: React.Ref<HTMLInputElement>;

  /** Visual design */
  color?: Color | string;
  variant?: Variant; // "filled" | "outlined" | "ghost"
  size?: Size; // "sm" | "md" | "lg"
  radius?: Radius | number | string;

  /** Animated border – modern differentiator
   * Default behavior:
   * - For `outlined` and `ghost`, a subtle animated gradient border is enabled.
   * - For `filled`, a softer glow is used on focus/checked.
   */
  borderAnimation?: "none" | "gradient" | "glow" | "pulse";
  /** Width of the border track (e.g., 1, 2, "2px") */
  borderWidth?: number | string;
  /** Custom sequence of colors for gradient/pulse animations.
   * Accepts LD color tokens ("primary.hover", "warning", ...) or raw CSS colors.
   * If omitted, it derives sensible stops from `color`.
   */
  borderColors?: Array<string>;
  /** Animation speed in milliseconds (applies to gradient/pulse) */
  borderAnimationSpeed?: number;

  /** Polymorphic root element (label by default) */
  component?: React.ElementType;
  /** Slots override */
  slots?: SwitchSlots;
  /** Slot props override */
  slotProps?: SwitchSlotProps;

  /** System style override (our design-system `sl`) */
  sl?: SlProp;

  /** Optional decorators rendered before/after the track */
  startDecorator?: React.ReactNode | ((state: SwitchOwnerState) => React.ReactNode);
  endDecorator?: React.ReactNode | ((state: SwitchOwnerState) => React.ReactNode);

  /** Children are not commonly used for Switch; decorators cover labels/icons. */
  children?: React.ReactNode;

  /** Forwarded ref to the root element */
  ref?: React.Ref<HTMLElement>;
}

/* -------------------- Internal helpers (not exported by barrel) -------------------- */

/** Resolved motion configuration (internal) */
// Вътрешни стойности за анимации, за да държим еднакво усещане в различните размери
export interface SwitchMotionPreset {
  thumbSpring: {
    type: "spring";
    stiffness: number;
    damping: number;
    mass?: number;
  };
  pressScale: number; // напр. 1.06 при toggle/press
  focusGlowIntensity: number; // за подсилване на glow при фокус
}

/** Default slot element types used by the implementation */
// Тези дефолти ще се използват в Switch.tsx, но могат да бъдат презаписани през `slots`
export const defaultSwitchSlots: Required<SwitchSlots> = {
  root: "label",
  track: "span",
  thumb: "span",
  action: "div",
  input: "input",
  startDecorator: "span",
  endDecorator: "span",
};
