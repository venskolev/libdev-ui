// src/components/Box/Box.types.ts

import type { ElementType, HTMLAttributes, ReactNode } from "react";
import type { SlProp } from "../../system/styleEngine";

export interface BoxProps extends Omit<HTMLAttributes<HTMLElement>, "color"> {
  /** HTML елемент или React компонент за root */
  component?: ElementType;
  /** Стилове: обект | масив | функция(ctx)=>обект */
  sl?: SlProp;
  children?: ReactNode;
   /** Забраняваме външен `as` — ползвайте `component` */
  as?: never;
}
