// src/components/Switch/Switch.styles.ts
// LibDev UI – Switch styles (Emotion) v2 — фиксове за ownerState и layout

import styled from "@emotion/styled";
import { css as emCss, keyframes } from "@emotion/react";
import type { SwitchOwnerState } from "./Switch.types";
import { compileStyle } from "../../system/resolveStyle";

/* -------------------------------------------------
 *  Пропсове, които не стигат до DOM
 * ------------------------------------------------- */
const STYLE_ONLY_PROPS = new Set<string>([
  "as",
  "component",
  "variant",
  "size",
  "color",
  "radius",
  "checked",
  "disabled",
  "readOnly",
  "focusVisible",
  "borderAnimation",
  "borderWidth",
  "borderColors",
  "borderAnimationSpeed",
  "sl",
  "slotProps",
  "slots",
  "startDecorator",
  "endDecorator",
  "ownerState", // важно: да не изтича като ownerstate="[object Object]"
]);

/* -------------------------------------------------
 *  Помощни: цветови стойности
 * ------------------------------------------------- */
const isCssVar = (v?: string) => !!v && v.trim().startsWith("var(");
const isColorLiteral = (v?: string) =>
  !!v && (v.startsWith("#") || v.startsWith("rgb(") || v.startsWith("hsl("));

const colorVar = (c?: string) => {
  if (!c) return "var(--ld-color-primary)";
  if (isCssVar(c) || isColorLiteral(c)) return c;
  return `var(--ld-color-${String(c).replace(/\./g, "-")})`;
};

/* -------------------------------------------------
 *  Размери – v2 (по-нисък профил)
 * ------------------------------------------------- */
const SIZE_MAP = {
  sm: { trackW: 28, trackH: 16, thumb: 12, pad: 2 },
  md: { trackW: 40, trackH: 20, thumb: 16, pad: 2 },
  lg: { trackW: 52, trackH: 28, thumb: 22, pad: 2 },
} as const;

// CSS променливи според размера
export const sizeCss = (ownerState: Pick<SwitchOwnerState, "size">) => {
  const s = ownerState.size ?? "md";
  const v = SIZE_MAP[s as keyof typeof SIZE_MAP] ?? SIZE_MAP.md;

  return emCss`
    --ld-switch-track-w: ${v.trackW}px;
    --ld-switch-track-h: ${v.trackH}px;
    --ld-switch-thumb: ${v.thumb}px;
    --ld-switch-pad: ${v.pad}px;
    --ld-switch-x-checked: calc(var(--ld-switch-track-w) - var(--ld-switch-thumb) - var(--ld-switch-pad) * 2);
  `;
};

/* -------------------------------------------------
 *  Варианти – отделна променлива за ширина на борда
 * ------------------------------------------------- */
export const variantCss = (
  ownerState: Pick<SwitchOwnerState, "variant" | "color">
) => {
  const variant = ownerState.variant ?? "filled";
  const c = colorVar(ownerState.color ?? "primary");
  const cHover = colorVar(`${String(ownerState.color ?? "primary")}.hover`);

  if (variant === "outlined") {
    return emCss`
      --ld-switch-track-bg: transparent;
      --ld-switch-track-bg-checked: ${c};
      --ld-switch-track-border: color-mix(in oklab, ${c} 26%, transparent);
      --ld-switch-track-border-w: 1px; /* реален борд */
      --ld-switch-thumb-bg: var(--ld-color-white, #fff);
      --ld-switch-thumb-fg: ${c};
      --ld-switch-track-shadow-focus: 0 0 0 3px color-mix(in oklab, ${c} 18%, transparent);
      --ld-switch-track-shadow-checked: none;
      --ld-switch-border-mode: gradient;
    `;
  }
  if (variant === "ghost") {
    return emCss`
      --ld-switch-track-bg: color-mix(in oklab, ${c} 10%, transparent);
      --ld-switch-track-bg-checked: ${c};
      --ld-switch-track-border: color-mix(in oklab, ${c} 26%, transparent);
      --ld-switch-track-border-w: 1px; /* лек борд */
      --ld-switch-thumb-bg: var(--ld-color-white, #fff);
      --ld-switch-thumb-fg: ${cHover};
      --ld-switch-track-shadow-focus: 0 0 0 3px color-mix(in oklab, ${c} 18%, transparent);
      --ld-switch-track-shadow-checked: none;
      --ld-switch-border-mode: focus-only;
    `;
  }
  // filled
  return emCss`
    --ld-switch-track-bg: color-mix(in oklab, ${c} 60%, ${colorVar("background.level2")});
    --ld-switch-track-bg-checked: ${c};
    --ld-switch-track-border: transparent;
    --ld-switch-track-border-w: 0px; /* критично: без layout ефект */
    --ld-switch-thumb-bg: var(--ld-color-white, #fff);
    --ld-switch-thumb-fg: ${cHover};
    --ld-switch-track-shadow-focus: 0 0 0 3px color-mix(in oklab, ${c} 18%, transparent);
    --ld-switch-track-shadow-checked: none;
    --ld-switch-border-mode: glow;
  `;
};

