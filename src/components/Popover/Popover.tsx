// src/components/Popover/Popover.tsx
// LibDev UI – Custom React UI components

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";

import {
  PopoverAnchorProps,
  PopoverCardProps,
  PopoverCloseProps,
  PopoverContextValue,
  PopoverProps,
  PopoverTriggerProps,
  PopoverArrowProps,
  PopoverPlacement,
} from "./Popover.types";

import { AnchorWrapper, CardRoot, TriggerWrapper, ArrowRoot } from "./Popover.styles";

const canUseDOM = typeof window !== "undefined" && typeof document !== "undefined";

// Изоморфен layout effect: на сървър → useEffect (no-op), в браузъра → useLayoutEffect
const useIsoLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;

// Контролирано/неконтролирано състояние за управление на отворено/затворено
/* -------------------------------------------------
 *  Controlled / uncontrolled helper
 * ------------------------------------------------- */
function useControllableState<T>(
  controlled: T | undefined,
  defaultValue: T,
  onChange?: (v: T) => void
) {
  const [uncontrolled, setUncontrolled] = useState<T>(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? (controlled as T) : uncontrolled;

  const setValue = useCallback(
    (v: T) => {
      if (!isControlled) setUncontrolled(v);
      onChange?.(v);
    },
    [isControlled, onChange]
  );

  return [value, setValue] as const;
}

// Комбиниране на обработващи събития за потребителски и вътрешни функции
/* -------------------------------------------------
 *  Compose event handlers
 * ------------------------------------------------- */
function composeEventHandlers<E extends React.SyntheticEvent>(
  userHandler: ((event: E) => void) | undefined,
  ourHandler: (event: E) => void
) {
  return (event: E) => {
    try {
      userHandler?.(event);
    } finally {
      if (!event.defaultPrevented) ourHandler(event);
    }
  };
}

// Помощни функции
/* -------------------------------------------------
 *  Helpers
 * ------------------------------------------------- */
type Side = "top" | "bottom" | "left" | "right";
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(n, max));

// Връща правоъгълника на котвата или спусъка, ако е наличен
function getEffectiveAnchorRect(a: HTMLElement | null, t: HTMLElement | null): DOMRect | null {
  const ar = a?.getBoundingClientRect();
  if (ar && (ar.width > 0 || ar.height > 0)) return ar;
  const tr = t?.getBoundingClientRect();
  if (tr && (tr.width > 0 || tr.height > 0)) return tr;
  return null;
}

// Връща всички скролируеми родители на елемент + window
/** върни всички скролируеми родители + window */
function getScrollParents(el: Element | null): (Element | Window)[] {
  const res: (Element | Window)[] = [window];
  if (!el) return res;
  let p: Element | null = el.parentElement;
  while (p) {
    const s = getComputedStyle(p);
    const oy = s.overflowY;
    const ox = s.overflowX;
    const scrollable =
      oy === "auto" || oy === "scroll" || oy === "overlay" ||
      ox === "auto" || ox === "scroll" || ox === "overlay";
    if (scrollable) res.push(p);
    p = p.parentElement;
  }
  return res;
}

const ARROW_SIZE = 8; // Размер на стрелката
const EDGE_PAD = 8;   // Отстъп от ръба на екрана

