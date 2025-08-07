import { ButtonHTMLAttributes, ReactNode, CSSProperties } from "react";
import { MotionProps } from "framer-motion";

import { Size, Color, Variant, Radius } from "../common.types"; // Assuming these types are defined in common.types.ts

type MotionSubset = Pick<
  MotionProps,
  | "whileHover"
  | "whileTap"
  | "whileFocus"
  | "initial"
  | "animate"
  | "exit"
>;

export interface CustomButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionSubset>,
    MotionSubset {
  children: ReactNode;
  variant?: Variant;
  color?: Color;
  size?: Size;
  radius?: Radius;
  sl?: CSSProperties;          // допълнителни инлайн-стилове
}
