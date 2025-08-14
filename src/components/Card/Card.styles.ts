// src/components/Container/Card/Card.styles.ts
// LibDev UI – Custom React UI components

import styled from "@emotion/styled";
import { css } from "@emotion/react";
import type {
  CardProps,
  CardOwnerState,
  CardContentProps,
  CardActionsProps,
  CardCoverProps,
  CardOverflowProps,
} from "./Card.types";
import {
  buildRootStyleRecipe,
  buildContentStyleRecipe,
  buildActionsStyleRecipe,
  buildOverflowStyleRecipe,
  isHorizontal,
} from "./Card.utils";
import { applyCommonLayoutStyles } from "../../system/layout.mixin";
import { resolveSl, defaultTheme, type LibDevTheme } from "../../system/styleEngine";

/* -------- filter props that shouldn't hit the DOM -------- */
const STYLE_ONLY_PROPS = new Set<string>([
  "component","color","variant","size","orientation","invertedColors","buttonFlex","sl","shadow",
  "m","mx","my","mt","mr","mb","ml",
  "p","px","py","pt","pr","pb","pl",
  "width","minWidth","maxWidth","height","minHeight","maxHeight",
  "position","inset","top","right","bottom","left",
  "overflow","overflowX","overflowY",
  "flexBasis","flexShrink","flexGrow",
  "gridArea","gridColumn","gridColumnStart","gridColumnEnd",
  "gridRow","gridRowStart","gridRowEnd",
]);
const shouldForwardProp = (prop: string) => !STYLE_ONLY_PROPS.has(prop);

/* -------- helpers for sl/layout -------- */
const pickTheme = (theme?: any): LibDevTheme =>
  (theme?.breakpoints && theme?.spacing) ? (theme as LibDevTheme) : defaultTheme;

const applySl = (sl: any, theme?: any) => {
  if (!sl) return null;
  const th = pickTheme(theme);
  const resolved = resolveSl(sl, th) as Record<string, any>;
  return css(resolved as any);
};

/* ------------------------ Styled: Card (root) ------------------------ */
export const StyledCardRoot = styled("div", { shouldForwardProp })<CardProps>(
  ({ theme, color, variant, size, orientation, invertedColors, shadow, sl, ...rest }) => {
    const owner: CardOwnerState = { color, variant, size, orientation, invertedColors, shadow };

    const recipe = buildRootStyleRecipe(owner);
    const layoutCss = applyCommonLayoutStyles({ ...(rest as any), theme: pickTheme(theme) });
    const slCss = applySl(sl, theme);

    return css`
      ${css(recipe as any)}
      ${layoutCss}

      ${isHorizontal(orientation) &&
      css`
        & > .ld-CardContent-root { flex: 1 1 auto; }
      `}

      ${slCss}
    `;
  }
);

/* ------------------------ Styled: CardContent ------------------------ */
export const StyledCardContent = styled("div", { shouldForwardProp })<CardContentProps>(
  ({ theme, orientation, size, sl, ...rest }) => {
    const base = buildContentStyleRecipe({ orientation, size });
    const layoutCss = applyCommonLayoutStyles({ ...(rest as any), theme: pickTheme(theme) });
    const slCss = applySl(sl, theme);

    return css`${css(base as any)}${layoutCss}${slCss}`;
  }
);

/* ------------------------ Styled: CardActions ------------------------ */
export const StyledCardActions = styled("div", { shouldForwardProp })<CardActionsProps>(
  ({ theme, orientation, size, buttonFlex, sl, ...rest }) => {
    const base = buildActionsStyleRecipe({ orientation, size, buttonFlex });
    const layoutCss = applyCommonLayoutStyles({ ...(rest as any), theme: pickTheme(theme) });
    const slCss = applySl(sl, theme);

    return css`
      ${css(base as any)}
      ${layoutCss}
      & > * { flex: var(--ld-card-action-flex, initial); }
      ${slCss}
    `;
  }
);

/* ------------------------ Styled: CardCover ------------------------ */
export const StyledCardCover = styled("div", { shouldForwardProp })<CardCoverProps>(
  ({ theme, sl, ...rest }) => {
    const layoutCss = applyCommonLayoutStyles({ ...(rest as any), theme: pickTheme(theme) });
    const slCss = applySl(sl, theme);

    return css`
      display: block;
      overflow: hidden;
      ${layoutCss}
      ${slCss}
    `;
  }
);

/* ------------------------ Styled: CardOverflow ------------------------ */
export const StyledCardOverflow = styled("div", { shouldForwardProp })<CardOverflowProps>(
  ({ theme, color, variant, size, sl, ...rest }) => {
    const base = buildOverflowStyleRecipe({ color, variant, size });
    const layoutCss = applyCommonLayoutStyles({ ...(rest as any), theme: pickTheme(theme) });
    const slCss = applySl(sl, theme);

    return css`${css(base as any)}${layoutCss}${slCss}`;
  }
);