// Изчислява позицията на изскачащия прозорец спрямо котвата
function computePosition(
  anchorRect: DOMRect,
  cardRect: DOMRect,
  placement: PopoverPlacement,
  offset: number
) {
  let top = 0;
  let left = 0;
  let origin = "center top";

  const [side, align] = placement.split("-") as [string, "start" | "end" | undefined];

  switch (side) {
    case "top":
      top = anchorRect.top - cardRect.height - offset;
      left = anchorRect.left + anchorRect.width / 2 - cardRect.width / 2;
      origin = "center bottom";
      break;
    case "bottom":
      top = anchorRect.bottom + offset;
      left = anchorRect.left + anchorRect.width / 2 - cardRect.width / 2;
      origin = "center top";
      break;
    case "left":
      top = anchorRect.top + anchorRect.height / 2 - cardRect.height / 2;
      left = anchorRect.left - cardRect.width - offset;
      origin = "right center";
      break;
    case "right":
    default:
      top = anchorRect.top + anchorRect.height / 2 - cardRect.height / 2;
      left = anchorRect.right + offset;
      origin = "left center";
      break;
  }

  if (align && (side === "top" || side === "bottom")) {
    if (align === "start") left = anchorRect.left;
    if (align === "end") left = anchorRect.right - cardRect.width;
  }
  if (align && (side === "left" || side === "right")) {
    if (align === "start") top = anchorRect.top;
    if (align === "end") top = anchorRect.bottom - cardRect.height;
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  left = clamp(left, EDGE_PAD, Math.max(EDGE_PAD, vw - cardRect.width - EDGE_PAD));
  top = clamp(top, EDGE_PAD, Math.max(EDGE_PAD, vh - cardRect.height - EDGE_PAD));

  return { top, left, transformOrigin: origin };
}

// Контекст за споделяне на състояние между компонентите
/* -------------------------------------------------
 *  Context
 * ------------------------------------------------- */
const PopoverCtx = createContext<PopoverContextValue | null>(null);
const usePopoverCtx = () => {
  const ctx = useContext(PopoverCtx);
  if (!ctx) throw new Error("Popover components must be used within <PopoverForm>.");
  return ctx;
};

// Основен компонент за изскачащия прозорец
/* -------------------------------------------------
 *  PopoverForm
 * ------------------------------------------------- */
export function PopoverForm({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placement = "bottom",
  offset = 8,
  disableOutsideClose = false,
  children,
}: PopoverProps) {
  const [open, setOpen] = useControllableState<boolean>(openProp, defaultOpen, onOpenChange);

  const anchorRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [, force] = useState(0);
  const bump = useCallback(() => force((x) => x + 1), []);

  const setOpenSafe = useCallback((v: boolean) => setOpen(v), [setOpen]);
  const toggle = useCallback(() => setOpenSafe(!open), [open, setOpenSafe]);

  const setAnchorEl = useCallback((el: HTMLElement | null) => { anchorRef.current = el; bump(); }, [bump]);
  const setTriggerEl = useCallback((el: HTMLElement | null) => { triggerRef.current = el; bump(); }, [bump]);
  const setCardEl   = useCallback((el: HTMLDivElement | null) => { cardRef.current = el; bump(); }, [bump]);

  // Обработка на клик извън прозореца и натискане на Escape
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent | MouseEvent) => {
      if (disableOutsideClose) return;
      const t = e.target as Node;
      if (cardRef.current?.contains(t) || anchorRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setOpenSafe(false);
    };
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape" && !disableOutsideClose) setOpenSafe(false); };
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [open, disableOutsideClose, setOpenSafe]);

  // Фокусиране върху спусъка при затваряне
  useEffect(() => {
    if (!open && triggerRef.current) triggerRef.current.focus?.({ preventScroll: true });
  }, [open]);

  const ctx = useMemo<PopoverContextValue>(() => ({
    open,
    setOpen: setOpenSafe,
    toggle,
    anchorEl: anchorRef.current,
    setAnchorEl,
    triggerEl: triggerRef.current,
    setTriggerEl,
    cardEl: cardRef.current,
    setCardEl,
    placement,
    offset,
    disableOutsideClose,
  }), [
    open, setOpenSafe, toggle, placement, offset, disableOutsideClose,
    anchorRef.current, triggerRef.current, cardRef.current
  ]);

  return <PopoverCtx.Provider value={ctx}>{children}</PopoverCtx.Provider>;
}

// Компонент за спусъка на изскачащия прозорец
/* -------------------------------------------------
 *  PopoverTrigger
 * ------------------------------------------------- */
export function PopoverTrigger({ asChild = true, children, sl }: PopoverTriggerProps) {
  const ctx = usePopoverCtx();
  const child = React.Children.only(children);

  const commonProps: Pick<React.ButtonHTMLAttributes<HTMLButtonElement>,
    "onClick" | "aria-haspopup" | "aria-expanded"
  > = {
    "aria-haspopup": "dialog" as const,
    "aria-expanded": ctx.open ? true : undefined,
    onClick: composeEventHandlers((child as any).props?.onClick, () => ctx.toggle()),
  };

  const setTriggerRef = (node: HTMLElement | null) => {
    ctx.setTriggerEl(node);
    const r = (child as any).ref;
    if (typeof r === "function") r(node);
    else if (r) (r as any).current = node;
  };

  if (asChild) return React.cloneElement(child as any, { ...commonProps, ref: setTriggerRef });

  const onKeyDown: React.KeyboardEventHandler<HTMLSpanElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      ctx.toggle();
    }
  };

  return (
    <TriggerWrapper
      sl={sl}
      {...(commonProps as any)}
      ref={setTriggerRef as any}
      role="button"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {child}
    </TriggerWrapper>
  );
}

