import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Color, Size, Variant, Radius } from "../common.types";

/* ---------------------------------------------
 *  Мапване на пропсовете към CSS
 * ------------------------------------------- */

// Връща подходяща CSS променлива за цвят според Color пропса
const resolveColorVar = (color?: Color | string) => {
  // Ако е custom string (hex/rgb/var(...)), връщаме директно
  if (!color) return "var(--color-primary, #3b82f6)";
  switch (color) {
    case "primary":
      return "var(--color-primary, #3b82f6)";
    case "secondary":
      return "var(--color-secondary, #64748b)";
    case "success":
      return "var(--color-success, #22c55e)";
    case "danger":
      return "var(--color-danger, #ef4444)";
    case "warning":
      return "var(--color-warning, #f59e0b)";
    case "info":
      return "var(--color-info, #06b6d4)";
    default:
      return color;
  }
};

// Падинг и шрифтови стойности според size
const sizeTokens = (size: Size = "md") => {
  switch (size) {
    case "sm":
      return {
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        paddingY: "0.375rem",
        paddingX: "0.625rem",
        height: "2rem",
        gap: "0.375rem",
        icon: "1rem",
        clearBtn: "1.5rem",
      };
    case "lg":
      return {
        fontSize: "1rem",
        lineHeight: "1.5rem",
        paddingY: "0.625rem",
        paddingX: "0.875rem",
        height: "2.75rem",
        gap: "0.5rem",
        icon: "1.25rem",
        clearBtn: "1.75rem",
      };
    case "md":
    default:
      return {
        fontSize: "0.9375rem",
        lineHeight: "1.375rem",
        paddingY: "0.5rem",
        paddingX: "0.75rem",
        height: "2.5rem",
        gap: "0.5rem",
        icon: "1.125rem",
        clearBtn: "1.625rem",
      };
  }
};

// Радиус според :root променливите и Radius пропса
const radiusVar = (r: Radius = "md") => {
  switch (r) {
    case "sm":
      return "var(--radius-sm, 6px)";
    case "lg":
      return "var(--radius-lg, 14px)";
    case "md":
    default:
      return "var(--radius-md, 10px)";
  }
};

// Общи цветове/граници/фон за инпут
const baseVars = {
  bg: "var(--input-bg, var(--surface-1, #0b0f16))",
  bgFilled: "var(--input-bg-filled, var(--surface-2, #0f1520))",
  text: "var(--input-text, var(--text-primary, #e5e7eb))",
  placeholder: "var(--input-placeholder, var(--text-tertiary, #9ca3af))",
  border: "var(--input-border, var(--border-color, #1f2937))",
  focusRing: "var(--focus-ring, rgba(59,130,246,0.45))",
  disabledBg: "var(--input-bg-disabled, rgba(148,163,184,0.08))",
  disabledText: "var(--input-text-disabled, rgba(148,163,184,0.6))",
  error: "var(--color-danger, #ef4444)",
};

// Стил за вариант (filled | outlined | ghost)
const variantStyles = (variant: Variant = "outlined", color?: Color | string) => {
  const c = resolveColorVar(color);
  switch (variant) {
    case "filled":
      return css`
        background: ${baseVars.bgFilled};
        border: 1px solid ${baseVars.border};
        &:hover {
          border-color: ${c};
        }
        &[data-focused="true"] {
          border-color: ${c};
          box-shadow: 0 0 0 3px ${baseVars.focusRing};
        }
      `;
    case "ghost":
      return css`
        background: transparent;
        border: 1px solid transparent;
        &:hover {
          background: ${baseVars.bgFilled};
          border-color: ${baseVars.border};
        }
        &[data-focused="true"] {
          border-color: ${c};
          box-shadow: 0 0 0 3px ${baseVars.focusRing};
          background: ${baseVars.bg};
        }
      `;
    case "outlined":
    default:
      return css`
        background: ${baseVars.bg};
        border: 1px solid ${baseVars.border};
        &:hover {
          border-color: ${c};
        }
        &[data-focused="true"] {
          border-color: ${c};
          box-shadow: 0 0 0 3px ${baseVars.focusRing};
        }
      `;
  }
};

/* ---------------------------------------------
 *  Styled елементи
 * ------------------------------------------- */

export interface StyledInputRootProps {
  $variant?: Variant;
  $color?: Color | string;
  $size?: Size;
  $radius?: Radius;
  $fullWidth?: boolean;
  $disabled?: boolean;
  $error?: boolean;
  $multiline?: boolean;
  $hasStartAdornment?: boolean;
  $hasEndAdornment?: boolean;
  $isFocused?: boolean;
}

// Контейнерът обгръщащ инпута и адорнментите
export const StyledInputRoot = styled.div<StyledInputRootProps>`
  /* Базова подредба */
  position: relative;
  display: inline-flex;
  align-items: stretch;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  min-width: 10rem;

  /* Визуални настройки */
  color: ${baseVars.text};
  border-radius: ${({ $radius }) => radiusVar($radius)};
  transition: border 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  ${props => variantStyles(props.$variant, props.$color)};

  /* Disabled състояние */
  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.8;
      background: ${baseVars.disabledBg};
      & * {
        color: ${baseVars.disabledText};
      }
    `}

  /* ❗ Error състояние */
  ${({ $error }) =>
    $error &&
    css`
      border-color: ${baseVars.error} !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.25) !important;
    `}

  /* Атрибут за фокус, който се сетва от логиката */
  &[data-focused="true"] {
    /* Стилът идва от variantStyles */
  }
