'use client';
// LibDev UI – Radio
// Компонент с поддържан Slots API, контекст от RadioGroup и motion анимация.

import * as React from "react";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import { css as emCss } from "@emotion/react"; // композираме SerializedStyles
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

/* ---------------------------------------------
 *  Компонент
 * ------------------------------------------- */
export const Radio = React.forwardRef<HTMLElement, RadioProps>(function Radio(props, ref) {
  // Дръпваме контекст от RadioGroup (ако има)
  const group = useRadioGroupContext();

  const {
    // поведение
    checked: checkedProp,
    defaultChecked,
    value,
    name: nameProp,
    required,
    readOnly,
    disabled,
    autoFocus,
    clearOnEscape,

    // визуални
    size = group?.size ?? "md",
    color = group?.color ?? "primary",
    variant = group?.variant ?? "outlined",
    overlay = group?.overlay ?? false,
    disableIcon = group?.disableIcon ?? false,

    // икони
    checkedIcon,
    uncheckedIcon,

    // label node
    label,

    // дом/клас
    className,
    component,
    sl,

    // aria/events
    id,
    inputRef,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
    onClear,

    // slots
    slots,
    slotProps,
  } = props;

  // Краен name идва от групата (ако е налична)
  const name = group?.name ?? nameProp;

  // Ако сме в група → управляваме checked през груповата стойност
  const isInGroup = !!group;
  const isGroupChecked = isInGroup ? group!.value === value : undefined;

  // Генерираме стабилно id за връзка с <label>
  const autoId = React.useId();
  const inputId = id ?? autoId;

  // Хук за toggle-поведение; за Radio override-ваме type по-долу в getInputProps
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
      // При радио – ако сме в група, селектираме стойността в групата
      if (group) {
        group.onChange?.(ev, value);
      } else {
        onChange?.(ev, next);
      }
    },
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
    onClear,
  });

  // Owner state – достъпен за slots
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

  // Slots или дефолтните
  const RootSlot = slots?.root ?? (component ?? "span");
  const ActionSlot = slots?.action ?? "span";
  const RadioSlot = slots?.radio ?? "span";
  const IconSlot = slots?.icon ?? "span";
  const InputSlot = slots?.input ?? "input";
  const LabelSlot = slots?.label ?? "label";

  // Slot props (обект или функция)
  const rootSlotProps = resolveSlotProps(slotProps?.root, ownerState) ?? {};
  const actionSlotProps = resolveSlotProps(slotProps?.action, ownerState) ?? {};
  const radioSlotProps = resolveSlotProps(slotProps?.radio, ownerState) ?? {};
  const iconSlotProps = resolveSlotProps(slotProps?.icon, ownerState) ?? {};
  const inputSlotProps = resolveSlotProps(slotProps?.input, ownerState) ?? {};
  const labelSlotProps = resolveSlotProps(slotProps?.label, ownerState) ?? {};

  // Стилове от системния `sl` проп
  const style = compileStyle(sl);

  // Framer Motion – типизиран transition (TS-safe)
  const dotTransition: Transition = { type: "spring", stiffness: 420, damping: 28 };

  // Ако няма custom checkedIcon и иконите не са изключени → дефолтна точка
  const useDefaultDot = !disableIcon && !checkedIcon;

  // Композираме Emotion стиловете в един SerializedStyles (фиксира TS2322)
  const composedCss = emCss([sizeCss(String(size)), variantCss(String(variant))]);

  // -------------------------------------------------
  // Клик/клавиатура върху Action → клика към <input>
  // -------------------------------------------------
  const clickInput = () => {
    const el = innerRef.current ?? (document.getElementById(inputId) as HTMLInputElement | null);
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
      className={cx("ld-Radio-root", className, rootSlotProps.className)}
      css={composedCss}
      style={style}
      $overlay={overlay}
      aria-disabled={isDisabled || undefined}
    >
      {/* Action зона – поема hover/focus, помещава visual radio, icon и input */}
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
        tabIndex={-1} // Коментар: табващ се е нативният input; Action приема мишка/space/enter
      >
        <RadioVisual
          as={RadioSlot as any}
          {...radioSlotProps}
          className={cx("ld-Radio-radio", radioSlotProps.className)}
        />

        {/* Абсолютен wrapper вътре в Action, който центрира точката 1:1 */}
        {!disableIcon && (
          <AnimatePresence initial={false} mode="wait">
            {checked ? (
              <motion.span
                key="on"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={dotTransition}
                // центрираме независимо от линия/височина на шрифт
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
                  /* Дефолтна точка: ако няма custom checkedIcon → пълним с currentColor */
                  style={{
                    ...(iconSlotProps as any)?.style,
                    ...(useDefaultDot ? { background: "currentColor" } : null),
                  }}
                >
                  {/* Ако има custom икона за checked – показваме я; иначе оставяме точката */}
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
                >
                  {uncheckedIcon /* по подразбиране празно – без точка */}
                </Icon>
              </motion.span>
            )}
          </AnimatePresence>
        )}

        {/* Скрити нативен input; override-ваме type към "radio" */}
        <HiddenInput
          as={InputSlot as any}
          {...getInputProps({ type: "radio", id: inputId })}
          {...inputSlotProps}
          className={cx("ld-Radio-input", inputSlotProps.className)}
          aria-label={label ? undefined : "Radio option"}
        />
      </Action>

      {/* Label, ако е подаден */}
      {label && (
        <Label
          as={LabelSlot as any}
          {...labelSlotProps}
          className={cx("ld-Radio-label", labelSlotProps.className)}
          htmlFor={inputId}
          onClick={(e: any) => {
            // Коментар: позволяваме click върху label да активира input-а
            labelSlotProps.onClick?.(e);
          }}
        >
          {label}
        </Label>
      )}
    </Root>
  );
});

export default Radio;
