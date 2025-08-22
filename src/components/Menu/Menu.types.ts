import type { CSSProperties, ElementType, HTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from "react";
import type { SlProp } from "../../system/styleEngine";
import type { CommonLayoutProps } from "../../system/layout.types";

export type Size = "sm" | "md" | "lg" | (string & {});
export type Variant = "outlined" | "plain" | "soft" | "solid" | (string & {});
export type Color =
  | "danger"
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | (string & {});

export type DataValue = string | number | boolean;

export type MenuOwnerState = {
  open: boolean;
  size?: Size;
  variant?: Variant;
  color?: Color;
};

export type SlotPropsFn<P> = (ownerState: MenuOwnerState) => P;

export type MenuRootProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> &
  CommonLayoutProps & {
    actions?: Ref<MenuActions>;
    open?: boolean;
    defaultOpen?: boolean;
    onClose?: () => void;

    keepMounted?: boolean;
    disablePortal?: boolean;
    invertedColors?: boolean;
    modifiers?: any[];

    size?: Size;
    variant?: Variant;
    color?: Color;

    slots?: { root?: ElementType };
    slotProps?: { root?: SlotPropsFn<any> | Record<string, any> };

    sl?: SlProp;
    style?: CSSProperties;
  };

export type MenuActions = {
  highlightFirstItem(): void;
  highlightLastItem(): void;
};

export type MenuTriggerProps = (ButtonHTMLAttributes<HTMLButtonElement> | HTMLAttributes<HTMLDivElement>) &
  CommonLayoutProps & {
    as?: ElementType; // 'button' | 'div' | custom
    sl?: SlProp;
  };

export type PositionSide = "top" | "bottom" | "left" | "right";
export type PositionAlign = "start" | "center" | "end";

export type MenuPositionerProps = HTMLAttributes<HTMLDivElement> &
  CommonLayoutProps & {
    side?: PositionSide;
    align?: PositionAlign;
    offset?: number;
    sl?: SlProp;
  };

export type MenuPopupProps = HTMLAttributes<HTMLDivElement> &
  CommonLayoutProps & {
    id?: string;
    size?: Size;
    variant?: Variant;
    color?: Color;
    sl?: SlProp;
  };

export type MenuBackdropProps = HTMLAttributes<HTMLDivElement> &
  CommonLayoutProps & {
    sl?: SlProp;
  };

export type MenuItemProps = HTMLAttributes<HTMLDivElement> &
  CommonLayoutProps & {
    disabled?: boolean;
    sl?: SlProp;
  };

export type MenuSeparatorProps = HTMLAttributes<HTMLDivElement> &
  CommonLayoutProps & {
    sl?: SlProp;
  };

export type MenuGroupProps = HTMLAttributes<HTMLDivElement> &
  CommonLayoutProps & {
    sl?: SlProp;
  };

export type MenuGroupLabelProps = HTMLAttributes<HTMLDivElement> &
  CommonLayoutProps & {
    sl?: SlProp;
  };
