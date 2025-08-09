import styled from "@emotion/styled";
import { css } from "@emotion/react";
import type { Variant, Color, Size, Radius } from "../common.types";

type StyledProps = {
  variant?: Variant;               // "filled" | "outlined" | "ghost"
  color?: Color | string;          // глобален цвят или custom string (var(...), #hex, rgb/rgba)
  size?: Size;                     // "sm" | "md" | "lg"
  radius?: Radius;                 // "sm" | "md" | "lg"
};

/* -------------------------------------------------------
 * Помощни резолвери
 * ----------------------------------------------------- */

// Позволяваме custom цветове: var(...), #hex, rgb/rgba(...)
const isCustomColorString = (c: string) =>
  c.startsWith("var(") || c.startsWith("#") || c.startsWith("rgb");

const resolveColorVar = (color?: Color | string) => {
  if (!color) return "var(--color-primary, #3b82f6)";
  if (typeof color === "string") {
    if (isCustomColorString(color)) return color;
    
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
        return "var(--color-info, #0ea5e9)";
      default:
        // ако е друг текст, приемаме че е CSS-съвместим (примерно hsl(...))
        return color;
    }
  }
  // типът е Color (union)
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
      return "var(--color-info, #0ea5e9)";
    default:
      return "var(--color-primary, #3b82f6)";
  }
};

const resolveRadius = (r?: Radius) => {
  switch (r) {
    case "sm":
      return "var(--radius-sm, 6px)";
    case "md":
      return "var(--radius-md, 10px)";
    case "lg":
      return "var(--radius-lg, 14px)";
    default:
      return "var(--radius-md, 10px)";
  }
};

const sizeStyles = (s?: Size) => {
  switch (s) {
    case "sm":
      return css`
        --btn-pad-y: 0.375rem;
        --btn-pad-x: 0.75rem;
        --btn-fs: 0.875rem;
        --btn-min-h: 2rem;
      `;
    case "lg":
      return css`
        --btn-pad-y: 0.75rem;
        --btn-pad-x: 1.25rem;
        --btn-fs: 1rem;
        --btn-min-h: 2.75rem;
      `;
    case "md":
    default:
      return css`
        --btn-pad-y: 0.5rem;
        --btn-pad-x: 1rem;
        --btn-fs: 0.9375rem;
        --btn-min-h: 2.5rem;
      `;
  }
};

const variantStyles = (v: Variant | undefined, colorVar: string) => {
  switch (v) {
    case "outlined":
      return css`
        background: transparent;
        color: ${colorVar};
        border: 1px solid ${colorVar};
        &:hover:not(:disabled) {
          background: rgba(0, 0, 0, 0.04);
        }
        &:active:not(:disabled) {
          background: rgba(0, 0, 0, 0.08);
        }
      `;
    case "ghost":
      return css`
        background: transparent;
        color: ${colorVar};
        border: 1px solid transparent;
        &:hover:not(:disabled) {
          background: rgba(0, 0, 0, 0.04);
        }
        &:active:not(:disabled) {
          background: rgba(0, 0, 0, 0.08);
        }
      `;
    case "filled":
    default:
      return css`
        background: ${colorVar};
        color: var(--btn-oncolor, #ffffff);
        border: 1px solid transparent;
        &:hover:not(:disabled) {
          filter: brightness(0.95);
        }
        &:active:not(:disabled) {
          filter: brightness(0.9);
        }
      `;
  }
};

/* -------------------------------------------------------
 * StyledButton
 * ----------------------------------------------------- */

export const StyledButton = styled.button<StyledProps>`
  /* базови reset-и */
  -webkit-tap-highlight-color: transparent;
  appearance: none;
  border: none;
  outline: none;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  padding: var(--btn-pad-y) var(--btn-pad-x);
  min-height: var(--btn-min-h);
  font-size: var(--btn-fs);
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  border-radius: ${({ radius }) => resolveRadius(radius)};
  transition: transform 0.12s ease, filter 0.12s ease, box-shadow 0.12s ease,
    background-color 0.12s ease, color 0.12s ease, border-color 0.12s ease;

  ${({ size }) => sizeStyles(size)}

  ${({ variant, color }) => variantStyles(variant, resolveColorVar(color))}

  /* disabled & loading */
  &:disabled,
  &[aria-disabled='true'],
  &[data-loading] {
    cursor: not-allowed;
    opacity: 0.6;
    pointer-events: none;
    filter: none;
  }

  /* фокус стилове */
  &:focus {
    outline: none;
  }

  &:focus-visible,
  &[data-focus-visible] {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.35);
  }

  /* натиснато визуално състояние (ако го използвате) */
  &[data-pressed] {
    transform: translateY(0.5px) scale(0.995);
  }
`;
