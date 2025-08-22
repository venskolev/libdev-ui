// src/components/Menu/Menu.styles.ts
// LibDev UI – Menu styles (Emotion-safe Theme)

import styled from "@emotion/styled";
import { css, type Theme } from "@emotion/react";

import { layoutMixin } from "../../system/layout.mixin";
import type { CommonLayoutProps } from "../../system/layout.types";

import type { SlProp, LibDevTheme } from "../../system/styleEngine";
import { resolveSl, defaultTheme } from "../../system/styleEngine";

export type StyleProps = {
  sl?: SlProp;
} & CommonLayoutProps & {
  theme?: Theme;
};

const BLOCKED_PROPS = new Set<string>([
  "p","px","py","pt","pr","pb","pl",
  "m","mx","my","mt","mr","mb","ml",
  "width","minWidth","maxWidth","height","minHeight","maxHeight",
  "position","inset","top","right","bottom","left",
  "overflow","overflowX","overflowY",
  "flexBasis","flexShrink","flexGrow",
  "gridArea","gridColumn","gridColumnStart","gridColumnEnd",
  "gridRow","gridRowStart","gridRowEnd",
  "sl",
]);
const shouldForward = (prop: string) => !BLOCKED_PROPS.has(prop);

/* -------- Emotion Theme → LibDevTheme bridge -------- */
const toSpacingFn = (s: any) => {
  if (typeof s === "function") return s;
  if (typeof s === "number") return (n: number) => n * s;
  return defaultTheme.spacing;
};
const getLdTheme = (t?: Theme): LibDevTheme => {
  const anyT = (t as any) || {};
  const merged: any = { ...defaultTheme, ...anyT };
  merged.spacing = toSpacingFn(anyT.spacing);
  if (!merged.breakpoints) merged.breakpoints = defaultTheme.breakpoints;
  return merged as LibDevTheme;
};

const slCss = (p: StyleProps) => {
  const th = getLdTheme(p.theme);
  const obj = resolveSl(p.sl, th) as Record<string, any> | undefined;
  return obj ? css(obj as any) : null;
};
const styledMixins = (p: StyleProps) => {
  const th = getLdTheme(p.theme);
  return css`
    ${layoutMixin({ ...(p as any), theme: th })}
    ${slCss(p)}
  `;
};

/* -------------------- bases -------------------- */
const popupBase = css`
  position: relative;
  min-width: 160px;
  max-width: min(92vw, var(--available-width, 480px));
  max-height: min(80vh, var(--available-height, 480px));
  overflow: auto;

  background: var(--ld-color-background-level1, #fff);
  color: var(--ld-color-text, #0f172a);
  border: 1px solid var(--ld-color-border, #e2e8f0);
  border-radius: var(--ld-radius-lg, 16px);
  box-shadow: var(--ld-shadow-lg, 0 8px 24px rgba(0,0,0,.18));

  &[data-size="sm"] { padding: 4px;  font-size: 12px; }
  &[data-size="md"] { padding: 6px;  font-size: 14px; }
  &[data-size="lg"] { padding: 8px;  font-size: 16px; }

  &[data-variant="outlined"] { background: var(--ld-color-background-level1, #fff); }
  &[data-variant="plain"]    { background: transparent; border-color: transparent; box-shadow: none; }
  &[data-variant="soft"]     { background: var(--ld-color-surface-soft, var(--ld-color-background-level2, #f1f5f9)); }
  &[data-variant="solid"]    { background: var(--ld-color-surface-solid, var(--ld-color-primary, #3b82f6)); color: var(--ld-color-contrast, #fff); }
`;

