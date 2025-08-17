import * as React from "react";
import type { Size, Color, Variant } from "../../common.types";

/* ---------------------------------------------
 *  Slot типове – уникални имена за RadioGroup
 * ------------------------------------------- */
export type RGSlotProp<P, OwnerState> =
  | P
  | ((ownerState: OwnerState) => P);

export type RGSlotComponent = React.ElementType;

export interface RadioGroupSlots {
  root?: RGSlotComponent;
}

export interface RadioGroupSlotProps {
  root?: RGSlotProp<React.HTMLAttributes<HTMLElement>, RadioGroupOwnerState>;
}

/* ---------------------------------------------
 *  Основни пропсове за RadioGroup
 * ------------------------------------------- */
export interface RadioGroupProps {
  value?: any;
  defaultValue?: any;
  name?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: any) => void;

  // ориентация/наследяване
  orientation?: "horizontal" | "vertical";
  overlay?: boolean;
  disableIcon?: boolean;

  // визуални дефолти за децата
  size?: Size | string;
  color?: Color | string;
  variant?: Variant | string;

  // дом/клас
  className?: string;
  component?: React.ElementType;
  sl?: Record<string, any>;

  // състояния
  disabled?: boolean;
  readOnly?: boolean;

  // Slots API
  slots?: RadioGroupSlots;
  slotProps?: RadioGroupSlotProps;

  children?: React.ReactNode;
}

/* ---------------------------------------------
 *  OwnerState – достъпен във slots
 * ------------------------------------------- */
export interface RadioGroupOwnerState {
  disabled: boolean;
  readOnly: boolean;
  orientation: "horizontal" | "vertical";
  size?: RadioGroupProps["size"];
  color?: RadioGroupProps["color"];
  variant?: RadioGroupProps["variant"];
  overlay?: boolean;
  disableIcon?: boolean;
  className?: string;
}
