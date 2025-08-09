import React from "react";
import { motion } from "framer-motion";
import { StyledButton } from "./Button.styles";
import { CustomButtonProps } from "./Button.types";
import { useButtonBase } from "../../hooks/useButtonBase";

export const Button: React.FC<CustomButtonProps> = ({
  children,
  variant = "filled",
  color = "primary",
  size = "md",
  radius = "md",
  sl,
  // поведение
  disabled = false,
  loading = false,
  preventFocusOnPress = false,
  autoFocus = false,
  // toggle
  toggleable,
  pressed,
  defaultPressed,
  onPressedChange,
  // Motion (временно тук; по-късно ще изнесем в ButtonMotion)
  whileHover,
  whileTap,
  whileFocus,
  initial,
  animate,
  exit,
  // останалите DOM пропсове (id, name, value, onClick и т.н.)
  ...dom
}) => {
  const { getRootProps, getButtonProps } = useButtonBase({
    disabled,
    loading,
    autoFocus,
    preventFocusOnPress,
    toggleable,
    pressed,
    defaultPressed,
    onPressedChange,
    // ID/имена/стойности/handlers идват от ...dom в getButtonProps
  });

  return (
    <StyledButton
      as={motion.button}
      variant={variant}
      color={color}
      size={size}
      radius={radius}
      style={sl}
      {...getRootProps()}
      {...getButtonProps({
        ...dom,
        whileHover,
        whileTap,
        whileFocus,
        initial,
        animate,
        exit,
      } as any)} // motion props не са стандартни DOM → cast за Styled(motion.button)
    >
      {children}
    </StyledButton>
  );
};
