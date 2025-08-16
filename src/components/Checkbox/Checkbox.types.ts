// src/components/Checkbox/Checkbox.types.ts
// LibDev UI – Checkbox types

import type { ReactNode, ElementType, HTMLAttributes, InputHTMLAttributes } from "react";
import type { Size, Color, Variant } from "../common.types";
import type { SlProp } from "../../system/styleEngine";

/* -------------------------------------------------
 * Локални типове за съвместимост с Joy API
 * ------------------------------------------------- */

// Разширяване на цветовете с "neutral", за Joy-подобно API
export type CheckboxColor = Color | "neutral";

// Поддържаме и нашите, и Joy варианти; мапваме в стиловете
export type CheckboxVariant = Variant | "solid" | "soft" | "plain" | "outlined";

// Слотовете на компонента
export interface CheckboxSlots {
  root?: ElementType;
  checkbox?: ElementType;
  action?: ElementType;
  input?: ElementType;
  label?: ElementType;
}

// Пропсове за всеки слот; приемат или обект, или функция (ownerState) => props
export type SlotPropsFn<P, S> = (ownerState: S) => P;
export type SlotProps<P, S> = P | SlotPropsFn<P, S>;

export interface CheckboxOwnerState {
  checked: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  indeterminate?: boolean;
  size: Size;
  color: CheckboxColor;
  variant: CheckboxVariant;
  disableIcon?: boolean;
  overlay?: boolean;
  focusVisible?: boolean;
}

// Публични пропсове
export interface CheckboxProps extends Omit<HTMLAttributes<HTMLElement>, "onChange" | "color"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  // визуални/логически пропсове
  indeterminate?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  overlay?: boolean;
  name?: string;
  value?: string | number | Array<string>;
  color?: CheckboxColor;
  size?: Size; // "sm" | "md" | "lg"
  variant?: CheckboxVariant;

  // икони
  checkedIcon?: ReactNode;
  indeterminateIcon?: ReactNode;
  uncheckedIcon?: ReactNode;
  disableIcon?: boolean;

  // label за показване до чекбокса
  label?: ReactNode;

  // Полиморфизъм
  component?: ElementType;

  // Slots API
  slots?: CheckboxSlots;
  slotProps?: {
    root?: SlotProps<HTMLAttributes<HTMLElement>, CheckboxOwnerState>;
    checkbox?: SlotProps<HTMLAttributes<HTMLElement>, CheckboxOwnerState>;
    action?: SlotProps<HTMLAttributes<HTMLElement>, CheckboxOwnerState>;
    input?: SlotProps<InputHTMLAttributes<HTMLInputElement>, CheckboxOwnerState>;
    label?: SlotProps<HTMLAttributes<HTMLLabelElement>, CheckboxOwnerState>;
  };

  // System prop за стил-овъррайди
  sl?: SlProp;

  // Клас за root за външно хвърляне на стилове
  className?: string;

  // Forwarded ref стига до root елемента
  ref?: any;
}
