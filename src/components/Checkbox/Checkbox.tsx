// src/components/Checkbox/Checkbox.tsx
// LibDev UI – Checkbox component (slots API) using useToggleBase

import React, { forwardRef, useId } from "react";
import { Root, Action, Box, Label, VisuallyHiddenInput } from "./Checkbox.styles";
import type { CheckboxProps, CheckboxOwnerState } from "./Checkbox.types";
import { ownerStateToClasses } from "./Checkbox.utils";
import { useToggleBase } from "../../hooks/useToggleBase";

/* ---------------------------------------------
 * Default simple icons
 * ------------------------------------------- */
const DefaultCheckIcon = () => <span aria-hidden="true">✓</span>;
const DefaultIndeterminateIcon = () => <span aria-hidden="true">–</span>;

export const Checkbox = forwardRef<HTMLElement, CheckboxProps>(function Checkbox(
  {
    // controlled/uncontrolled
    checked,
    defaultChecked,
    onChange,

    // flags
    indeterminate = false,
    disabled = false,
    readOnly = false,
    required = false,
    overlay = false,

    // semantics
    name,
    value,

    // visuals
    color = "neutral",
    size = "md",
    variant = "solid",

    // icons
    checkedIcon,
    indeterminateIcon,
    uncheckedIcon,
    disableIcon = false,

    // label
    label,

    // slots
    slots,
    slotProps,

    // polymorphism / class / styles
    component,
    className,
    sl,

    // rest props to root
    ...rest
  },
  ref
) {
  const htmlId = useId();

  // централен toggle базов хук
  const toggle = useToggleBase({
    checked,
    defaultChecked,
    disabled,
    readOnly,
    required,
    id: htmlId,
    name,
    value,
    ariaChecked: indeterminate ? "mixed" : undefined,
    // Корекция: подаваме само 1 аргумент към външното onChange (React.ChangeEvent)
    onChange: (e) => {
      const patched = Object.assign(e, {
        target: { ...(e.target as any), name, value },
        currentTarget: { ...(e.currentTarget as any), name, value },
      }) as React.ChangeEvent<HTMLInputElement>;
      onChange?.(patched);
    },
  });

  const ownerState: CheckboxOwnerState = {
    checked: toggle.checked,
    indeterminate,
    disabled,
    readOnly,
    size,
    color,
    variant,
    disableIcon,
    overlay,
    focusVisible: toggle.focused, // използваме focused като видим фокус
  };

  const RootSlot = (slots?.root ?? component ?? "span") as any;
  const ActionSlot = (slots?.action ?? Action) as any;
  const BoxSlot = (slots?.checkbox ?? Box) as any;
  const InputSlot = (slots?.input ?? VisuallyHiddenInput) as any;
  const LabelSlot = (slots?.label ?? Label) as any;

  const resolveSlotProps = <P extends object>(
    sp?: ((os: CheckboxOwnerState) => P) | P
  ): P | undefined => (typeof sp === "function" ? (sp as any)(ownerState) : sp);

  const iconNode = indeterminate
    ? indeterminateIcon ?? <DefaultIndeterminateIcon />
    : toggle.checked
    ? checkedIcon ?? <DefaultCheckIcon />
    : uncheckedIcon ?? null;

  const rootClasses = [ownerStateToClasses(ownerState), className].filter(Boolean).join(" ");

  return (
    <Root
      as={RootSlot}
      ref={ref as any}
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : toggle.checked}
      aria-disabled={disabled || undefined}
      aria-readonly={readOnly || undefined}
      aria-required={required || undefined}
      data-indeterminate={indeterminate || undefined}
      tabIndex={disabled ? -1 : 0}
      ownerState={ownerState}
      className={rootClasses}
      sl={sl}
      onKeyDown={(e: any) => {
        // позволяваме Space да тогуълва през native input:
        if ((e.key === " " || e.code === "Space") && !disabled && !readOnly) {
          e.preventDefault();
          // симулираме клик върху input за да се вдигне onChange
          toggle.inputRef.current?.click();
        }
      }}
      {...resolveSlotProps(slotProps?.root)}
      {...rest}
    >
      <ActionSlot
        ownerState={ownerState}
        className="MuiCheckbox-action"
        onClick={() => {
          if (!disabled && !readOnly) toggle.inputRef.current?.click();
        }}
        {...resolveSlotProps(slotProps?.action)}
      >
        {!disableIcon && (
          <BoxSlot
            ownerState={ownerState}
            className="MuiCheckbox-checkbox"
            {...resolveSlotProps(slotProps?.checkbox)}
          >
            {iconNode}
          </BoxSlot>
        )}

        <InputSlot
          className="MuiCheckbox-input"
          // Корекция: позволяваме custom data-* чрез типово прехвърляне
          {...(toggle.getInputProps() as React.InputHTMLAttributes<HTMLInputElement>)}
          {...({ "data-indeterminate": indeterminate || undefined } as any)}
        />
      </ActionSlot>

      {label != null && (
        <LabelSlot htmlFor={htmlId} className="MuiCheckbox-label" {...resolveSlotProps(slotProps?.label)}>
          {label}
        </LabelSlot>
      )}
    </Root>
  );
});

export default Checkbox;
