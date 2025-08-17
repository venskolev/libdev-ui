// src/components/Radio/RadioGroup/RadioGroup.utils.ts
// LibDev UI – RadioGroup utilities

import * as React from "react";
import type { RadioGroupProps } from "./RadioGroup.types";

/* ---------------------------------------------
 *  Контекст за синхронизация между RadioGroup и Radio
 * ------------------------------------------- */
export interface RadioGroupContextValue {
  name?: string;
  value?: any;
  disabled?: boolean;
  readOnly?: boolean;
  size?: RadioGroupProps["size"];
  color?: RadioGroupProps["color"];
  variant?: RadioGroupProps["variant"];
  overlay?: boolean;
  disableIcon?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: any) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

export const useRadioGroupContext = () => React.useContext(RadioGroupContext);

export const RadioGroupProvider = RadioGroupContext.Provider;