// Компонент за котвата на изскачащия прозорец
/* -------------------------------------------------
 *  PopoverAnchor
 * ------------------------------------------------- */
export function PopoverAnchor({ asChild = false, children, sl }: PopoverAnchorProps) {
  const ctx = usePopoverCtx();
  const child = children ? React.Children.only(children) : null;

  if (!child) {
    if (ctx.anchorEl) ctx.setAnchorEl(null);
    return null;
  }

  const setAnchorRef = (node: HTMLElement | null) => {
    ctx.setAnchorEl(node);
    const r = (child as any).ref;
    if (typeof r === "function") r(node);
    else if (r) (r as any).current = node;
  };

  if (asChild) return React.cloneElement(child as any, { ref: setAnchorRef });

  return (
    <AnchorWrapper sl={sl} ref={setAnchorRef as any}>
      {child}
    </AnchorWrapper>
  );
}

// Компонент за съдържанието на изскачащия прозорец с позициониране и слушане за скрол
/* -------------------------------------------------
 *  PopoverCard – positioning + scroll-parents listeners
 * ------------------------------------------------- */
export function PopoverCard({
  role = "dialog",
  className,
  style,
  sl,
  children,
  ...layoutProps
}: PopoverCardProps): JSX.Element | null {
  const ctx = usePopoverCtx();
  const id = useId();

  // Позициониране и слушане за скрол събития
  useIsoLayoutEffect(() => {
    const el = ctx.cardEl;
    if (!el) return;

    let cancelled = false;

    const place = () => {
      if (cancelled) return;
      const refRect = getEffectiveAnchorRect(ctx.anchorEl, ctx.triggerEl);
      if (!refRect) { requestAnimationFrame(place); return; }

      const card = el.getBoundingClientRect();
      const pos = computePosition(refRect, card, ctx.placement, ctx.offset);

      el.style.top = `${pos.top}px`;
      el.style.left = `${pos.left}px`;
      el.style.transformOrigin = pos.transformOrigin;
      el.style.visibility = "visible";
      el.setAttribute("data-placement", ctx.placement);
    };

    if (ctx.open) {
      el.style.position = "fixed";
      el.style.display = "block";
      el.style.top = "0px";
      el.style.left = "0px";
      el.style.visibility = "hidden";

      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(place);

        const parents = Array.from(
          new Set([
            ...getScrollParents(ctx.anchorEl as any),
            ...getScrollParents(ctx.triggerEl as any),
          ])
        );

        const onScroll = () => place();
        const onResize = () => place();

        parents.forEach((n) => n.addEventListener("scroll", onScroll as any, { passive: true }));
        window.addEventListener("resize", onResize, true);

        const ro = new ResizeObserver(() => place());
        ro.observe(document.body);
        ro.observe(el);
        if (ctx.anchorEl) ro.observe(ctx.anchorEl);
        if (ctx.triggerEl) ro.observe(ctx.triggerEl);

        return () => {
          cancelAnimationFrame(raf2);
          parents.forEach((n) => n.removeEventListener("scroll", onScroll as any));
          window.removeEventListener("resize", onResize, true);
          ro.disconnect();
        };
      });

      return () => {
        cancelAnimationFrame(raf1);
        cancelled = true;
      };
    } else {
      el.style.display = "none";
    }
  }, [ctx.open, ctx.anchorEl, ctx.triggerEl, ctx.cardEl, ctx.placement, ctx.offset]);

  const setCardRef = useCallback((node: HTMLDivElement | null) => {
    ctx.setCardEl(node);
  }, [ctx]);

  const content = (
    <CardRoot
      id={(style as any)?.id ?? `popover-${id}`}
      role={role}
      aria-modal={role === "dialog" ? true : undefined}
      className={className}
      ref={setCardRef}
      sl={sl}
      {...(layoutProps as any)}
      style={style}
      data-placement={ctx.placement}
    >
      {children}
    </CardRoot>
  );

 if (!canUseDOM) return null;
