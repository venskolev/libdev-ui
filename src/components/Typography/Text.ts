// src/components/Typography/Text.ts
// LibDev UI – Custom React UI components
// Алиас към Typography като Text – без промяна в логиката или типизацията.

import { Typography } from "./Typography";
export type { TypographyProps as TextProps } from "./Typography.types";

// Запазваме 1:1 поведение – Text е просто препратка към Typography
const Text = Typography;

export { Text };
export default Text;
