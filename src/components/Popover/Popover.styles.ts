// src/components/Popover/Popover.styles.ts
// LibDev UI – Custom React UI components

import styled from "@emotion/styled";
import { compileStyle, type StyleLike } from "../../system/resolveStyle";

// общ проп за стил (sl)
type WithSl = { sl?: StyleLike };
// да не изтичат нестандартни пропове към DOM
const shouldFwd = (prop: string) => prop !== "sl" && prop !== "size";

/* ───────────────── Trigger (fallback <span role="button">) ───────────────── */
export const TriggerWrapper = styled("span", { shouldForwardProp: shouldFwd })<WithSl>(({ sl }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  ...(compileStyle(sl) as any),
}));

/* ───────────────── Anchor контейнер (когато не е asChild) ───────────────── */
export const AnchorWrapper = styled("div", { shouldForwardProp: shouldFwd })<WithSl>(({ sl }) => ({
  display: "inline-block",
  position: "relative",
  ...(compileStyle(sl) as any),
}));

/* ───────────────── Картата на поповъра ───────────────── */
export const CardRoot = styled("div", { shouldForwardProp: shouldFwd })<WithSl>(({ sl }) => ({
  // позиционираме спрямо viewport; top/left идват inline от Popover.tsx
  position: "fixed",
  zIndex: 1000,

  minWidth: 200,
  maxWidth: "92vw",

  background: "var(--ld-surface, #fff)",
  color: "var(--ld-fg, #0f172a)",
  borderRadius: "var(--ld-radius-lg, 12px)",
  boxShadow: "var(--ld-shadow-lg, 0 10px 25px rgba(0,0,0,.15))",
  padding: 16,
   overflow: "visible",

  // Помага при първоначалното „невидимо“ измерване
  willChange: "top,left",

  ...(compileStyle(sl) as any),
}));

/* ───────────────── Стрелката: чист триъгълник + shadow слой ─────────────────
 * Рисуваме триъгълника чрез бордери:
 *  - ::before = shadow (по-голям и под съдържанието)
 *  - ::after  = fill (точният цвят като на картата)
 * -------------------------------------------------------------------------- */
export const ArrowRoot = styled("div", { shouldForwardProp: shouldFwd })<
  WithSl & { size?: number; ["data-side"]?: "top" | "bottom" | "left" | "right" }
>(({ sl, size = 12 }) => {
  const shadow = "rgba(0,0,0,.12)";
  const bg = "var(--ld-surface, #fff)";

  return {
    position: "absolute",
    width: 0,
    height: 0,
    pointerEvents: "none",

    // махаме transform от контейнера (той е 0×0)
    // '&[data-side="top"], &[data-side="bottom"]': { transform: "translateX(-50%)" },
    // '&[data-side="left"], &[data-side="right"]': { transform: "translateY(-50%)" },

    /* TOP (стрелката сочи нагоре, стои на горния ръб на картата) */
    '&[data-side="top"]': {
      top: 0,
      '::before, ::after': {
        content: '""',
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",   // центърът е по X
      },
      "::before": {
        borderLeft: `${size + 1}px solid transparent`,
        borderRight: `${size + 1}px solid transparent`,
        borderBottom: `${size + 1}px solid ${shadow}`,
        top: -(size + 1),
      },
      "::after": {
        borderLeft: `${size}px solid transparent`,
        borderRight: `${size}px solid transparent`,
        borderBottom: `${size}px solid ${bg}`,
        top: -size,
      },
    },

    /* BOTTOM (стрелката сочи надолу, стои на долния ръб) */
    '&[data-side="bottom"]': {
      bottom: 0,
      '::before, ::after': {
        content: '""',
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",   // центърът е по X
      },
      "::before": {
        borderLeft: `${size + 1}px solid transparent`,
        borderRight: `${size + 1}px solid transparent`,
        borderTop: `${size + 1}px solid ${shadow}`,
        bottom: -(size + 1 + 2),         // +2px „guard“
      },
      "::after": {
        borderLeft: `${size}px solid transparent`,
        borderRight: `${size}px solid transparent`,
        borderTop: `${size}px solid ${bg}`,
        bottom: -size,
      },
    },

    /* LEFT (стрелката сочи наляво, стои на левия ръб) */
    '&[data-side="left"]': {
      left: 0,
      '::before, ::after': {
        content: '""',
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",   // центърът е по Y
      },
      "::before": {
        borderTop: `${size + 1}px solid transparent`,
        borderBottom: `${size + 1}px solid transparent`,
        borderRight: `${size + 1}px solid ${shadow}`,
        left: -(size + 1),
      },
      "::after": {
        borderTop: `${size}px solid transparent`,
        borderBottom: `${size}px solid transparent`,
        borderRight: `${size}px solid ${bg}`,
        left: -size,
      },
    },

    /* RIGHT (стрелката сочи надясно, стои на десния ръб) */
    '&[data-side="right"]': {
      right: 0,
      '::before, ::after': {
        content: '""',
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",   // центърът е по Y
      },
      "::before": {
        borderTop: `${size + 1}px solid transparent`,
        borderBottom: `${size + 1}px solid transparent`,
        borderLeft: `${size + 1}px solid ${shadow}`,
        right: -(size + 1),
      },
      "::after": {
        borderTop: `${size}px solid transparent`,
        borderBottom: `${size}px solid transparent`,
        borderLeft: `${size}px solid ${bg}`,
        right: -size,
      },
    },

    ...(compileStyle(sl) as any),
  };
});