/* -------------------------------------------------
 *  Анимации на борда – вътре в TRACK
 * ------------------------------------------------- */
const spin = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const glowPulse = keyframes`
  0% { box-shadow: 0 0 0 0 color-mix(in oklab, var(--ld-switch-border-base) 35%, transparent); }
  70% { box-shadow: 0 0 0 8px color-mix(in oklab, var(--ld-switch-border-base) 0%, transparent); }
  100% { box-shadow: 0 0 0 0 color-mix(in oklab, var(--ld-switch-border-base) 0%, transparent); }
`;

// Генерира CSS за анимиран борд, който е ограничен в релсата (окото)
const trackAnimatedBorderCss = (owner: Pick<
  SwitchOwnerState,
  "borderAnimation" | "borderWidth" | "color" | "variant" | "disabled" | "readOnly"
>) => {
  const width = owner.borderWidth ?? 2;
  const speedMs = 2600; // по-бавно за „луксозно“ усещане
  const c = colorVar(owner.color ?? "primary");

  const gradient = `
    linear-gradient(90deg,
      ${c},
      color-mix(in oklab, ${c} 80%, white),
      color-mix(in oklab, ${c} 55%, black),
      ${c}
    )
  `;

  const base = emCss`
    position: relative;
    overflow: hidden; /* гарантирано не излиза от окото */
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      padding: ${typeof width === "number" ? `${width}px` : width};
      background: var(--ld-switch-border-gradient, ${gradient});
      background-size: 300% 300%;
      pointer-events: none;
      -webkit-mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0; /* показва се според режимите по-долу */
    }
  `;

  if (owner.disabled || owner.readOnly) return emCss`${base}`;

  if (owner.borderAnimation === "gradient") {
    return emCss`
      ${base}
      &::before {
        animation: ${spin} var(--ld-switch-border-speed, ${speedMs}ms) linear infinite;
      }
      [data-checked] &::before { opacity: ${owner.variant === "ghost" ? 0 : 0.55}; }
      [data-focused] &::before { opacity: 0.55; }
    `;
  }

  if (owner.borderAnimation === "glow") {
    return emCss`
      --ld-switch-border-base: ${c};
      transition: box-shadow 180ms ease;
      [data-focused] & { box-shadow: 0 0 0 4px color-mix(in oklab, ${c} 22%, transparent); }
      [data-checked] & { box-shadow: 0 0 0 6px color-mix(in oklab, ${c} 18%, transparent); }
      [data-checked][data-focused] & { box-shadow: 0 0 0 8px color-mix(in oklab, ${c} 20%, transparent); }
    `;
  }

  if (owner.borderAnimation === "pulse") {
    return emCss`
      --ld-switch-border-base: ${c};
      position: relative;
      &::after {
        content: "";
        position: absolute;
        inset: -2px;
        border-radius: inherit;
        pointer-events: none;
        opacity: 0;
      }
      [data-checked] &::after,
      [data-focused] &::after {
        opacity: 1;
        animation: ${glowPulse} 1600ms ease-out infinite;
      }
    `;
  }

  return emCss`${base}`;
};

/* -------------------------------------------------
 *  Styled слотове
 * ------------------------------------------------- */

type RootStyleProps = {
  sl?: unknown; // стил-override през design системата
  ownerState: SwitchOwnerState;
} & React.HTMLAttributes<HTMLElement>;

