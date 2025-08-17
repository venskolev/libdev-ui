// LibDev UI – RadioGroup
// Контекстен контейнер за Radio с контролирано/неконтролирано value.

import * as React from "react";
import { compileStyle } from "../../../system/resolveStyle";
import type { RadioGroupProps, RadioGroupOwnerState } from "./RadioGroup.types";
import { Root } from "./RadioGroup.styles";
import { RadioGroupProvider } from "./RadioGroup.utils";

/* ---------------------------------------------
 *  Хелпър за контролиран/неконтролиран state
 * ------------------------------------------- */
function useControllable<T>(controlled: T | undefined, defaultValue: T, onChange?: (v: T) => void) {
  const [inner, setInner] = React.useState<T>(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? (controlled as T) : inner;

  const setValue = React.useCallback((next: T) => {
    if (!isControlled) setInner(next);
    onChange?.(next);
  }, [isControlled, onChange]);

  return [value, setValue] as const;
}

/* ---------------------------------------------
 *  Компонент
 * ------------------------------------------- */
export const RadioGroup = React.forwardRef<HTMLElement, RadioGroupProps>(function RadioGroup(props, ref) {
  const {
    value: valueProp,
    defaultValue,
    onChange,

    name,
    orientation = "vertical",
    overlay = false,
    disableIcon = false,

    size = "md",
    color = "primary",
    variant = "outlined",

    disabled = false,
    readOnly = false,

    className,
    component,
    sl,

    slots,
    slotProps,

    children,
  } = props;

  // Управляваме стойността
  const [value, setValue] = useControllable<any>(valueProp, defaultValue as any, undefined);

  // Събитие от дете (Radio) към групата
  const handleChildChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>, nextValue: any) => {
      setValue(nextValue);
      onChange?.(ev, nextValue);
    },
    [onChange, setValue]
  );

  // Owner state
  const ownerState: RadioGroupOwnerState = {
    disabled,
    readOnly,
    orientation,
    size,
    color,
    variant,
    overlay,
    disableIcon,
    className,
  };

  // Slot или default
  const RootSlot = slots?.root ?? (component ?? "div");
  const rootSlotProps = (typeof slotProps?.root === "function" ? (slotProps!.root as any)(ownerState) : slotProps?.root) ?? {};

  const style = compileStyle(sl);

  return (
    <RadioGroupProvider
      value={{
        name,
        value,
        disabled,
        readOnly,
        size,
        color,
        variant,
        overlay,
        disableIcon,
        onChange: handleChildChange,
      }}
    >
      <Root
        as={RootSlot as any}
        ref={ref as any}
        {...rootSlotProps}
        className={["ld-RadioGroup-root", className, rootSlotProps.className].filter(Boolean).join(" ")}
        $orientation={orientation}
        role="radiogroup"
        aria-disabled={disabled || undefined}
        style={style}
      >
        {children}
      </Root>
    </RadioGroupProvider>
  );
});

export default RadioGroup;
