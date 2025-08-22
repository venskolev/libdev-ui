import * as React from "react";
import * as ReactDOM from "react-dom";

import {
  Backdrop,
  Positioner,
  Popup,
  Arrow,
  Item,
  Separator,
  Group,
  GroupLabel,
  TriggerBtn,
  TriggerDiv,
} from "./Menu.styles";

import type { SlProp, LibDevTheme } from "../../system/styleEngine";
import { useButtonBase } from "../../hooks/useButtonBase";
import { useToggleBase } from "../../hooks/useToggleBase";

// ✅ новите утилити (извадени от файла)
import { toDataSet, assignRef, useControlled } from "./Menu.utils";

// ------------------------------------------------------------------
// Типове, близки до Joy UI
// ------------------------------------------------------------------
export type Size = "sm" | "md" | "lg" | (string & {});
export type Variant = "outlined" | "plain" | "soft" | "solid" | (string & {});
export type Color =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | (string & {});

export type MenuRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;

  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  offset?: number;

  disablePortal?: boolean;
  keepMounted?: boolean;

  size?: Size;
  variant?: Variant;
  color?: Color;

  sl?: SlProp;

  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

type MenuCtx = {
  open: boolean;
  setOpen(v: boolean): void;
  anchorRef: React.RefObject<HTMLElement>;
  popupRef: React.RefObject<HTMLElement>;
  side: NonNullable<MenuRootProps["side"]>;
  align: NonNullable<MenuRootProps["align"]>;
  offset: number;
  size?: Size;
  variant?: Variant;
  color?: Color;
  rootSl?: SlProp;
};

const Ctx = React.createContext<MenuCtx | null>(null);
function useMenuCtx() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("Menu components must be used inside <MenuRoot>.");
  return ctx;
}

// ------------------------------------------------------------------
// Root
// ------------------------------------------------------------------
export function MenuRoot(props: MenuRootProps) {
  const {
    children,
    open: openProp,
    defaultOpen,
    onClose,
    onOpenChange,
    side = "bottom",
    align = "start",
    offset = 6,
    disablePortal = false,
    keepMounted = false,
    size = "md",
    variant = "outlined",
    color = "neutral",
    sl,
    className,
    style,
  } = props;

  const [open, setUncontrolled] = useControlled(openProp, defaultOpen);
  const setOpen = React.useCallback(
    (v: boolean) => {
      setUncontrolled(v);
      onOpenChange?.(v);
      if (!v) onClose?.();
    },
    [onClose, onOpenChange, setUncontrolled]
  );

  const anchorRef = React.useRef<HTMLElement>(null);
  const popupRef = React.useRef<HTMLElement>(null);

  // Close on outside click & Escape
  React.useEffect(() => {
    if (!open) return;

    const onMouseDown = (e: MouseEvent) => {
      const a = anchorRef.current;
      const p = popupRef.current;
      const t = e.target as Node;
      if (a?.contains(t) || p?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown, true);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onMouseDown, true);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open, setOpen]);

  // mirror в useToggleBase (не стилове, само състояние)
  useToggleBase({
    checked: open,
    onChange: (_e, next) => setOpen(next),
  });

  const ctx: MenuCtx = {
    open,
    setOpen,
    anchorRef,
    popupRef,
    side,
    align,
    offset,
    size,
    variant,
    color,
    rootSl: sl,
  };

  const content = (
    <Ctx.Provider value={ctx}>
      <div className={className} style={style} {...toDataSet({ expanded: open })}>
        {children}
      </div>
    </Ctx.Provider>
  );

  if (disablePortal) return content;
  return content; // самият Portal е само за popup-а (виж MenuPortal)
}

// ------------------------------------------------------------------
// Trigger
// ------------------------------------------------------------------
export type MenuTriggerProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.HTMLAttributes<HTMLDivElement> & {
      as?: "button" | "div";
      sl?: SlProp;
    };

