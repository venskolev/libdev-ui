// src/components/Radio/Radio.styles.ts
// LibDev UI – Radio styles (Emotion)

import { css } from "@emotion/react";
import styled from "@emotion/styled";

/* sizes */
const SIZE = {
  sm: { outer: 16, dot: 8, gap: 8 },
  md: { outer: 20, dot: 10, gap: 10 },
  lg: { outer: 24, dot: 12, gap: 12 },
} as const;

export const sizeCss = (size: string) => {
  const s = (SIZE as any)[size] ?? SIZE.md;
  return css`
    --ld-radio-outer: ${s.outer}px;
    --ld-radio-dot: ${s.dot}px;
    --ld-radio-gap: ${s.gap}px;
  `;
};

/* variants – използваме var(--ld-radio-color) само за Action; етикетът остава с наследен цвят */
export const variantCss = (variant: string) => {
  const neutral = "var(--ld-color-border-default, rgba(0,0,0,.25))";

  switch (variant) {
    /* PLAIN: няма ринг; точката идва от <Icon> при checked */
    case "plain":
      return css`
        & .ld-Radio-action { color: var(--ld-radio-color, currentColor); }
        & .ld-Radio-radio {
          width: var(--ld-radio-outer);
          height: var(--ld-radio-outer);
          border-radius: 50%;
          border: 2px solid transparent; /* винаги прозрачно */
          background: transparent;
        }
        /* НЯМА промяна на border при checked за plain! */
        /* по желание: фокус индикация */
        &[data-focused] .ld-Radio-radio {
          box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 25%, transparent);
        }
        `;
        
        /* SOFT */
    case "soft":
      return css`
        & .ld-Radio-action { color: var(--ld-radio-color, currentColor); }
        & .ld-Radio-radio {
          width: var(--ld-radio-outer);
          height: var(--ld-radio-outer);
          border-radius: 50%;
          border: 2px solid ${neutral};
          background: color-mix(in srgb, currentColor 16%, transparent);
        }
        &[data-checked] .ld-Radio-radio {
          background: color-mix(in srgb, currentColor 28%, transparent);
          border-color: color-mix(in srgb, currentColor 60%, ${neutral});
        }
      `;

    /* SOLID */
    case "solid":
      return css`
        & .ld-Radio-action { color: var(--ld-radio-color, currentColor); }
        & .ld-Radio-radio {
          width: var(--ld-radio-outer);
          height: var(--ld-radio-outer);
          border-radius: 50%;
          border: 2px solid currentColor;
          background: currentColor;
        }
      `;
 /* OUTLINED (default) */
    case "outlined":
    default:
      return css`
        & .ld-Radio-action { color: var(--ld-radio-color, currentColor); }
        & .ld-Radio-radio {
          width: var(--ld-radio-outer);
          height: var(--ld-radio-outer);
          border-radius: 50%;
          border: 2px solid ${neutral}; /* винаги има ринг */
          background: transparent;
        }
        &[data-checked] .ld-Radio-radio {
          border-color: currentColor;     /* цветен ринг при checked */
        }
      `;
  }
};

/* base geometry */
export const Root = styled.span<{ $overlay?: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--ld-radio-gap);
  line-height: 1;

  &[data-disabled] {
    opacity: 0.55;
    pointer-events: none;
  }
`;

export const Action = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--ld-radio-outer);
  min-height: var(--ld-radio-outer);
  cursor: pointer;
  outline: 0;
`;

export const RadioVisual = styled.span`
  position: relative;
  display: inline-block;
  width: var(--ld-radio-outer);
  height: var(--ld-radio-outer);
  border-radius: 50%;
`;

export const Icon = styled.span`
  position: absolute;
  width: var(--ld-radio-dot);
  height: var(--ld-radio-dot);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  pointer-events: none;
  /* background идва от inline style (default точка = currentColor) */
`;

export const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 1px;
  height: 1px;
  left: -9999px;
`;

export const Label = styled.label`
  user-select: none;
  cursor: pointer;
`;
