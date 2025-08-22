// src/index.ts
// LibDev UI – Custom React UI components

export * from "./Button";
export * from "./AutoSuggest";
export * from "./Input";
export * from "./Checkbox";
export * from "./Radio";
export * from "./Radio/RadioGroup";
export * from "./Switch";

export { Box } from "./Box/Box";
export type { BoxProps } from "./Box/Box.types";
export * from "./Flex";
export * from "./Grid";
export * from "./Container/Container";
export type {
  ContainerProps,
  ContainerSize,
  ContainerAlign,
} from "./Container/Container.types";
export * from "./BoxMotion";

export {
  Card,
  CardContent,
  CardActions,
  CardCover,
  CardOverflow,
} from "./Card";
export * from "./RatioBox";

// Typography – включва и алиаса Text.
export { Typography } from "./Typography";
export { Text } from "./Typography/Text";

export type {
  TypographyProps,
  TypographyComponent,
  TextLevel,
  TextVariant,
  TextColor,
  LevelMapping,
  TextWeight,
  TextAlign,
  TextWrap,
} from "./Typography/Typography.types";
export type { TextProps } from "./Typography/Text";

export * from "./Popover";

// Hooks
export * from "../hooks/useButtonBase";
export * from "../hooks/useInputBase";

// System
export * from "../system/styleEngine";
export * from "../hooks/useStyleResolver";

export {
  // Menu,
  MenuRoot,
  MenuTrigger,
  // MenuPortal,
  MenuBackdrop,
  MenuPositioner,
  MenuPopup,
  MenuArrow,
  MenuItem,
  MenuSeparator,
  MenuGroup,
  MenuGroupLabel,
  // MenuRadioGroup,
  // MenuRadioItem,
  // MenuRadioItemIndicator,
  // MenuCheckboxItem,
  // MenuCheckboxItemIndicator,
  // MenuSubmenuRoot,
  // MenuSubmenuTrigger,
} from "./Menu";

export * from "./Menu/Menu.types";