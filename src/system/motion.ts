// LibDev UI – Motion system utilities
// Коментари на български; видимите текстове на английски.

import type { Variants, Transition } from "framer-motion";
import { useInView, useAnimationControls } from "framer-motion";
import { useEffect, useRef } from "react";

/** Скорост на анимацията */
export type MotionSpeed = "slow" | "normal" | "fast";

/** Entrance ефекти (можеш да разшириш списъка централизирано тук) */
export type MotionEntranceEffect =
  | "fadeIn" | "fadeInUp" | "fadeInDown" | "fadeInLeft" | "fadeInRight"
  | "zoomIn" | "zoomOut"
  | "bounceIn" | "bounceInUp" | "bounceInDown" | "bounceInLeft" | "bounceInRight"
  | "slideInUp" | "slideInDown" | "slideInLeft" | "slideInRight"
  | "rotateIn"
  | "lightSpeedIn"
  | "flipInX" | "flipInY"
  | "rollIn" | "jackInTheBox" | "wobble" | "hinge" | "pulse" | "swing"
  | "tada" | "rubberBand" | "bounce" | "flash" | "shake" | "jello";

/** Карта със скорости -> продължителност в секунди */
const SPEED_MAP: Record<MotionSpeed, number> = { slow: 0.8, normal: 0.45, fast: 0.25 };
const isSpringy = (e: MotionEntranceEffect) =>
  e.startsWith("bounce") ||
  e === "rubberBand" || e === "tada" || e === "jackInTheBox" || e === "swing" || e === "jello";

/** Централизирани variants за entrance ефектите */
export function variantsFor(effect: MotionEntranceEffect): Variants {
  const D = 24;
  switch (effect) {
    case "fadeIn": return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
    case "fadeInUp": return { hidden: { opacity: 0, y: D }, visible: { opacity: 1, y: 0 } };
    case "fadeInDown": return { hidden: { opacity: 0, y: -D }, visible: { opacity: 1, y: 0 } };
    case "fadeInLeft": return { hidden: { opacity: 0, x: -D }, visible: { opacity: 1, x: 0 } };
    case "fadeInRight": return { hidden: { opacity: 0, x: D }, visible: { opacity: 1, x: 0 } };

    case "zoomIn": return { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } };
    case "zoomOut": return { hidden: { opacity: 0, scale: 1.1 }, visible: { opacity: 1, scale: 1 } };

    case "bounceIn": return { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } };
    case "bounceInUp": return { hidden: { opacity: 0, y: D * 1.5 }, visible: { opacity: 1, y: 0 } };
    case "bounceInDown": return { hidden: { opacity: 0, y: -D * 1.5 }, visible: { opacity: 1, y: 0 } };
    case "bounceInLeft": return { hidden: { opacity: 0, x: -D * 1.5 }, visible: { opacity: 1, x: 0 } };
    case "bounceInRight": return { hidden: { opacity: 0, x: D * 1.5 }, visible: { opacity: 1, x: 0 } };

    case "slideInUp": return { hidden: { y: D * 2 }, visible: { y: 0 } };
    case "slideInDown": return { hidden: { y: -D * 2 }, visible: { y: 0 } };
    case "slideInLeft": return { hidden: { x: -D * 2 }, visible: { x: 0 } };
    case "slideInRight": return { hidden: { x: D * 2 }, visible: { x: 0 } };

    case "rotateIn": return { hidden: { opacity: 0, rotate: -15 }, visible: { opacity: 1, rotate: 0 } };
    case "lightSpeedIn": return { hidden: { opacity: 0, x: -40, skewX: 10 }, visible: { opacity: 1, x: 0, skewX: 0 } };

    case "flipInX": return {
      hidden: { opacity: 0, rotateX: -90, transformPerspective: 600 },
      visible: { opacity: 1, rotateX: 0, transformPerspective: 600 },
    };
    case "flipInY": return {
      hidden: { opacity: 0, rotateY: 90, transformPerspective: 600 },
      visible: { opacity: 1, rotateY: 0, transformPerspective: 600 },
    };

    case "rollIn": return { hidden: { opacity: 0, x: -60, rotate: -120 }, visible: { opacity: 1, x: 0, rotate: 0 } };
    case "jackInTheBox": return {
      hidden: { opacity: 0, scale: 0.1, rotate: 30, transformOrigin: "center bottom" },
      visible: { opacity: 1, scale: 1, rotate: 0, transformOrigin: "center bottom" },
    };
    case "wobble": return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, x: [0, -8, 6, -4, 2, 0], rotate: [0, -2, 2, -1, 1, 0] },
    };
    case "hinge": return {
      hidden: { opacity: 0, rotateZ: -80, transformOrigin: "top left" },
      visible: { opacity: 1, rotateZ: [0, 0], transformOrigin: "top left" },
    };
    case "pulse": return { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: [1, 1.05, 1] } };
    case "swing": return {
      hidden: { opacity: 0, rotateZ: -6, transformOrigin: "top center" },
      visible: { opacity: 1, rotateZ: [0, 6, -4, 2, 0], transformOrigin: "top center" },
    };
    case "tada": return { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: [1, .9, 1.1, 1], rotateZ: [0, -3, 3, 0] } };
    case "rubberBand": return {
      hidden: { opacity: 0, scaleX: .95, scaleY: 1.05 },
      visible: { opacity: 1, scaleX: [1, 1.25, .75, 1.15, .95, 1], scaleY: [1, .75, 1.25, .85, 1.05, 1] },
    };
    case "bounce": return { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: [0, -10, 0, -4, 0] } };
    case "flash": return { hidden: { opacity: 0 }, visible: { opacity: [.2, 1, .2, 1] } };
    case "shake": return { hidden: { opacity: 0, x: 0 }, visible: { opacity: 1, x: [0, -8, 8, -6, 6, -4, 4, 0] } };
    case "jello": return {
      hidden: { opacity: 0, skewX: 0, skewY: 0 },
      visible: { opacity: 1, skewX: [0, 12, -10, 6, -4, 0], skewY: [0, 6, -4, 3, -2, 0], transformOrigin: "center" },
    };

    default: return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  }
}

/** Централизиран transition генератор */
export function transitionFor(speed: MotionSpeed, delay = 0, stagger?: number, effect?: MotionEntranceEffect): Transition & { staggerChildren?: number } {
  const base = isSpringy(effect ?? "fadeIn")
    ? { type: "spring", stiffness: 400, damping: 28, delay }
    : { duration: SPEED_MAP[speed] ?? SPEED_MAP.normal, ease: "easeOut", delay };
  if (typeof stagger === "number" && stagger >= 0) (base as any).staggerChildren = stagger;
  return base as any;
}

/** Хук за стабилен entrance: връща ref + controls */
export function useEntranceAnimation(
  opts: { amount?: number; once?: boolean; disabled?: boolean }
): [React.RefObject<HTMLElement>, ReturnType<typeof useAnimationControls>] {
  const targetRef = useRef<HTMLElement | null>(null);
  const controls = useAnimationControls();
  const inView = useInView(targetRef, { amount: opts.amount ?? 0.2 });

  useEffect(() => {
    if (opts.disabled) return;
    if (opts.once) {
      if (inView) controls.start("visible");
    } else {
      if (inView) controls.start("visible");
      else controls.set("hidden");
    }
  }, [inView, opts.disabled, opts.once, controls]);

  return [targetRef, controls];
}

