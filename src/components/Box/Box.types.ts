import type { ElementType, HTMLAttributes, ReactNode } from "react";
import type { SlProp } from "../../system/styleEngine";
import type { CommonLayoutProps } from "../../system/layout.types";

/**
 * Box компонентът е основен контейнер за layout и стилове.
 * Позволява да се задават стилове чрез `sl` пропс, който може да бъде обект, масив или функция.
 * Поддържа responsive стойности и общи layout пропсове като padding, width/height и т.н.
 */
export interface BoxProps
  extends Omit<HTMLAttributes<HTMLElement>, "color">,
    CommonLayoutProps {
  /** HTML елемент или React компонент за root */
  component?: ElementType;
  /** Стилове: обект | масив | функция(ctx)=>обект */
  sl?: SlProp;
  children?: ReactNode;
  /** Забраняваме външен `as` — ползвайте `component` */
  as?: never;
}