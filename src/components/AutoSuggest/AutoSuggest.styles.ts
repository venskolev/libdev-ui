import styled from "@emotion/styled";
import { Size } from "../common.types";

const sizeMap: Record<Size, string> = {
  sm: "32px",
  md: "40px",
  lg: "48px",
};

export const Wrapper = styled("div")`
  position: relative;
  width: 100%;
  font-family: inherit;
`;

export const InputWrapper = styled("div")<{
  size?: Size;
  focused?: boolean;
  disabled?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  height: ${({ size = "md" }) => sizeMap[size]};
  border-radius: var(--radius-md, 0.5rem);
  border: 1px solid
    ${({ focused }) => (focused ? "var(--color-primary, #5b9df9)" : "#ccc")};
  background-color: var(--color-input-bg, #fff);
  transition: border 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
  padding: 0 0.5rem;
  gap: 0.5rem;
  box-sizing: border-box;

  ${({ disabled }) =>
    disabled
      ? `
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--color-input-bg-disabled, #f7f7f7);
  `
      : `
    &:hover {
      border-color: var(--color-primary, #5b9df9);
    }
    &:focus-within {
      border-color: var(--color-primary, #5b9df9);
      box-shadow: 0 0 0 3px rgba(91, 157, 249, 0.15);
    }
  `}
`;

export const StyledInput = styled("input")`
  flex: 1;
  font-size: 1rem;
  border: none;
  outline: none;
  background-color: var(--color-input-bg, #fff);
  color: var(--color-input-text, #000);
  font-family: inherit;
  min-width: 0; /* prevent overflow in flex */
`;

export const InlineCompletion = styled("span")`
  color: var(--color-text-secondary, #999);
  font-size: 1rem;
  white-space: nowrap;
  opacity: 0.6;
  pointer-events: none;
`;

export const ClearButton = styled("button")`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  font-size: 1rem;
  color: #888;
  cursor: pointer;
  padding: 0;
  margin: 0;
  line-height: 1;

  &:hover {
    color: var(--color-primary, #3f51b5);
  }
  &:focus {
    outline: 2px solid var(--color-primary, #3f51b5);
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

export const StyledPopupList = styled("ul")<{ open: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 1000;
  max-height: 220px;
  overflow-y: auto;
  list-style: none;
  padding: 0.25rem 0;
  margin: 0;
  border: 1px solid #ddd;
  border-radius: var(--radius-sm, 6px);
  background-color: var(--color-bg, #fff);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  display: ${({ open }) => (open ? "block" : "none")};
`;

export const StyledPopupItem = styled("li")<{
  highlighted?: boolean;
  selected?: boolean;
}>`
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  border-radius: var(--radius-sm, 6px);
  background-color: ${({ highlighted }) =>
    highlighted ? "var(--color-primary-bg-hover, #f5f5f5)" : "transparent"};
  color: ${({ selected }) =>
    selected ? "var(--color-primary, #1976d2)" : "var(--color-text, #000)"};
  font-weight: ${({ selected }) => (selected ? 500 : 400)};

  &:hover {
    background-color: var(--color-primary-bg-hover, #f0f0f0);
  }
`;
