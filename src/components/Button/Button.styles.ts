import styled from "@emotion/styled";
import { Variant, Color, Size, Radius } from "../common.types"; // Assuming these types are defined in common.types.ts

interface StyledProps {
  variant: Variant;
  color: Color;
  size: Size;
  radius: Radius;
}

export const StyledButton = styled.button<StyledProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  line-height: 1;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${({ size }) =>
    size === "sm"
      ? `padding: 4px 10px; font-size: 0.8rem;`
      : size === "lg"
        ? `padding: 12px 22px; font-size: 1.05rem;`
        : `padding: 8px 16px; font-size: 0.9rem;`}

  ${({ radius }) =>
    radius === "sm"
      ? "border-radius: 4px;"
      : radius === "lg"
        ? "border-radius: 12px;"
        : "border-radius: 8px;"}

  ${({ variant, color }) => {
    const palette: Record<Color, string> = {
      primary: "#2563eb",
      secondary: "#6b7280",
      danger: "#dc2626",
      success: "#16a34a",   
      warning: "#f59e0b",   
      info: "#0ea5e9",      
    };

    if (variant === "outlined")
      return `background: transparent; color: ${palette[color]}; border: 2px solid ${palette[color]};`;

    if (variant === "ghost")
      return `background: transparent; color: ${palette[color]};`;

    // filled (по подразбиране)
    return `background: ${palette[color]}; color: #fff;`;
  }}
`;