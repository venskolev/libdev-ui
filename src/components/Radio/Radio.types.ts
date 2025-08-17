import * as React from "react";
import type { Size, Color, Variant } from "../common.types";

/* ---------------------------------------------
 *  Типове за Slots и SlotProps
 * ------------------------------------------- */

// Позволяваме или директен обект с пропсове, или функция (ownerState) => пропсове
export type SlotProp<P, OwnerState> =
  | P
  | ((ownerState: OwnerState) => P);

export type SlotComponent = React.ElementType;

export interface RadioSlots {
  root?: SlotComponent;
  radio?: SlotComponent;
  icon?: SlotComponent;
  action?: SlotComponent;
  input?: SlotComponent;
  label?: SlotComponent;
}

export interface RadioSlotProps {
  root?: SlotProp<React.HTMLAttributes<HTMLElement>, RadioOwnerState>;
  radio?: SlotProp<React.HTMLAttributes<HTMLElement>, RadioOwnerState>;
  icon?: SlotProp<React.HTMLAttributes<HTMLElement>, RadioOwnerState>;
  action?: SlotProp<React.HTMLAttributes<HTMLElement>, RadioOwnerState>;
  input?: SlotProp<React.InputHTMLAttributes<HTMLInputElement>, RadioOwnerState>;
  label?: SlotProp<React.LabelHTMLAttributes<HTMLLabelElement>, RadioOwnerState>;
}

/* ---------------------------------------------
 *  Основни пропсове за Radio
 * ------------------------------------------- */

export interface RadioProps {
  // поведение / стойност
  checked?: boolean;
  defaultChecked?: boolean;
  value?: any;
  name?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  clearOnEscape?: boolean;

  // визуални
  size?: Size | string;          // "sm" | "md" | "lg" | string
  color?: Color | string;        // "primary" | "secondary" | ... | string
  variant?: Variant | string;    // "filled" | "outlined" | "ghost" | string
  overlay?: boolean;
  disableIcon?: boolean;

  // икони
  checkedIcon?: React.ReactNode;
  uncheckedIcon?: React.ReactNode;

  // label node (в края)
  label?: React.ReactNode;

  // дом/клас
  className?: string;
  component?: React.ElementType;

  // системен проп за стилове (през resolveStyle.compileStyle)
  sl?: Record<string, any>;

  // ARIA / refs / събития
  id?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear?: () => void;

  // Slots API
  slots?: RadioSlots;
  slotProps?: RadioSlotProps;
}

/* ---------------------------------------------
 *  OwnerState – достъпен във всички слотове
 * ------------------------------------------- */
export interface RadioOwnerState {
  checked: boolean;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  focused: boolean;
  size: RadioProps["size"];
  color: RadioProps["color"];
  variant: RadioProps["variant"];
  overlay?: boolean;
  disableIcon?: boolean;
  hasLabel: boolean;
  className?: string;
}