/** Root контейнер – по подразбиране <label> */
export const Root = styled("label", {
  shouldForwardProp: (prop) => !STYLE_ONLY_PROPS.has(String(prop)),
})<RootStyleProps>(({ ownerState, sl }) => {
  // Нормализиране на радиуса
  const radius =
    typeof ownerState.radius === "number" || String(ownerState.radius || "")?.endsWith("px")
      ? String(ownerState.radius)
      : `var(--ld-radius-${ownerState.radius ?? "xl"}, 20px)`;

  const slObj = sl ? (compileStyle(sl as any) as any) : undefined;

  return emCss`
    ${sizeCss(ownerState)}
    ${variantCss(ownerState)}
    ${slObj || ""}

    position: relative;
    display: inline-flex;
    align-items: center;
    vertical-align: middle; /* стабилно подравняване в текст */
    line-height: 1;
    gap: 8px;
    cursor: ${ownerState.disabled ? "not-allowed" : "pointer"};
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    ${ownerState.disabled ? "pointer-events: none;" : ""}
    border-radius: ${radius};
  `;
});

/** Track – („оченцето“) */
export const Track = styled("span", {
  shouldForwardProp: (prop) => !STYLE_ONLY_PROPS.has(String(prop)),
})<{ ownerState: SwitchOwnerState }>(({ ownerState }) => {
  const radius =
    typeof ownerState.radius === "number" || String(ownerState.radius || "")?.endsWith("px")
      ? String(ownerState.radius)
      : `var(--ld-radius-${ownerState.radius ?? "xl"}, 20px)`;

  return emCss`
    position: relative;
    width: var(--ld-switch-track-w);
    height: var(--ld-switch-track-h);
    border-radius: ${radius};
    background: var(--ld-switch-track-bg);
    border: var(--ld-switch-track-border-w, 0px) solid var(--ld-switch-track-border);
    box-shadow: none;
    transition: background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
    ${trackAnimatedBorderCss(ownerState)}

    /* Checked → фон и рамка */
    [data-checked] & {
      background: var(--ld-switch-track-bg-checked);
      border-color: transparent;
      box-shadow: var(--ld-switch-track-shadow-checked, none);
    }

    /* Фокус ring */
    [data-focused] & {
      box-shadow: var(--ld-switch-track-shadow-focus, none);
    }
  `;
});

/** Thumb – палецът */
export const Thumb = styled("span", {
  shouldForwardProp: (prop) => !STYLE_ONLY_PROPS.has(String(prop)),
})<{ ownerState: SwitchOwnerState }>(({ ownerState }) => {
  return emCss`
    position: absolute;
    top: var(--ld-switch-pad);
    left: var(--ld-switch-pad);
    width: var(--ld-switch-thumb);
    height: var(--ld-switch-thumb);
    border-radius: 9999px;
    background: var(--ld-switch-thumb-bg);
    color: var(--ld-switch-thumb-fg);
    box-shadow: 0 2px 4px rgba(0,0,0,.18);
    will-change: transform;
  `;
});

/** Action – hit-area + hover/press слой */
export const Action = styled("div", {
  shouldForwardProp: (prop) => !STYLE_ONLY_PROPS.has(String(prop)),
})<{ ownerState: SwitchOwnerState }>(({ ownerState }) => {
  return emCss`
    position: absolute;
    inset: 0;
    border-radius: inherit;
    &::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      opacity: 0;
      transition: opacity 120ms ease;
      background: color-mix(in oklab, var(--ld-color-text-secondary, #9ca3af) 10%, transparent);
      pointer-events: none;
    }
    :where(:not([data-disabled]):not([data-readonly])):hover &::after { opacity: .05; }
    :where(:not([data-disabled]):not([data-readonly])):active &::after { opacity: .10; }
  `;
});

export const HiddenInput = styled("input", {
  // НЕ допускаме да „изтичат“ не-HTML пропсове към DOM:
  shouldForwardProp: (prop) =>
    prop !== "as" &&           // ⬅️ блокираме polymorphic пропа да стига до <input>
    prop !== "ownerState" &&   // ⬅️ вътрешен проп, не е за DOM
    prop !== "sl" &&           // ⬅️ системен стил проп, не е за DOM
    prop !== "slotProps" &&    // ⬅️ вътрешен
    prop !== "slots"           // ⬅️ вътрешен
})({
  position: "absolute",
  opacity: 0,
  pointerEvents: "none",
  margin: 0,
  width: 0,
  height: 0,
  inset: "auto",
});