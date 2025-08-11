// src/components/BoxMotion/BoxMotion.utils.ts
// LibDev UI – Custom React UI components

import type { Variants, Transition } from "framer-motion";
import type { MotionEntranceEffect, MotionSpeed } from "./BoxMotion.types";

/* ----------------------------------------------
 * Конфигурация на скорости (за tween)
 * -------------------------------------------- */
const SPEED_DURATION: Record<MotionSpeed, number> = {
  slow: 0.8,
  normal: 0.45,
  fast: 0.25,
};

const EASE_DEFAULT = [0.2, 0.8, 0.2, 1]; // easeOut-ish

/* ----------------------------------------------
 * Класификация на ефектите според keyframes
 * -------------------------------------------- */

/** Ефекти с многокадрови keyframes → Framer НЕ позволява spring */
const MULTI_KEYFRAME_EFFECTS = new Set<MotionEntranceEffect>([
  "tada",
  "rubberBand",
  "wobble",
  "swing",
  "bounce", // специалният „bounce“ с последователност
  "flash",
  "shake",
  "jello",
  // "hinge" при нас ползва два кадъра [0,0] → допустим е spring, оставяме го извън списъка
]);

/** Ефекти с двукадров вход, при които spring стои добре */
const SPRING_EFFECTS = new Set<MotionEntranceEffect>([
  "bounceIn",
  "bounceInUp",
  "bounceInDown",
  "bounceInLeft",
  "bounceInRight",
  "jackInTheBox",
]);

/* ----------------------------------------------
 * Централизиран Transition генератор
 * - Multi-keyframe → принудително tween (никакъв spring)
 * - Двукадрови bounceIn* и jackInTheBox → spring
 * - Останалите → tween (duration + ease)
 * -------------------------------------------- */
export function resolveTransition(
  speed: MotionSpeed,
  delay = 0,
  staggerChildren?: number,
  effect?: MotionEntranceEffect
): (Transition & { staggerChildren?: number }) {
  const isMulti = effect ? MULTI_KEYFRAME_EFFECTS.has(effect) : false;
  const isSpringOK = effect ? SPRING_EFFECTS.has(effect) : false;

  let base: Transition & { staggerChildren?: number };

  if (isMulti) {
    // Multi-keyframes: spring е забранен → tween
    base = {
      type: "tween",
      duration: SPEED_DURATION[speed] ?? SPEED_DURATION.normal,
      ease: EASE_DEFAULT as any,
      delay,
    };
  } else if (isSpringOK) {
    // Двукадрови bounceIn* / jackInTheBox → spring
    base = {
      type: "spring",
      stiffness: 420,
      damping: 28,
      delay,
    };
  } else {
    // ▶︎ Всичко останало → tween (по-безопасно и предвидимо)
    base = {
      type: "tween",
      duration: SPEED_DURATION[speed] ?? SPEED_DURATION.normal,
      ease: EASE_DEFAULT as any,
      delay,
    };
  }

  if (typeof staggerChildren === "number" && staggerChildren >= 0) {
    base.staggerChildren = staggerChildren;
  }
  return base;
}

/* ----------------------------------------------
 * Помощни – за удобни константи при посоките
 * -------------------------------------------- */
const D = 24;           // базов offset за translate
const D_BOUNCE = D * 1.5;
const D_SLIDE = D * 2;

/* ----------------------------------------------
 * Пълна карта с entrance variants (hidden → visible)
 * -------------------------------------------- */