return createPortal(content, document.body);
}

// Компонент за затваряне на изскачащия прозорец
/* -------------------------------------------------
 *  PopoverClose
 * ------------------------------------------------- */
export function PopoverClose({ asChild = false, children, onClick, ...rest }: PopoverCloseProps) {
  const ctx = usePopoverCtx();
  const handleClick = composeEventHandlers(onClick as any, () => ctx.setOpen(false));

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, { onClick: handleClick });
  }

  return (
    <button
      type="button"
      aria-label="Close"
      onClick={handleClick}
      {...rest}
      style={{ appearance: "none", background: "transparent", border: 0, cursor: "pointer", ...(rest.style || {}) }}
    >
      {children ?? "✕"}
    </button>
  );
}

// Компонент за стрелката на изскачащия прозорец с позициониране
/* -------------------------------------------------
 *  PopoverArrow – позициониране + scroll-parents listeners
 * ------------------------------------------------- */
export function PopoverArrow({ sl, style, size = 8, ...rest }: PopoverArrowProps) {
  const ctx = usePopoverCtx();
  const [arrowStyle, setArrowStyle] = React.useState<CSSProperties>({});

  // Изчисляване на позицията на стрелката
  const measure = React.useCallback(() => {
    if (!ctx.cardEl) return;
    const ref = getEffectiveAnchorRect(ctx.anchorEl, ctx.triggerEl);
    if (!ref) return;

    const card = ctx.cardEl.getBoundingClientRect();
    const [side, align] = ctx.placement.split("-") as
      ["top" | "bottom" | "left" | "right", "start" | "end" | undefined];

    const numericSize = typeof size === "number" ? size : 8;
    const CORNER_RADIUS = 8;
    const BOTTOM_GUARD = 2;     // Пазим върха ≥2px над долния ръб
    const pad = Math.max(10, CORNER_RADIUS + numericSize);
    const PULL_START = 6;       // „Още няколко пиксела“ към центъра при -start

    const next: CSSProperties = {};

    if (side === "left" || side === "right") {
      // Движим се по Y
      const cy = ref.top + ref.height / 2;
      let y = cy - card.top;

      // Базови лимити
      let minY = pad;
      let maxY = Math.min(card.height - pad, card.height - (numericSize + BOTTOM_GUARD));

      // При -start дърпаме малко от двата края към центъра
      if (align === "start") {
        minY += PULL_START;
        maxY -= PULL_START;
      }

      // Clamp
      y = Math.max(minY, Math.min(y, maxY));

      // При -end запазваме лек bias към центъра (по-естествен вид)
      if (align === "end") {
        const t = 0.05; // 5% към центъра
        y = y * (1 - t) + (card.height / 2) * t;
        y = Math.max(minY, Math.min(y, maxY)); // Ре-clamp след bias
      }

      next.top = y;
    } else {
      // Движим се по X (top/bottom)
      const cx = ref.left + ref.width / 2;
      let x = cx - card.left;

      let minX = pad;
      let maxX = card.width - pad;

      // При -start дърпаме малко от левия/десния край към центъра
      if (align === "start") {
        minX += PULL_START;
        maxX -= PULL_START;
      }

      x = Math.max(minX, Math.min(x, maxX));
      next.left = x;
    }

    setArrowStyle(next);
  }, [ctx.anchorEl, ctx.triggerEl, ctx.cardEl, ctx.placement, size]);

  // Слушане за промени при отворен прозорец
  React.useLayoutEffect(() => {
    if (!ctx.open) return;

    let raf = requestAnimationFrame(measure);
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    const onResize = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };

    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize, true);

    const ro = ctx.cardEl ? new ResizeObserver(() => onResize()) : null;
    ro?.observe(ctx.cardEl!);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize, true);
      ro?.disconnect();
    };
  }, [ctx.open, measure]);

  const side = ctx.placement.split("-")[0] as "top" | "bottom" | "left" | "right";
  const dataSide =
    side === "top" ? "bottom" :
    side === "bottom" ? "top" :
    side === "left" ? "right" : "left";

  return (
    <ArrowRoot
      data-side={dataSide}
      size={size}
      sl={sl}
      style={{ ...arrowStyle, ...style }}
      {...rest}
    />
  );
}