'use client';

import * as React from "react";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import { css as emCss } from "@emotion/react";
import { compileStyle } from "../../system/resolveStyle";
import type { RadioProps, RadioOwnerState } from "./Radio.types";
import {
  Root,
  Action,
  RadioVisual,
  Icon,
  HiddenInput,
  Label,
  sizeCss,
  variantCss,
} from "./Radio.styles";
import { resolveSlotProps, cx } from "./Radio.utils";
import { useToggleBase } from "../../hooks/useToggleBase";
import { useRadioGroupContext } from "./RadioGroup/RadioGroup.utils";

export const Radio = React.forwardRef<HTMLElement, RadioProps>(function Radio(
  props,
  ref
) {
  const group = useRadioGroupContext();

  const {
    checked: checkedProp,
    defaultChecked,
    value,
    name: nameProp,
    required,
    readOnly,
    disabled,
    autoFocus,
    clearOnEscape,

    size = group?.size ?? "md",
    color = group?.color ?? "primary",
    variant = group?.variant ?? "outlined",
    overlay = group?.overlay ?? false,
    disableIcon = group?.disableIcon ?? false,

    checkedIcon,
    uncheckedIcon,

    label,

    className,
    component,
    sl,

    id,
    inputRef,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
    onClear,

    slots,
    slotProps,
  } = props;

  const name = group?.name ?? nameProp;
  const isInGroup = !!group;
  const isGroupChecked = isInGroup ? group!.value === value : undefined;

  const autoId = React.useId();
  const inputId = id ?? autoId;

  const {
    checked,
    focused,
    disabled: isDisabled,
    readOnly: isReadOnly,
    required: isRequired,
    inputRef: innerRef,
    getRootProps,
    getInputProps,
  } = useToggleBase({
    checked: isInGroup ? isGroupChecked : checkedProp,
    defaultChecked,
    disabled: disabled ?? group?.disabled,
    readOnly: readOnly ?? group?.readOnly,
    required,
    autoFocus,
    clearOnEscape,
    id: inputId,
    name,
    value,
    inputRef,
    onChange: (ev, next) => {
      if (group) group.onChange?.(ev, value);
      else onChange?.(ev, next);
    },
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
    onClear,
  });

  const ownerState: RadioOwnerState = {
    checked,
    disabled: !!isDisabled,
    readOnly: !!isReadOnly,
    required: !!isRequired,
    focused,
    size,
    color,
    variant,
    overlay,
    disableIcon,
    hasLabel: !!label,
    className,
  };

  const RootSlot = slots?.root ?? component ?? "span";
  const ActionSlot = slots?.action ?? "span";
  const RadioSlot = slots?.radio ?? "span";
  const IconSlot = slots?.icon ?? "span";
  const InputSlot = slots?.input ?? "input";
  const LabelSlot = slots?.label ?? "label";

  const rootSlotProps = resolveSlotProps(slotProps?.root, ownerState) ?? {};
  const actionSlotProps = resolveSlotProps(slotProps?.action, ownerState) ?? {};
  const radioSlotProps = resolveSlotProps(slotProps?.radio, ownerState) ?? {};
  const iconSlotProps = resolveSlotProps(slotProps?.icon, ownerState) ?? {};
  const inputSlotProps = resolveSlotProps(slotProps?.input, ownerState) ?? {};
  const labelSlotProps = resolveSlotProps(slotProps?.label, ownerState) ?? {};

  const style = compileStyle(sl);

  const dotTransition: Transition = { type: "spring", stiffness: 420, damping: 28 };
  const useDefaultDot = !disableIcon && !checkedIcon;

  const composedCss = emCss([sizeCss(String(size)), variantCss(String(variant))]);

  const clickInput = () => {
    const el =
      innerRef.current ??
      (document.getElementById(inputId) as HTMLInputElement | null);
    el?.focus();
    el?.click();
  };
  const handleActionClick = (e: React.MouseEvent) => {
    if (isDisabled || isReadOnly) return;
    e.preventDefault();
    clickInput();
  };
  const handleActionKeyDown = (e: React.KeyboardEvent) => {
    if (isDisabled || isReadOnly) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      clickInput();
    }
  };

  return (
    <Root
      as={RootSlot as any}
      ref={ref as any}
      {...rootSlotProps}
      {...getRootProps()}
      data-checked={checked ? "" : undefined}
      data-variant={String(variant)}
      data-color={String(color)}
      className={cx("ld-Radio-root", className, rootSlotProps.className)}
      css={composedCss}
      style={{
        ...style,
        ["--ld-radio-color" as any]: `var(--ld-color-${String(color)})`,
      }}
      $overlay={overlay}
      aria-disabled={isDisabled || undefined}
    >
      <Action
        as={ActionSlot as any}
        {...actionSlotProps}
        className={cx("ld-Radio-action", actionSlotProps.className)}
        onClick={(e) => {
          actionSlotProps.onClick?.(e as any);
          handleActionClick(e);
        }}
        onKeyDown={(e) => {
          actionSlotProps.onKeyDown?.(e as any);
          handleActionKeyDown(e);
        }}
        role="radio"
        aria-checked={checked}
        tabIndex={-1}
      >
        <RadioVisual
          as={RadioSlot as any}
          {...radioSlotProps}
          className={cx("ld-Radio-radio", radioSlotProps.className)}
        />

        {!disableIcon && (
          <AnimatePresence initial={false} mode="wait">
            {checked ? (
              <motion.span
                key="on"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={dotTransition}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <Icon
                  as={IconSlot as any}
                  {...iconSlotProps}
                  className={cx("ld-Radio-icon", iconSlotProps.className)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...(iconSlotProps as any)?.style,
                    ...(useDefaultDot
                      ? {
                          borderRadius: "50%",
                          // контрастна точка при solid
                          background: variant === "solid" ? "#fff" : "currentColor",
                        }
                      : null),
                  }}
                >
                  {checkedIcon}
                </Icon>
              </motion.span>
            ) : (
              <motion.span
                key="off"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={dotTransition}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <Icon
                  as={IconSlot as any}
                  {...iconSlotProps}
                  className={cx("ld-Radio-icon", iconSlotProps.className)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...(iconSlotProps as any)?.style,
                  }}
                >
                  {uncheckedIcon}
                </Icon>
              </motion.span>
            )}
          </AnimatePresence>
        )}

        <HiddenInput
          as={InputSlot as any}
          {...getInputProps({ type: "radio", id: inputId })}
          {...inputSlotProps}
          className={cx("ld-Radio-input", inputSlotProps.className)}
          aria-label={label ? undefined : "Radio option"}
        />
      </Action>

      {label && (
        <Label
          as={LabelSlot as any}
          {...labelSlotProps}
          className={cx("ld-Radio-label", labelSlotProps.className)}
          htmlFor={inputId}
        >
          {label}
        </Label>
      )}
    </Root>
  );
});

export default Radio;
