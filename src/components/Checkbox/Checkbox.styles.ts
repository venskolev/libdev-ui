// src/components/Checkbox/Checkbox.styles.ts
// LibDev UI – Checkbox styles (Emotion)

import styled from "@emotion/styled";
import { css } from "@emotion/react";
import {
  resolveSl,
  defaultTheme,
  type LibDevTheme,
  type SlProp,
} from "../../system/styleEngine";
import type { CheckboxOwnerState } from "./Checkbox.types";
import { mapVariantToVisual } from "./Checkbox.utils";

/* ---------------------------------------------
 * Визуално скрит input, но достъпен за screen readers
 * ------------------------------------------- */
export const VisuallyHiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
  margin: 0;
  border: 0;
  padding: 0;
`;

/* ---------------------------------------------
 * Размери
 * ------------------------------------------- */
const sizeVars = (os: CheckboxOwnerState) => {
  const map = {
    sm: { box: 18, radius: 6, glyph: 12, gap: 8 },
    md: { box: 20, radius: 7, glyph: 14, gap: 10 },
    lg: { box: 24, radius: 8, glyph: 16, gap: 12 },
  } as const;

  const s = map[os.size];
  return css`
    --_cb-size: ${s.box}px;
    --_cb-radius: ${s.radius}px;
    --_cb-gap: ${s.gap}px;
    --_cb-glyph-size: ${s.glyph}px;
    --_cb-border-width: 2px;
    --_cb-focus-ring: 2px;
  `;
};

/* ---------------------------------------------
 * Цветови променливи (без експериментални функции)
 * - Checked/indeterminate: винаги solid
 * - Unchecked: меки RGBA фонове
 * ------------------------------------------- */
const colorVars = (os: CheckboxOwnerState) => {
  const v = mapVariantToVisual(os.variant);

  const palette = {
    border: "var(--ld-color-border, #2e2e31ff)",
    text: "var(--ld-color-text, #e5e7eb)",

    primary: "var(--ld-color-primary, #3b82f6)",
    success: "var(--ld-color-success, #22c55e)",
    warning: "var(--ld-color-warning, #f59e0b)",
    danger: "var(--ld-color-danger, #ef4444)",
    secondary: "var(--ld-color-secondary, #a1a1aa)",
    info: "var(--ld-color-info, #06b6d4)",
    neutral: "var(--ld-color-neutral, #9ca3af)",
  } as const;

  const mix = (hex: string, a: number) => {
    // Коментар: прости RGBA soft тонове
    // hex очакваме като #rrggbb
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!m) return `rgba(255,255,255,${a})`;
    const r = parseInt(m[1], 16);
    const g = parseInt(m[2], 16);
    const b = parseInt(m[3], 16);
    return `rgba(${r},${g},${b},${a})`;
  };

  const by = (c: CheckboxOwnerState["color"]) => {
    const main =
      c === "primary"
        ? palette.primary
        : c === "success"
        ? palette.success
        : c === "warning"
        ? palette.warning
        : c === "danger"
        ? palette.danger
        : c === "secondary"
        ? palette.secondary
        : c === "info"
        ? palette.info
        : palette.neutral;

    return {
      main,
      soft: mix(main.replace("var(", "#").split(",")[1] ? "#9ca3af" : main, 0.18), // защитен fallback
      hover: mix(main.replace("var(", "#").split(",")[1] ? "#9ca3af" : main, 0.26),
      active: mix(main.replace("var(", "#").split(",")[1] ? "#9ca3af" : main, 0.34),
    };
  };

  const C = by(os.color);

  // Контраст за solid
  const solidFg = os.color === "warning" || os.color === "secondary" ? "#111" : "#fff";

  // Бордер за outlined/unchecked
  const outlinedBorder = os.color === "neutral" ? palette.border : "rgba(255,255,255,.22)";

  return css`
    --_cb-text: ${palette.text};
    --_cb-border: ${outlinedBorder};

    --_cb-softBg: ${C.soft};
    --_cb-softHover: ${C.hover};
    --_cb-softActive: ${C.active};

    --_cb-solidBg: ${C.main};
    --_cb-solidFg: ${solidFg};

    --_cb-variant: ${v};
  `;
};

/* ---------------------------------------------
 * Безопасно „свеждане“ на Emotion theme към LibDevTheme
 * ------------------------------------------- */
const asLibDevTheme = (t: unknown): LibDevTheme => {
  const candidate = t as Partial<LibDevTheme> | undefined;
  if (candidate && candidate.breakpoints && candidate.spacing) return candidate as LibDevTheme;
  return defaultTheme;
};

/* ---------------------------------------------
 * Root
 * ------------------------------------------- */
export const Root = styled.span<{
  ownerState: CheckboxOwnerState;
  sl?: SlProp;
}>(({ ownerState, sl, theme }) => {
  const os = ownerState;

  const overlayCss = os.overlay
    ? css`
        position: initial;
      `
    : css`
        position: relative;
      `;

  const sys = sl ? resolveSl(sl, asLibDevTheme(theme)) : undefined;

  return css`
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    gap: var(--_cb-gap);
    ${overlayCss}
    ${sizeVars(os)}
    ${colorVars(os)}

    &.Mui-disabled {
      opacity: 0.6;
      pointer-events: none;
      filter: grayscale(0.1);
    }
    &.Mui-focusVisible {
      outline: none;
      box-shadow: 0 0 0 var(--_cb-focus-ring) rgba(255, 255, 255, 0.22);
      border-radius: calc(var(--_cb-radius) + 2px);
    }

    ${sys as any}
  `;
});

/* ---------------------------------------------
 * Action – hover поведение и overlay
 * ------------------------------------------- */
export const Action = styled.span<{ ownerState: CheckboxOwnerState }>(
  ({ ownerState }) => {
    const os = ownerState;

    const selectedHighlight =
      os.disableIcon && (os.checked || os.indeterminate)
        ? css`
            background: var(--_cb-solidBg) !important;
            box-shadow: inset 0 0 0 var(--_cb-border-width) rgba(0, 0, 0, 0.2);
            color: var(--_cb-solidFg) !important;
          `
        : null;

    const overlay = os.overlay
      ? css`
          position: absolute;
          inset: 0;
          border-radius: var(--_cb-radius);
        `
      : css`
          position: relative;
        `;

    return css`
    cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--_cb-size);
      height: var(--_cb-size);
      border-radius: var(--_cb-radius);
      transition: background-color 0.15s ease, transform 0.08s ease, box-shadow 0.15s ease;
      ${overlay}

      &:hover {
        background: var(--_cb-softHover);
      }
      &:active {
        background: var(--_cb-softActive);
        transform: translateY(0.5px);
      }

      ${selectedHighlight}
    `;
  }
);

/* ---------------------------------------------
 * Box – визуалната кутия
 * ------------------------------------------- */
export const Box = styled.span<{ ownerState: CheckboxOwnerState }>(
  ({ ownerState }) => {
    const os = ownerState;
    const v = mapVariantToVisual(os.variant);

    const common = css`
    cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--_cb-size);
      height: var(--_cb-size);
      border-radius: var(--_cb-radius);
      box-sizing: border-box;
      line-height: 1;
      user-select: none;
      transition:
        background-color 120ms ease,
        border-color 120ms ease,
        color 120ms ease,
        transform 120ms ease,
        box-shadow 120ms ease;
      font-size: var(--_cb-glyph-size);
      color: transparent; /* скриваме иконата в unchecked */
    `;

    const uncheckedByVariant =
      v === "outlined"
        ? css`
            border: var(--_cb-border-width) solid var(--_cb-border);
            background: rgba(255, 255, 255, 0.98);
            color: var(--_cb-text);
          `
        : v === "soft"
        ? css`
            border: var(--_cb-border-width) solid rgba(0, 0, 0, 0.49);
            background: rgba(255, 255, 255, 0.98);
            color: var(--_cb-text);
          `
        : v === "solid"
        ? css`
            border: var(--_cb-border-width) solid rgba(0, 0, 0, 0.49);
            background: rgba(255, 255, 255, 0.98);
            color: var(--_cb-text);
          `
        : css`
            /* plain */
            border: var(--_cb-border-width) solid rgba(116, 116, 116, 0.47);
            background: rgba(255, 255, 255, 0.98);
            color: var(--_cb-text);
          `;

    // selected – абсолютно твърди стойности, за да няма тъмни/невидими глифи
    const selected = css`
      background: var(--_cb-solidBg) !important;
      color: var(--_cb-solidFg) !important;
      border: var(--_cb-border-width) solid transparent !important;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08) inset;
    `;

    const stateStyles = os.checked || os.indeterminate ? selected : uncheckedByVariant;

    return css`
      ${common}
      ${stateStyles}
    `;
  }
);

/* ---------------------------------------------
 * Label
 * ------------------------------------------- */
export const Label = styled.label`
cursor: pointer;
  display: inline-flex;
  align-items: center;
  line-height: 1.35;
  font-size: 0.95rem;
  letter-spacing: 0.2px;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
`;
