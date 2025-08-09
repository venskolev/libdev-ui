import { ButtonHTMLAttributes, ReactNode, CSSProperties } from "react";
import { MotionProps } from "framer-motion";
import { Size, Color, Variant, Radius } from "../common.types";

type MotionSubset = Pick<
  MotionProps,
  "whileHover" | "whileTap" | "whileFocus" | "initial" | "animate" | "exit"
>;

export interface CustomButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionSubset>,
    MotionSubset {
  children: ReactNode;

  // визуални (за стила)
  variant?: Variant;
  color?: Color | string;
  size?: Size;
  radius?: Radius;

  // поведение
  disabled?: boolean;
  loading?: boolean;
  preventFocusOnPress?: boolean;
  autoFocus?: boolean;

  // toggle (по избор)
  toggleable?: boolean;
  pressed?: boolean;            // controlled
  defaultPressed?: boolean;     // uncontrolled
  onPressedChange?: (pressed: boolean) => void;

  // стил escape hatch
  sl?: CSSProperties;
}