const itemBase = css`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: var(--ld-radius-md, 8px);
  user-select: none;
  cursor: pointer;
  color: inherit;

  &[data-disabled] {
    opacity: .5;
    cursor: not-allowed;
  }

  &:hover:not([data-disabled]),
  &[data-highlighted] {
    background: var(--ld-color-primary-softBg, rgba(59,130,246,.12));
    color: var(--ld-color-primary-plainColor, var(--ld-color-primary, currentColor));
  }

  .ld-MenuRadioItemIndicator,
  .ld-MenuCheckboxItemIndicator {
    width: 16px;
    height: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;

const separatorBase = css`
  height: 1px;
  margin: 6px 0;
  /* по-видим разделител: divider → border (fallback), без opacity */
  background: var(--ld-color-divider, var(--ld-color-border, #e2e8f0));
`;

const groupBase = css`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const groupLabelBase = css`
  padding: 6px 10px;
  font-size: 11px;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: var(--ld-color-text-secondary, #9ca3af);
`;

/* Тригър – ясно видим по подразбиране; sl може да override-ва */
const triggerBase = css`
  -webkit-appearance: none;
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: var(--ld-radius-md, 8px);
  background: var(--ld-button-bg, var(--ld-color-background-level2, #f1f5f9));
  color: var(--ld-button-fg, var(--ld-color-text, #0f172a));
  border: 1px solid var(--ld-button-border, var(--ld-color-border, #e2e8f0));
  box-shadow: var(--ld-shadow-xs, 0 1px 2px rgba(0,0,0,.06));
  cursor: pointer;
  line-height: 1.25;

  &:hover { background: var(--ld-button-bg-hover, var(--ld-color-background-level1, #fff)); }
  &:focus-visible { outline: 2px solid var(--ld-color-primary, #3b82f6); outline-offset: 2px; }
  &[data-disabled] { opacity: .5; cursor: not-allowed; }
`;

/* -------------------- styled parts -------------------- */
export const Backdrop = styled("div", { shouldForwardProp: shouldForward })<StyleProps>`
  position: fixed;
  inset: 0;
  background: transparent;
  pointer-events: none;
  ${styledMixins}

  &[data-open]   { pointer-events: auto; }
  &[data-closed] { pointer-events: none; }
`;

export const Positioner = styled("div", { shouldForwardProp: shouldForward })<StyleProps>`
  position: absolute;
  z-index: 1000;
  pointer-events: none;
  & > * { pointer-events: auto; }
  ${styledMixins}
`;

export const Popup = styled("div", { shouldForwardProp: shouldForward })<StyleProps>`
  ${popupBase}
  ${styledMixins}
  transform-origin: var(--transform-origin, top center);
  will-change: transform, opacity;

  &[data-instant] {
    transition: none !important;
    animation: none !important;
  }
`;

export const Arrow = styled("div", { shouldForwardProp: shouldForward })<StyleProps>`
  position: absolute;
  width: 12px;
  height: 12px;
  ${styledMixins}

  &:before {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--ld-color-background-level1, #fff);
    border: 1px solid var(--ld-color-border, #e2e8f0);
    transform: rotate(45deg);
  }

  &[data-side="top"]    { bottom: -6px; left: var(--ld-arrow-left, calc(50% - 6px)); }
  &[data-side="bottom"] { top:    -6px; left: var(--ld-arrow-left, calc(50% - 6px)); }
  &[data-side="left"]   { right:  -6px; top:  var(--ld-arrow-top,  calc(50% - 6px)); }
  &[data-side="right"]  { left:   -6px; top:  var(--ld-arrow-top,  calc(50% - 6px)); }
`;

export const Item = styled("div", { shouldForwardProp: shouldForward })<StyleProps>`
  ${itemBase}
  ${styledMixins}
`;

export const Separator = styled("div", { shouldForwardProp: shouldForward })<StyleProps>`
  ${separatorBase}
  ${styledMixins}
`;

export const Group = styled("div", { shouldForwardProp: shouldForward })<StyleProps>`
  ${groupBase}
  ${styledMixins}
`;

export const GroupLabel = styled("div", { shouldForwardProp: shouldForward })<StyleProps>`
  ${groupLabelBase}
  ${styledMixins}
`;

export const TriggerBtn = styled("button", { shouldForwardProp: shouldForward })<StyleProps>`
  ${triggerBase}
  ${styledMixins}
`;

export const TriggerDiv = styled("div", { shouldForwardProp: shouldForward })<StyleProps>`
  ${triggerBase}
  ${styledMixins}
`;

export const Indicator = styled("div", { shouldForwardProp: shouldForward })<StyleProps>`
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${styledMixins}
`;
