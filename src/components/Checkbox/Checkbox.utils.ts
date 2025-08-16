// src/components/Checkbox/Checkbox.utils.ts
// LibDev UI – Checkbox utils

import { useCallback, useRef, useState } from "react";
import type { CheckboxOwnerState } from "./Checkbox.types";

/* ---------------------------------------------
 * Контролирано/неконтролирано състояние за checked
 * ------------------------------------------- */
export function useControllableChecked(
  controlled: boolean | undefined,
  defaultValue: boolean | undefined,
  readOnly?: boolean,
  disabled?: boolean
) {
  // ако е контролирано, не държим вътрешен стейт
  const [uncontrolled, setUncontrolled] = useState<boolean>(!!defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? !!controlled : uncontrolled;

  const set = useCallback(
    (v: boolean) => {
      if (isControlled) return; // извъншният state управлява
      if (readOnly || disabled) return;
      setUncontrolled(v);
    },
    [isControlled, readOnly, disabled]
  );

  return { checked: value, setChecked: set, isControlled };
}

/* ---------------------------------------------
 * Класове за състояния (Joy-подобни)
 * ------------------------------------------- */
export function ownerStateToClasses(os: CheckboxOwnerState) {
  const classes: string[] = ["MuiCheckbox-root"];
  classes.push(`MuiCheckbox-size${capitalize(os.size)}`);
  classes.push(`MuiCheckbox-variant${capitalize(normalizeVariant(os.variant))}`);
  classes.push(`MuiCheckbox-color${capitalize(os.color)}`);
  if (os.checked) classes.push("Mui-checked");
  if (os.disabled) classes.push("Mui-disabled");
  if (os.indeterminate) classes.push("MuiCheckbox-indeterminate");
  if (os.focusVisible) classes.push("Mui-focusVisible");
  return classes.join(" ");
}

/* ---------------------------------------------
 * Помощни за variant mapping
 * ------------------------------------------- */
export function normalizeVariant(v: CheckboxOwnerState["variant"]) {
  // уеднаквяване: Joy: solid|soft|outlined|plain → наши: filled|soft|outlined|ghost
  if (v === "solid") return "solid";
  if (v === "soft") return "soft";
  if (v === "plain") return "plain";
  return v;
}

export function mapVariantToVisual(v: CheckboxOwnerState["variant"]) {
  // централизирано за стилизацията
  switch (v) {
    case "solid":
    case "filled":
      return "solid";
    case "soft":
      return "soft";
    case "plain":
    case "ghost":
      return "plain";
    case "outlined":
      return "outlined";
    default:
      return "plain";
  }
}

/* ---------------------------------------------
 * Фокус видим (keyboard focus) helper
 * ------------------------------------------- */
export function useFocusVisible() {
  // прост флаг: ако focus е чрез клавиатура (tab), маркираме focusVisible
  const hadKeyboardEvent = useRef(false);
  const [focusVisible, setFocusVisible] = useState(false);

  const onKeyDown = () => {
    hadKeyboardEvent.current = true;
  };
  const onMouseDown = () => {
    hadKeyboardEvent.current = false;
  };
  const onFocus = () => {
    setFocusVisible(hadKeyboardEvent.current);
  };
  const onBlur = () => {
    setFocusVisible(false);
  };

  return { focusVisible, onKeyDown, onMouseDown, onFocus, onBlur };
}

/* ---------------------------------------------
 * Дребни помощни
 * ------------------------------------------- */
function capitalize(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}
