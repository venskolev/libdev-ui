// src/index.ts

export * from "./Button";
export * from "./AutoSuggest";
export * from "./Input";

export { Box } from "./Box/Box";
export type { BoxProps } from "./Box/Box.types";
export * from "./Flex";
export * from "./Grid";
export * from "./Container/Container";
export type { ContainerProps, ContainerSize, ContainerAlign } from "./Container/Container.types";
export * from "./BoxMotion";

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


// Hooks
export * from "../hooks/useButtonBase";
export * from "../hooks/useInputBase";

export * from "../system/styleEngine";
export * from "../hooks/useStyleResolver";