// src/components/Switch/Switch.tsx
// LibDev UI – Modern Switch with animated border & motion thumb

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Root,
  Track,
  Thumb as ThumbBase,
  Action,
  HiddenInput,
} from "./Switch.styles";
import type { SwitchProps, SwitchOwnerState } from "./Switch.types";
import {
  buildOwnerState,
  buildRootDataAttrs,
  cx,
  defaultSwitchSlots,
  getBorderAnimationStyle,
  getThumbMotionProps,
  renderDecorator,
  resolveSlotProps,
} from "./Switch.utils";
import { useToggleBase } from "../../hooks/useToggleBase";

/* ---------------------------------------------
 *  Помощни функции (локални)
 * ------------------------------------------- */

// Безопасно капитализиране за класове ld-sizeMd, ld-variantFilled и т.н.
const cap = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

// За да анимираме styled Thumb чрез Framer Motion
const MotionThumb = motion(ThumbBase);

/* ---------------------------------------------
 *  Основен компонент
 * ------------------------------------------- */

export const Switch = React.forwardRef<HTMLElement, SwitchProps>(function Switch(
  props,
  ref
) {
  // разпаковка на публичните пропсове
  const {
    // контрол/поведение
    checked,
    defaultChecked,
    disabled,
    readOnly,
    required,
    autoFocus,
    clearOnEscape,

    id,
    name,
    value,
    inputRef,

    // дизайн
    color,
    variant = "filled",
    size = "md",
    radius = "xl",

    // анимиран борд
    borderAnimation = "gradient",
    borderWidth = 2,
    borderColors,
    borderAnimationSpeed,

    // слотове
    component,
    slots,
    slotProps,
    sl,

    // декоратори
    startDecorator,
    endDecorator,

    // събития
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,

    // други
    children,
    ...other
  } = props;

  // логика за toggle (контролирано/неконтролирано, фокус и т.н.)
  const toggle = useToggleBase({
    checked,
    defaultChecked,
    disabled,
    readOnly,
    required,
    autoFocus,
    clearOnEscape,
    id,
    name,
    value,
    inputRef,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
  });

  // ownerState за стилизация и анимации
  const ownerState: SwitchOwnerState = buildOwnerState({
    checked: toggle.checked,
    disabled: toggle.disabled,
    readOnly: toggle.readOnly,
    focusVisible: toggle.focused, // използваме focused като proxy за focus-visible
    variant,
    size,
    color,
    radius,
    borderAnimation,
    borderWidth,
  });

  // данни към root (data-атрибути)
  const dataAttrs = buildRootDataAttrs({
  checked: ownerState.checked,
  disabled: ownerState.disabled,
  readOnly: ownerState.readOnly,
  required: toggle.required,
  focused: toggle.focused,
});

  // слотове и пропсове към тях
  const SLOTS = { ...defaultSwitchSlots, ...(slots || {}) };
  const sp = resolveSlotProps(ownerState, slotProps);

  // класове за root (CSS куки)
  const rootClassName = cx(
    "ld-Switch-root",
    `ld-variant${cap(ownerState.variant)}`,
    `ld-size${cap(ownerState.size)}`,
    typeof ownerState.color === "string" && `ld-color${cap(String(ownerState.color))}`,
    ownerState.checked && "ld-checked",
    ownerState.disabled && "ld-disabled",
    ownerState.readOnly && "ld-readonly",
    ownerState.focusVisible && "ld-focusVisible",
    (sp.root as any)?.className
  );

  // стил за градиента на борда (ако има custom стопове/скорост)
  const borderAnimStyle = getBorderAnimationStyle({
    borderAnimation,
    borderColors,
    borderAnimationSpeed,
    color: color ?? "primary",
  });

  // motion пропсовете за палеца
  const thumbMotion = getThumbMotionProps({ checked: ownerState.checked, size });

  // root element (полиморфен)
  const RootAs: any = Root as any;

  return (
    <RootAs
      as={component ?? SLOTS.root}
      ref={ref}
      ownerState={ownerState}
      className={rootClassName}
      sl={sl}
      style={{ ...(sp.root as any)?.style, ...borderAnimStyle }}
      {...dataAttrs}
      {...other}
      {...(sp.root as any)}
    >
      {/* Start decorator (optional) */}
      {sp.startDecorator !== undefined || startDecorator ? (
        <SLOTS.startDecorator {...(sp.startDecorator as any)}>
          {renderDecorator(startDecorator, ownerState)}
        </SLOTS.startDecorator>
      ) : null}

      {/* Track + Thumb (thumb е motion елемент) */}
      <Track as={SLOTS.track} ownerState={ownerState} {...(sp.track as any)}>
        <MotionThumb
          as={SLOTS.thumb as any}
          ownerState={ownerState}
          {...(sp.thumb as any)}
          {...thumbMotion}
        />
      </Track>

      {/* Action overlay – по-голям hit-area */}
      <Action as={SLOTS.action} ownerState={ownerState} {...(sp.action as any)} />

      {/* Истински input за форми и ARIA */}
      <HiddenInput
        as={SLOTS.input}
        role="switch"
        aria-checked={toggle.checked}
        {...toggle.getInputProps((sp.input as any) || {})}
      />

      {/* End decorator (optional) */}
      {sp.endDecorator !== undefined || endDecorator ? (
        <SLOTS.endDecorator {...(sp.endDecorator as any)}>
          {renderDecorator(endDecorator, ownerState)}
        </SLOTS.endDecorator>
      ) : null}

      {/* Children не се използват типично при Switch, но ги поддържаме */}
      {children}
    </RootAs>
  );
});

Switch.displayName = "Switch";