export const MenuTrigger = React.forwardRef<HTMLElement, MenuTriggerProps>(
  function MenuTrigger({ as = "button", sl, onClick, onKeyDown, ...rest }, ref) {
    const { open, setOpen, anchorRef } = useMenuCtx();

    if (as === "button") {
      const base = useButtonBase({
        disabled: (rest as any).disabled,
      });

      const rootData = base.getRootProps();
      const buttonProps = base.getButtonProps({
        ...((rest as unknown) as React.ButtonHTMLAttributes<HTMLButtonElement>),
        "aria-haspopup": "menu",
        "aria-expanded": open || undefined,
        onClick: (e) => {
          onClick?.(e);
          if (e.defaultPrevented) return;
          setOpen(!open);
        },
      });

      return (
        <TriggerBtn
          {...(rootData as any)}
          {...(buttonProps as any)}
          ref={(node) => {
            assignRef(base.buttonRef as any, node as any);
            assignRef(ref as any, node as any);
            assignRef(anchorRef as any, node as any);
          }}
          sl={sl}
        />
      );
    }

    // div fallback (role="button")
    const handleClick = (e: React.MouseEvent<any>) => {
      onClick?.(e as any);
      if (e.defaultPrevented) return;
      setOpen(!open);
    };

    return (
      <TriggerDiv
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={open || undefined}
        onClick={handleClick}
        onKeyDown={onKeyDown}
        ref={(node) => {
          assignRef(ref as any, node as any);
          assignRef(anchorRef as any, node as any);
        }}
        sl={sl}
        {...(rest as React.HTMLAttributes<HTMLDivElement>)}
      />
    );
  }
);

// ------------------------------------------------------------------
// Backdrop (прозрачен; затваря при клик)
// ------------------------------------------------------------------
export type MenuBackdropProps = {
  sl?: SlProp;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};
export function MenuBackdrop({ sl, onClick }: MenuBackdropProps) {
  const { open, setOpen } = useMenuCtx();
  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    setOpen(false);
  };
  return (
    <Backdrop
      sl={sl}
      {...toDataSet({ open, closed: !open })}
      onClick={handleClick}
    />
  );
}

// ------------------------------------------------------------------
// Portal – popup частта отива в портала (ако се ползва)
// ------------------------------------------------------------------
export type MenuPortalProps = {
  children?: React.ReactNode;
  container?: Element | DocumentFragment | null;
};

export function MenuPortal({ children, container }: MenuPortalProps) {
  const mountNode =
    container ?? (typeof document !== "undefined" ? document.body : null);
  return mountNode ? ReactDOM.createPortal(children as any, mountNode) : <>{children}</>;
}

// ------------------------------------------------------------------
// Positioner + Popup
// ------------------------------------------------------------------
export type MenuPositionerProps = {
  children?: React.ReactNode;
  sl?: SlProp;
  side?: MenuRootProps["side"];
  align?: MenuRootProps["align"];
  offset?: number;
};

export function MenuPositioner({
  children,
  sl,
  side,
  align,
  offset,
}: MenuPositionerProps) {
  const ctx = useMenuCtx();
  const ref = React.useRef<HTMLDivElement>(null);

  const s = side ?? ctx.side;
  const a = align ?? ctx.align;
  const off = offset ?? ctx.offset;

  React.useLayoutEffect(() => {
    if (!ctx.open) return;
    const anchor = ctx.anchorRef.current;
    const el = ref.current;
    if (!anchor || !el) return;

    const ar = anchor.getBoundingClientRect();
    const er = el.getBoundingClientRect();

    let top = 0, left = 0, origin = "top";

    if (s === "bottom") { top = ar.bottom + off; origin = "top"; }
    if (s === "top")    { top = ar.top - off - er.height; origin = "bottom"; }
    if (s === "left")   { left = ar.left - off - er.width; origin = "center right"; top = ar.top; }
    if (s === "right")  { left = ar.right + off; origin = "center left"; top = ar.top; }

    if (s === "bottom" || s === "top") {
      if (a === "start")   left = ar.left;
      if (a === "center")  left = ar.left + (ar.width - er.width) / 2;
      if (a === "end")     left = ar.right - er.width;
    } else {
      if (a === "start")   top = ar.top;
      if (a === "center")  top = ar.top + (ar.height - er.height) / 2;
      if (a === "end")     top = ar.bottom - er.height;
    }

    // clamp в viewport
    const sx = Math.max(8, Math.min(left, window.innerWidth - er.width - 8));
    const sy = Math.max(8, Math.min(top,  window.innerHeight - er.height - 8));

    // Позиция на стрелката спрямо popup-а
    //  - за top/bottom: изчисляваме left (центърът на анкора – левия ръб на popup – половин стрелка)
    //  - за left/right: аналогично за top
    const anchorCenterX = ar.left + ar.width / 2;
    const anchorCenterY = ar.top  + ar.height / 2;

    // локален офсет вътре в popup-а
    let arrowLeft = anchorCenterX - sx - 6; // 6 = половин 12px
    let arrowTop  = anchorCenterY - sy - 6;

    // clamp вътре в popup-а (оставяме 8px „safe“ от ъглите)
    arrowLeft = Math.max(8, Math.min(arrowLeft, er.width  - 8 - 12));
    arrowTop  = Math.max(8, Math.min(arrowTop,  er.height - 8 - 12));

    // сетваме стиловете на позиционера (CSS променливи се наследяват вътре)
    el.style.left = `${Math.round(sx + window.scrollX)}px`;
    el.style.top  = `${Math.round(sy + window.scrollY)}px`;
    el.style.setProperty("--transform-origin", origin);

    if (s === "top" || s === "bottom") {
      el.style.setProperty("--ld-arrow-left", `${Math.round(arrowLeft)}px`);
      el.style.removeProperty("--ld-arrow-top");
    } else {
      el.style.setProperty("--ld-arrow-top", `${Math.round(arrowTop)}px`);
      el.style.removeProperty("--ld-arrow-left");
    }
  }, [ctx.open, s, a, off]);

  return (
    <Positioner ref={ref as any} sl={sl} data-side={s} data-align={a}>
      {children}
    </Positioner>
  );
}

