import styled from "@emotion/styled";
import { css } from "@emotion/react";

/* ---------------------------------------------
 *  Стилизация на слотовете – без хардкоднати цветове.
 *  Използваме CSS променливи и data-атрибути.
 * ------------------------------------------- */

export const Root = styled.span<{ $overlay?: boolean }>`
  /* Базов контейнер */
  position: ${({ $overlay }) => ($overlay ? "initial" : "relative")};
  display: inline-flex;
  align-items: center;
  gap: 8px;
  vertical-align: middle;

  /* Data флагове от логиката */
  &[data-disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const Action = styled.span`
  /* Клик зона – поема hover/focus ефекти */
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  /* Размери през CSS променливи – идват от варианта/size */
  width: var(--ld-radio-size, 20px);
  height: var(--ld-radio-size, 20px);
  border-radius: 999px;

  /* Фокус ринг */
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--ld-color-primary-contrast, rgba(59,130,246,.35));
  }
`;

export const RadioVisual = styled.span`
  /* Визуален пръстен (бордър) */
  position: absolute;
  inset: 0;
  border-radius: 999px;
  border: 2px solid var(--ld-radio-border, currentColor);
  background: var(--ld-radio-bg, transparent);
`;

/* Абсолютен wrapper, който държи точката/иконата винаги центрирана */
export const IconWrap = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export const Icon = styled.span`
  /* Вътрешната точка (checked) или custom икона */
  position: relative;
  display: inline-flex;            /* важен fix за custom икони */
  align-items: center;             /* центриране по Y */
  justify-content: center;         /* центриране по X */
  width: calc(var(--ld-radio-size, 20px) * 0.5);
  height: calc(var(--ld-radio-size, 20px) * 0.5);
  border-radius: 999px;
  line-height: 0;                  /* да няма baseline от текста */
  vertical-align: middle;          /* безопасност за inline контекст */

  /* Когато потребителят подаде SVG/спан, да не „потъва“ по baseline */
  & > svg, & > span, & > i {
    display: block;
    line-height: 0;
  }
`;

export const HiddenInput = styled.input`
  /* Скриваме нативния radio, но запазваме достъпността */
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 1px;
  height: 1px;
`;

export const Label = styled.label`
  /* Текстов label */
  cursor: inherit;
  user-select: none;
  line-height: 1.2;
`;

/* ---------------------------------------------
 *  Варианти/размери през CSS custom props
 * ------------------------------------------- */
export const sizeCss = (size: string | undefined) => css`
  --ld-radio-size: ${size === "sm" ? "18px" : size === "lg" ? "22px" : "20px"};
`;

export const variantCss = (variant?: string) => css`
  /* Placeholder – визуалните цветове да се закачат към вашите CSS vars */
  --ld-radio-border: var(--ld-color-border, currentColor);
  --ld-radio-bg: transparent;

  &[data-checked] {
    --ld-radio-border: var(--ld-color-primary, currentColor);
    --ld-radio-bg: var(--ld-color-primary-solidBg, transparent);
  }

  &[data-disabled] {
    --ld-radio-border: var(--ld-color-border-muted, currentColor);
  }
`;
