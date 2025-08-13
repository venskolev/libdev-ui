// src/components/Popover/Popover.types.ts
// LibDev UI – Custom React UI components

import type { ReactNode, CSSProperties, HTMLAttributes, ReactElement } from "react";
import type { StyleLike } from "../../system/resolveStyle";

/** Всички 12 позиции, които поддържаме */
export type PopoverPlacement =
  | "top" | "top-start" | "top-end"
  | "bottom" | "bottom-start" | "bottom-end"
  | "left" | "left-start" | "left-end"
  | "right" | "right-start" | "right-end";

/** Контекст стойности – достъпни за всички подкомпоненти */
export interface PopoverContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;

  anchorEl: HTMLElement | null;
  setAnchorEl: (el: HTMLElement | null) => void;

  triggerEl: HTMLElement | null;
  setTriggerEl: (el: HTMLElement | null) => void;

  cardEl: HTMLDivElement | null;
  setCardEl: (el: HTMLDivElement | null) => void;

  placement: PopoverPlacement;
  /** Разстояние между картата и anchor-а (НЕ включва стрелката) */
  offset: number;
  disableOutsideClose: boolean;
}

/** Главен контейнер – не рендерира DOM, подава контекст */
export interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: PopoverPlacement;      // default: "bottom"
  offset?: number;                   // default: 8 (px)
  disableOutsideClose?: boolean;     // default: false
  children: ReactNode;
}

/** Trigger – очаква child елемент (напр. <Button/>) и го клонира */
export interface PopoverTriggerProps {
  asChild?: boolean; // default: true
  children: ReactElement;
  sl?: StyleLike;
}

/** Anchor – може да е self-closing (<PopoverAnchor />) или да увива дете */
export interface PopoverAnchorProps {
  asChild?: boolean;
  children?: ReactElement;
  sl?: StyleLike;
}

/** Карта – реалният popover UI, портал към <body> */
export interface PopoverCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  role?: "dialog" | "tooltip" | "menu" | "listbox";
  className?: string;
  style?: CSSProperties;
  sl?: StyleLike;
  children: ReactNode;
}

/** Close – елемент, който затваря поповъра */
export interface PopoverCloseProps extends HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children?: ReactNode;
}

/** Arrow – отделен елемент за стрелката (триъгълник, без „трапец“) */
export interface PopoverArrowProps extends HTMLAttributes<HTMLDivElement> {
  size?: number; // border size на триъгълника, по default 8
  sl?: StyleLike;
}
