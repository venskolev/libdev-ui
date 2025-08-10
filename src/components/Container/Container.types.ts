// src/components/Container/Container.types.ts
// LibDev UI – Custom React UI components

import type React from "react";
import type { CommonLayoutProps } from "../../system/layout.types";
import type { Responsive } from "../common.types"; // <-- Използваме глобалния тип

// Допустими размери на контейнера
export type ContainerSize = "1" | "2" | "3" | "4";

// Подравняване по хоризонтала
export type ContainerAlign = "left" | "center" | "right";

export interface ContainerProps
  extends CommonLayoutProps,
    React.HTMLAttributes<HTMLDivElement> {
  /** Полиморфен елемент/компонент */
  as?: React.ElementType;

  /** Максимална ширина на контейнера */
  size?: Responsive<ContainerSize>;

  /** Подравняване (left/center/right) чрез автоматични margin-и */
  align?: Responsive<ContainerAlign>;

  /** Рендер без wrapper: използва типа на child за `as`, запазва child props */
  asChild?: boolean;

  /** Деца на компонента */
  children?: React.ReactNode;
}
