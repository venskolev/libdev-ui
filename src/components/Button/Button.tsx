import React from "react";
import { motion } from "framer-motion";
import { StyledButton } from "./Button.styles";
import { CustomButtonProps } from "./Button.types";

export const Button: React.FC<CustomButtonProps> = ({
  children,
  variant = "filled",
  color   = "primary",
  size    = "md",
  radius  = "md",
  sl,
  whileHover,
  whileTap,
  whileFocus,
  initial,
  animate,
  exit,
  ...rest
}) => {
  return (
    <StyledButton
      as={motion.button}
      variant={variant}
      color={color}
      size={size}
      radius={radius}
      style={sl}
      {...{ whileHover, whileTap, whileFocus, initial, animate, exit }}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};