export function buildEffectVariants(effect: MotionEntranceEffect): Variants {
  switch (effect) {
    /* ------------- Fade ------------- */
    case "fadeIn":
      return { hidden: { opacity: 0 }, visible: { opacity: 1 } };

    case "fadeInUp":
      return { hidden: { opacity: 0, y: D }, visible: { opacity: 1, y: 0 } };

    case "fadeInDown":
      return { hidden: { opacity: 0, y: -D }, visible: { opacity: 1, y: 0 } };

    case "fadeInLeft":
      return { hidden: { opacity: 0, x: -D }, visible: { opacity: 1, x: 0 } };

    case "fadeInRight":
      return { hidden: { opacity: 0, x: D }, visible: { opacity: 1, x: 0 } };

    /* ------------- Zoom ------------- */
    case "zoomIn":
      return { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } };

    case "zoomOut":
      return { hidden: { opacity: 0, scale: 1.1 }, visible: { opacity: 1, scale: 1 } };

    /* ------------- Bounce (двукадрови) ------------- */
    case "bounceIn":
      return { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } };

    case "bounceInUp":
      return { hidden: { opacity: 0, y: D_BOUNCE }, visible: { opacity: 1, y: 0 } };

    case "bounceInDown":
      return { hidden: { opacity: 0, y: -D_BOUNCE }, visible: { opacity: 1, y: 0 } };

    case "bounceInLeft":
      return { hidden: { opacity: 0, x: -D_BOUNCE }, visible: { opacity: 1, x: 0 } };

    case "bounceInRight":
      return { hidden: { opacity: 0, x: D_BOUNCE }, visible: { opacity: 1, x: 0 } };

    /* ------------- Slide ------------- */
    case "slideInUp":
      return { hidden: { y: D_SLIDE }, visible: { y: 0 } };

    case "slideInDown":
      return { hidden: { y: -D_SLIDE }, visible: { y: 0 } };

    case "slideInLeft":
      return { hidden: { x: -D_SLIDE }, visible: { x: 0 } };

    case "slideInRight":
      return { hidden: { x: D_SLIDE }, visible: { x: 0 } };

    /* ------------- Rotate ------------- */
    case "rotateIn":
      return { hidden: { opacity: 0, rotate: -15 }, visible: { opacity: 1, rotate: 0 } };

    /* ------------- Light Speed ------------- */
    case "lightSpeedIn":
      return {
        hidden: { opacity: 0, x: -40, skewX: 10 },
        visible: { opacity: 1, x: 0, skewX: 0 },
      };

    /* ------------- Flip ------------- */
    case "flipInX":
      return {
        hidden: { opacity: 0, rotateX: -90, transformPerspective: 600 },
        visible: { opacity: 1, rotateX: 0, transformPerspective: 600 },
      };

    case "flipInY":
      return {
        hidden: { opacity: 0, rotateY: 90, transformPerspective: 600 },
        visible: { opacity: 1, rotateY: 0, transformPerspective: 600 },
      };

    /* ------------- Special (многокадрови) ------------- */
    case "rollIn":
      return {
        hidden: { opacity: 0, x: -60, rotate: -120 },
        visible: { opacity: 1, x: 0, rotate: 0 },
      };

    case "jackInTheBox":
      return {
        hidden: { opacity: 0, scale: 0.1, rotate: 30, transformOrigin: "center bottom" },
        visible: { opacity: 1, scale: 1, rotate: 0, transformOrigin: "center bottom" },
      };

    case "wobble":
      return {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          x: [0, -8, 6, -4, 2, 0],
          rotate: [0, -2, 2, -1, 1, 0],
        },
      };

    case "hinge":
      return {
        hidden: { opacity: 0, rotateZ: -80, transformOrigin: "top left" },
        visible: { opacity: 1, rotateZ: [0, 0], transformOrigin: "top left" },
      };

    case "pulse":
      return {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: [1, 1.05, 1] },
      };

    case "swing":
      return {
        hidden: { opacity: 0, rotateZ: -6, transformOrigin: "top center" },
        visible: { opacity: 1, rotateZ: [0, 6, -4, 2, 0], transformOrigin: "top center" },
      };

    case "tada":
      return {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
          opacity: 1,
          scale: [1, 0.9, 1.1, 1],
          rotateZ: [0, -3, 3, 0],
        },
      };

    case "rubberBand":
      return {
        hidden: { opacity: 0, scaleX: 0.95, scaleY: 1.05 },
        visible: {
          opacity: 1,
          scaleX: [1, 1.25, 0.75, 1.15, 0.95, 1],
          scaleY: [1, 0.75, 1.25, 0.85, 1.05, 1],
        },
      };

    case "bounce":
      return {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: [0, -10, 0, -4, 0] },
      };

    case "flash":
      return {
        hidden: { opacity: 0 },
        visible: { opacity: [0.2, 1, 0.2, 1] },
      };

    case "shake":
      return {
        hidden: { opacity: 0, x: 0 },
        visible: { opacity: 1, x: [0, -8, 8, -6, 6, -4, 4, 0] },
      };

    case "jello":
      return {
        hidden: { opacity: 0, skewX: 0, skewY: 0 },
        visible: {
          opacity: 1,
          skewX: [0, 12, -10, 6, -4, 0],
          skewY: [0, 6, -4, 3, -2, 0],
          transformOrigin: "center",
        },
      };

    /* ------------- Default ------------- */
    default:
      return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  }
}
export function getEntranceTransition(
  speed: MotionSpeed,
  delay = 0,
  staggerChildren?: number,
  effect?: MotionEntranceEffect
): Transition & { staggerChildren?: number } {
  return resolveTransition(speed, delay, staggerChildren, effect);
}