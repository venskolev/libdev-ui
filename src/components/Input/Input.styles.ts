import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Color, Size, Variant, Radius } from "../common.types";

/* ---------------------------------------------
 * Мапване на пропсовете към CSS
 * ------------------------------------------- */

const resolveColorVar = (color?: Color | string) => {
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

// Размерни токени 
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

// Радиус
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

// Светли дефолти (бял инпут)
const baseVars = {
  bg: "var(--input-bg, #ffffff)",
  bgFilled: "var(--input-bg-filled, #f7f8fa)",
  text: "var(--input-text, #111827)",
  placeholder: "var(--input-placeholder, #6b7280)",
  border: "var(--input-border, #e5e7eb)",
  focusRing: "var(--focus-ring, rgba(59,130,246,0.35))",
  disabledBg: "var(--input-bg-disabled, #e5e7eb)",
  disabledText: "var(--input-text-disabled, #9ca3af)",
  error: "var(--color-danger, #ef4444)",
};

// Варианти
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
        background: ${baseVars.bg};
        border: 1px solid transparent;
        &:hover {
          border-color: ${baseVars.border};
        }
        &[data-focused="true"] {
          border-color: ${c};
          box-shadow: 0 0 0 3px ${baseVars.focusRing};
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
 * Styled елементи
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

// Root контейнерът носи фона + точната височина
export const StyledInputRoot = styled.div<StyledInputRootProps>`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  min-width: 10rem;
  overflow: hidden; /* важен fix за „черните уши“ */

  /* Минималната височина идва от токена за съответния size */
  ${({ $size }) => {
    const t = sizeTokens($size);
    return css`
      min-height: ${t.height};
    `;
  }}

  color: ${baseVars.text};
  border-radius: ${({ $radius }) => radiusVar($radius)};
  transition: border 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  ${props => variantStyles(props.$variant, props.$color)};

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      background: ${baseVars.disabledBg};
      & * {
        color: ${baseVars.disabledText};
      }
    `}

  ${({ $error }) =>
    $error &&
    css`
      border-color: ${baseVars.error} !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.25) !important;
    `}
`;

// Adornments
export const StyledAdornment = styled.div<{ $position: "start" | "end"; $size?: Size }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  ${({ $size }) => {
    const t = sizeTokens($size);
    return css`
      min-width: ${t.icon};
      padding-inline: ${t.gap};
      font-size: ${t.fontSize};
      line-height: ${t.lineHeight};
    `;
  }}

  ${({ $position }) =>
    $position === "start"
      ? css`
          order: 0;
        `
      : css`
          order: 2;
        `}
`;

// Реалният input – без фиксирана height; фона е прозрачен
export const StyledInputElement = styled.input<{
  $size?: Size;
  $hasStartAdornment?: boolean;
  $hasEndAdornment?: boolean;
  $multiline?: boolean;
  $disabled?: boolean;
}>`
  order: 1;
  flex: 1 1 auto;
  min-width: 0; /* предотвратява разтегляне извън контейнера */
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: ${baseVars.text};
  font-family: inherit;
  appearance: none;
  box-sizing: border-box;

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
      /* без height – височината идва от root:min-height */
    `;
  }}

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
    `}
`;

// Textarea – без фиксирана height; фона е прозрачен
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
  min-width: 0;
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: ${baseVars.text};
  font-family: inherit;
  resize: vertical;
  appearance: none;
  box-sizing: border-box;

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
      /* височината пак идва от root:min-height; textarea си расте при drag */
    `;
  }}

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
    `}
`;

// Clear бутон
export const StyledClearButton = styled.button<{
  $size?: Size;
  $hasEndAdornment?: boolean;
  $disabled?: boolean;
}>`
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

  ${({ $size }) => {
    const t = sizeTokens($size);
    return css`
      width: ${t.clearBtn};
      height: ${t.clearBtn};
      font-size: ${t.icon};
    `;
  }}

  color: ${baseVars.placeholder};
  border-radius: 999px;
  transition: background 0.15s ease, color 0.15s ease, opacity 0.15s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
    color: ${baseVars.text};
  }

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.5;
      pointer-events: none;
    `}

  &:focus-visible {
    box-shadow: 0 0 0 2px ${baseVars.focusRing};
  }
`;

// Вътрешен контейнер – без хор. padding (за да няма двойно)
export const StyledField = styled.div<{
  $size?: Size;
  $hasStartAdornment?: boolean;
  $hasEndAdornment?: boolean;
}>`
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  align-items: center;

  ${({ $size }) => {
    const t = sizeTokens($size);
    return css`
      gap: ${t.gap};
    `;
  }}
`;
