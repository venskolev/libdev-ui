// src/components/BoxMotion/BoxMotion.tsx
// LibDev UI – Custom React UI components

import React, { useMemo, useRef } from "react";
import {
  type Variants,
  type MotionStyle,
  useMotionValue,
  useScroll,
  useTransform,
  useSpring,
  useMotionTemplate,
} from "framer-motion";
import { StyledMotionDiv } from "./BoxMotion.styles";
import type { BoxMotionProps } from "./BoxMotion.types";
import { buildEffectVariants, resolveTransition } from "./BoxMotion.utils";

/* ---------------------------------------------------------
 *  BoxMotion
 *  - Entrance ефекти (whileInView) + Scrolling ефекти (parallax)
 *  - Интеграция с layout енджина (applyCommonLayoutStyles в Styled)
 * ------------------------------------------------------- */

export const BoxMotion = React.forwardRef<HTMLDivElement, BoxMotionProps>(
  (
    {
      children,
      effect = "fadeIn",
      speed = "normal",
      delay = 0,
      staggerChildren,
      viewportOnce = true,
      viewportAmount = 0.2,
      disabled = false,
      variantsOverride,
      initial,
      animate,
      exit,
      whileInView,
      viewport,
      scroll,
      style,
      // приемаме sl, но не го пускаме към DOM; подаваме го като $styles към Styled слоя
      sl,
      ...rest
    },
    ref
  ) => {
    /* ------------------------------------------
     *  Подготовка на локален ref за useScroll target
     * ---------------------------------------- */
    const localRef = useRef<HTMLDivElement | null>(null);
    const targetRef = (node: HTMLDivElement | null) => {
      localRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref && "current" in (ref as any)) (ref as any).current = node;
    };

    const hasScroll =
      !!scroll &&
      (scroll.vertical ||
        scroll.horizontal ||
        scroll.opacity ||
        scroll.blur ||
        scroll.rotate ||
        scroll.scale);

    const hasMouse = !!scroll?.mouseTrack;
    const hasTilt = !!scroll?.tilt3d;

    /* ------------------------------------------
     *  Motion values за скрол
     * ---------------------------------------- */
    const { scrollYProgress } = useScroll({
      target: localRef,
      offset: ["start end", "end start"],
    });

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mOpacity = useMotionValue(1);
    const mRotate = useMotionValue(0);
    const mScale = useMotionValue(1);
    const mBlur = useMotionValue(0);

    if (hasScroll) {
      if (scroll?.vertical) {
        const from = scroll.vertical.from ?? 0;
        const to = scroll.vertical.to ?? 0;
        const yT = useTransform(scrollYProgress, [0, 1], [from, to]);
        yT.on("change", (v) => y.set(v));
      }
      if (scroll?.horizontal) {
        const from = scroll.horizontal.from ?? 0;
        const to = scroll.horizontal.to ?? 0;
        const xT = useTransform(scrollYProgress, [0, 1], [from, to]);
        xT.on("change", (v) => x.set(v));
      }
      if (scroll?.opacity) {
        const from = scroll.opacity.from ?? 1;
        const to = scroll.opacity.to ?? 1;
        const oT = useTransform(scrollYProgress, [0, 1], [from, to]);
        oT.on("change", (v) => mOpacity.set(v));
      }
      if (scroll?.rotate) {
        const from = scroll.rotate.from ?? 0;
        const to = scroll.rotate.to ?? 0;
        const rT = useTransform(scrollYProgress, [0, 1], [from, to]);
        rT.on("change", (v) => mRotate.set(v));
      }
      if (scroll?.scale) {
        const from = scroll.scale.from ?? 1;
        const to = scroll.scale.from === undefined && scroll.scale.to === undefined ? 1 : (scroll.scale.to ?? 1);
        const sT = useTransform(scrollYProgress, [0, 1], [from, to]);
        sT.on("change", (v) => mScale.set(v));
      }
      if (scroll?.blur) {
        const from = scroll.blur.from ?? 0;
        const to = scroll.blur.to ?? 0;
        const bT = useTransform(scrollYProgress, [0, 1], [from, to]);
        bT.on("change", (v) => mBlur.set(v));
      }
    }

    /* ------------------------------------------
     *  Mouse track и 3D tilt
     * ---------------------------------------- */
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!hasMouse && !hasTilt) return;
      const rect = localRef.current?.getBoundingClientRect();
      if (!rect) return;

      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      mouseX.set(nx);
      mouseY.set(ny);

      if (hasMouse) {
        const strength = scroll?.mouseTrack?.strength ?? 12;
        const axis = scroll?.mouseTrack?.axis ?? "both";
        if (axis === "both" || axis === "x") x.set(nx * strength);
        if (axis === "both" || axis === "y") y.set(ny * strength);
      }
    };

    const onMouseLeave = () => {
      if (hasMouse) {
        x.set(0);
        y.set(0);
      }
      if (hasTilt) {
        rotateX.set(0);
        rotateY.set(0);
      }
    };

    const tiltMax = scroll?.tilt3d?.maxTilt ?? 8;
    const perspective = scroll?.tilt3d?.perspective ?? 800;

    const rotateX = useSpring(useTransform(mouseY, [-1, 1], [tiltMax, -tiltMax]), {
      stiffness: 200,
      damping: 18,
    });
    const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-tiltMax, tiltMax]), {
      stiffness: 200,
      damping: 18,
    });

    // CSS filter: blur(px)
    const filter = useMotionTemplate`blur(${mBlur}px)`;

    /* ------------------------------------------
     *  Entrance анимации (variants/transition)
     * ---------------------------------------- */
    const variants: Variants = useMemo(
      () => variantsOverride ?? buildEffectVariants(effect),
      [variantsOverride, effect]
    );

    const transition = useMemo(
      () => resolveTransition(speed, delay, staggerChildren, effect),
      [speed, delay, staggerChildren, effect]
    );

    const computedViewport = viewport ?? { once: viewportOnce, amount: viewportAmount };
    const hasUserAnimate = typeof animate !== "undefined";

    // ✅ MotionStyle – подавай MotionValues САМО ако са активни съответните ефекти
    const finalStyle: MotionStyle = {
      ...(style as MotionStyle),
      ...(hasMouse || scroll?.horizontal ? { x } : null),
      ...(hasMouse || scroll?.vertical ? { y } : null),
      ...(scroll?.opacity ? { opacity: mOpacity } : null),
      ...(scroll?.rotate ? { rotateZ: mRotate } : null), // rotateZ за по-чист тип
      ...(scroll?.scale ? { scale: mScale } : null),
      ...(scroll?.blur ? { filter } : null),
      ...(hasTilt
        ? {
            rotateX,
            rotateY,
            transformPerspective: perspective,
          }
        : null),
    };

    // ✅ SL → подаваме към Styled слоя като $styles, за да не изтича към DOM
    const $styles = (rest as any).$styles ?? sl;

    // ✅ Ако entrance е изключен – няма variants/whileInView/viewport
    if (disabled) {
      const mouseHandlers = hasMouse || hasTilt ? { onMouseMove, onMouseLeave } : {};
      // ✅ Връщаме StyledMotionDiv без entrance анимации
      // - ref → targetRef (useScroll)
      return (
        <StyledMotionDiv
          ref={targetRef}
          style={finalStyle}
          $styles={$styles as any}
          {...mouseHandlers}
          {...rest}
        >
          {children}
        </StyledMotionDiv>
      );
    }

    // ✅ Без конфликт animate ↔ whileInView:
    // - ако user е подал animate → уважаваме го, НЕ подаваме whileInView/viewport
    // - иначе → classic on-view reveal
    const entranceProps = hasUserAnimate
      ? { initial: initial ?? "hidden", animate, exit: exit ?? "hidden" }
      : {
          initial: initial ?? "hidden",
          whileInView: whileInView ?? "visible",
          viewport: computedViewport,
          exit: exit ?? "hidden",
        };

    const mouseHandlers = hasMouse || hasTilt ? { onMouseMove, onMouseLeave } : {};

    // ✅ Връщаме StyledMotionDiv с entrance анимации
    // - ref → targetRef (useScroll)
    return (
      <StyledMotionDiv
        ref={targetRef}
        variants={variants}
        transition={transition}
        style={finalStyle}
        $styles={$styles as any}
        {...entranceProps}
        {...mouseHandlers}
        {...rest}
      >
        {children}
      </StyledMotionDiv>
    );
  }
);

BoxMotion.displayName = "BoxMotion";