`;

// 📎 Зони за адорнменти (икони/текст преди/след инпута)
export const StyledAdornment = styled.div<{ $position: "start" | "end"; $size?: Size }>`
  /* Подредба и отстояния */
  display: inline-flex;
  align-items: center;
  justify-content: center;

  /* Размер спрямо size */
  ${({ $size }) => {
    const t = sizeTokens($size);
    return css`
      min-width: ${t.icon};
      padding-inline: ${t.gap};
      font-size: ${t.fontSize};
      line-height: ${t.lineHeight};
    `;
  }}

  /* Позиция */
  ${({ $position }) =>
    $position === "start"
      ? css`
          order: 0;
        `
      : css`
          order: 2;
        `}
`;

// Реалният input елемент (за single-line режим)
export const StyledInputElement = styled.input<{
  $size?: Size;
  $hasStartAdornment?: boolean;
  $hasEndAdornment?: boolean;
  $multiline?: boolean;
  $disabled?: boolean;
}>`
  /* Разположение вътре в root */
  order: 1;
  flex: 1 1 auto;
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: ${baseVars.text};
  font-family: inherit;
  appearance: none;

  /* 🌫 Placeholder цвят */
  &::placeholder {
    color: ${baseVars.placeholder};
    opacity: 1;
  }

  /* Размери според size и адорнменти */
  ${({ $size, $hasStartAdornment, $hasEndAdornment }) => {
    const t = sizeTokens($size);
    const padStart = $hasStartAdornment ? "0" : t.paddingX;
    const padEnd = $hasEndAdornment ? "0" : t.paddingX;
    return css`
      font-size: ${t.fontSize};
      line-height: ${t.lineHeight};
      padding: ${t.paddingY} ${padEnd} ${t.paddingY} ${padStart};
      height: ${t.height};
    `;
  }}

  /* Disabled курсор */
  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
    `}
`;

// Textarea за multiline режим
export const StyledTextareaElement = styled.textarea<{
  $size?: Size;
  $hasStartAdornment?: boolean;
  $hasEndAdornment?: boolean;
  $disabled?: boolean;
  $rows?: number;
  $minRows?: number;
  $maxRows?: number;
}>`
  order: 1;
  flex: 1 1 auto;
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: ${baseVars.text};
  font-family: inherit;
  resize: vertical;
  appearance: none;

  &::placeholder {
    color: ${baseVars.placeholder};
    opacity: 1;
  }

  ${({ $size, $hasStartAdornment, $hasEndAdornment }) => {
    const t = sizeTokens($size);
    const padStart = $hasStartAdornment ? "0" : t.paddingX;
    const padEnd = $hasEndAdornment ? "0" : t.paddingX;
    return css`
      font-size: ${t.fontSize};
      line-height: ${t.lineHeight};
      padding: ${t.paddingY} ${padEnd} ${t.paddingY} ${padStart};
      min-height: calc(${t.lineHeight} * 3 + ${t.paddingY} * 2); /* 🧮 разумен минимум */
    `;
  }}

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
    `}
`;

// Бутон за изчистване (X), позициониран в края
export const StyledClearButton = styled.button<{
  $size?: Size;
  $hasEndAdornment?: boolean;
  $disabled?: boolean;
}>`
  /* Позиция и вид */
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: ${({ $hasEndAdornment }) => ($hasEndAdornment ? "2.25rem" : "0.5rem")};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  cursor: pointer;
  background: transparent;

  /* Размери според size */
  ${({ $size }) => {
    const t = sizeTokens($size);
    return css`
      width: ${t.clearBtn};
      height: ${t.clearBtn};
      font-size: ${t.icon};
    `;
  }}

  /* Визия */
  color: ${baseVars.placeholder};
  border-radius: 999px;
  transition: background 0.15s ease, color 0.15s ease, opacity 0.15s ease;

  &:hover {
    background: rgba(148, 163, 184, 0.15);
    color: ${baseVars.text};
  }

  /* Disabled състояние */
  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.5;
      pointer-events: none;
    `}

  /* 🧑‍🦯 Достъпност (фокус) */
  &:focus-visible {
    box-shadow: 0 0 0 2px ${baseVars.focusRing};
  }
`;

// Вътрешен контейнер за правилно отместване при адорнменти
export const StyledField = styled.div<{
  $size?: Size;
  $hasStartAdornment?: boolean;
  $hasEndAdornment?: boolean;
}>`
  position: relative;
  flex: 1 1 auto;
  display: flex;
  align-items: center;

  ${({ $size, $hasStartAdornment, $hasEndAdornment }) => {
    const t = sizeTokens($size);
    const padStart = $hasStartAdornment ? "0" : t.paddingX;
    const padEnd = $hasEndAdornment ? "0" : t.paddingX;
    return css`
      padding-inline-start: ${padStart};
      padding-inline-end: ${padEnd};
      gap: ${t.gap};
    `;
  }}
`;