export type MenuPopupProps = {
  children?: React.ReactNode;
  sl?: SlProp;
  size?: Size;
  variant?: Variant;
  color?: Color;
  instant?: boolean;
};

// default стил през sl → токени (без черни fallback-и)
const defaultPopupSl: SlProp = (t: LibDevTheme) => ({
  p: 8,
  minWidth: 200,
  bgcolor: "background.level1",
  color: "text",
  borderRadius: "xl",
  boxShadow: "lg",
  border: "1px solid",
  borderColor: "border",
});

export function MenuPopup({
  children,
  sl,
  size,
  variant,
  color,
  instant,
}: MenuPopupProps) {
  const { open, size: sz, variant: vr, color: cr, popupRef } = useMenuCtx();
  if (!open) return null;

  return (
    <Popup
      ref={popupRef as any}
      sl={sl ?? defaultPopupSl}
      {...toDataSet({
        size: size ?? sz,
        variant: variant ?? vr,
        color: color ?? cr,
        instant: !!instant,
      })}
      role="menu"
    >
      {children}
    </Popup>
  );
}

export type MenuArrowProps = { sl?: SlProp };
export function MenuArrow({ sl }: MenuArrowProps) {
  const { side } = useMenuCtx();
  return <Arrow sl={sl} data-side={side} aria-hidden="true" />;
}

// ------------------------------------------------------------------
// Items / Groups
// ------------------------------------------------------------------
export type ItemRole = "menuitem" | "menuitemradio" | "menuitemcheckbox";

export type MenuItemProps = {
  children?: React.ReactNode;
  role?: ItemRole;
  disabled?: boolean;
  sl?: SlProp;
  onClick?: React.MouseEventHandler<HTMLElement>;
};

export function MenuItem({
  children,
  role = "menuitem",
  disabled,
  sl,
  onClick,
}: MenuItemProps) {
  const { setOpen } = useMenuCtx();
  const handleClick: React.MouseEventHandler<any> = (e) => {
    onClick?.(e);
    if (disabled || e.defaultPrevented) return;
    setOpen(false);
  };
  return (
    <Item
      role={role as any}
      aria-disabled={disabled || undefined}
      {...toDataSet({ disabled: !!disabled })}
      sl={sl}
      onClick={handleClick}
    >
      {children}
    </Item>
  );
}

export function MenuSeparator({ sl }: { sl?: SlProp }) {
  return <Separator role="separator" sl={sl} />;
}

export function MenuGroup({
  children,
  sl,
}: {
  children?: React.ReactNode;
  sl?: SlProp;
}) {
  return (
    <Group role="group" sl={sl}>
      {children}
    </Group>
  );
}

export function MenuGroupLabel({
  children,
  sl,
}: {
  children?: React.ReactNode;
  sl?: SlProp;
}) {
  return (
    <GroupLabel role="presentation" sl={sl}>
      {children}
    </GroupLabel>
  );
}

// ------------------------------------------------------------------
// Namespace + плоски export-и
// ------------------------------------------------------------------
export const Menu = Object.assign(MenuRoot, {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Portal: MenuPortal,
  Backdrop: MenuBackdrop,
  Positioner: MenuPositioner,
  Popup: MenuPopup,
  Arrow: MenuArrow,
  Item: MenuItem,
  Separator: MenuSeparator,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
});

export default Menu;
