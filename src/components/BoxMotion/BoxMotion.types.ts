// src/components/BoxMotion/BoxMotion.types.ts
// LibDev UI – Custom React UI components

import type { HTMLMotionProps, Variants } from "framer-motion";
import type { ReactNode } from "react";

/* ----------------------------------------------
 *  Entrance ефекти (стартират при влизане в изглед)
 * -------------------------------------------- */
export type MotionEntranceEffect =
  // Fade
  | "fadeIn"
  | "fadeInUp"
  | "fadeInDown"
  | "fadeInLeft"
  | "fadeInRight"
  // Zoom
  | "zoomIn"
  | "zoomOut"
  // Bounce (отскачане)
  | "bounceIn"
  | "bounceInUp"
  | "bounceInDown"
  | "bounceInLeft"
  | "bounceInRight"
  // Slide (плъзгане)
  | "slideInUp"
  | "slideInDown"
  | "slideInLeft"
  | "slideInRight"
  // Rotate
  | "rotateIn"
  // Light Speed
  | "lightSpeedIn"
  // Flip
  | "flipInX"
  | "flipInY"
  // Special
  | "rollIn"
  | "jackInTheBox"
  | "wobble"
  | "hinge"
  | "pulse"
  | "swing"
  | "tada"
  | "rubberBand"
  | "bounce"
  | "flash"
  | "shake"
  | "jello";

/** Скорост на анимацията */
export type MotionSpeed = "slow" | "normal" | "fast";

/* ----------------------------------------------
 *  Scrolling ефекти (променят стойности при скрол)
 *  Всички са незадължителни и могат да се комбинират.
 * -------------------------------------------- */
export interface ScrollParallaxAxis {
  /** Пиксели от-до при скрол (напр. от -40 до 40) */
  from?: number;
  to?: number;
}

export interface ScrollOpacity {
  from?: number; // 0..1
  to?: number;   // 0..1
}

export interface ScrollBlur {
  from?: number; // px
  to?: number;   // px
}

export interface ScrollRotate {
  from?: number; // deg
  to?: number;   // deg
}

export interface ScrollScale {
  from?: number; // напр. 0.9
  to?: number;   // напр. 1.05
}

export interface ScrollMouseTrack {
  /** Сила на преместване по X/Y (px при max отклонение) */
  strength?: number;
  /** Ограничение по осите */
  axis?: "x" | "y" | "both";
}

export interface ScrollTilt3D {
  /** Максимален наклон (deg) по X/Y при движение на мишката */
  maxTilt?: number;
  /** Перспектива в px (визуална дълбочина) */
  perspective?: number;
}

export interface ScrollOptions {
  vertical?: ScrollParallaxAxis;
  horizontal?: ScrollParallaxAxis;
  opacity?: ScrollOpacity;
  blur?: ScrollBlur;
  rotate?: ScrollRotate;
  scale?: ScrollScale;
  mouseTrack?: ScrollMouseTrack;
  tilt3d?: ScrollTilt3D;
}

/* ----------------------------------------------
 *  Компонентни пропсове
 * -------------------------------------------- */
export interface BoxMotionProps
  extends Omit<HTMLMotionProps<"div">, "children"> {
  /** Деца на компонента */
  children?: ReactNode;

  /** Entrance ефект за появяване */
  effect?: MotionEntranceEffect;

  /** Скорост на entrance анимацията */
  speed?: MotionSpeed;

  /** Забавяне на старта (секунди) */
  delay?: number;

  /** Stagger за децата (секунди между тях) */
  staggerChildren?: number;

  /** Пуска анимацията само веднъж при първо влизане в изглед */
  viewportOnce?: boolean;

  /** Каква част от елемента трябва да влезе в изгледа (0..1), за да стартира */
  viewportAmount?: number;

  /** Изключва entrance анимацията напълно */
  disabled?: boolean;

  /** Позволява подаване на custom variants; има приоритет над effect */
  variantsOverride?: Variants;

  /** Scrolling ефекти (parallax/opacity/blur/rotate/scale/mouse/tilt3d) */
  scroll?: ScrollOptions;

  /** System inline styles (сложи тук каквото подавате като sl в останалите компоненти) */
  sl?: any;
}
