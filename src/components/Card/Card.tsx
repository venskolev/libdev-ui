// src/components/Container/Card/Card.tsx
// LibDev UI – Custom React UI components

import React, { forwardRef } from "react";
import {
  type CardProps,
  type CardContentProps,
  type CardActionsProps,
  type CardCoverProps,
  type CardOverflowProps,
} from "./Card.types";
import {
  StyledCardRoot,
  StyledCardContent,
  StyledCardActions,
  StyledCardCover,
  StyledCardOverflow,
} from "./Card.styles";
import { getCardRootClasses, getCardDataAttrs } from "./Card.utils";
import { cardClasses } from "./Card.types";

// Импортираме типовете за sl, за да нормализираме без грешки
import type { SlProp, StyleArg } from "../../system/styleEngine";

/* -------------------------------------------------------
 * Помощници
 * ----------------------------------------------------- */

// Слива класове безопасно (пропуска празни/undefined)
function cx(...list: Array<string | undefined | false | null>): string {
  return list.filter(Boolean).join(" ");
}

// Нормализиране на sl: flatten до едно ниво и връщане като SlProp
function normalizeSl(...all: Array<SlProp | undefined>): SlProp | undefined {
  const out: StyleArg[] = [];
  for (const s of all) {
    if (!s) continue;
    if (Array.isArray(s)) {
      for (const item of s) out.push(item as StyleArg);
    } else {
      out.push(s as StyleArg);
    }
  }
  if (out.length === 0) return undefined;
  if (out.length === 1) return out[0]; // единичен StyleArg
  return out; // StyleArg[]
}

/* -------------------------------------------------------
 * Card (root)
 * ----------------------------------------------------- */

const CardRoot = forwardRef<HTMLDivElement, CardProps>(function CardRoot(
  props,
  ref
) {
  // Дефолти за стабилен ownerState
  const {
    children,
    color = "neutral",
    variant = "outlined",
    size = "md",
    orientation = "vertical",
    invertedColors = false,

    component, // пренасочваме към Emotion `as`
    slots,
    slotProps,

    className,
    sl,
    ...rest
  } = props;

  // Owner state → класове + data-* атрибути
  const owner = { color, variant, size, orientation, invertedColors };
  const classes = getCardRootClasses(owner);
  const dataAttrs = getCardDataAttrs(owner);

  // Избираме рут слота или нашия Styled
  const Root = (slots?.root as any) ?? StyledCardRoot;
  const rootSlotProps = (slotProps?.root ?? {}) as { sl?: SlProp; className?: string };

  // Нормализираме sl от родителя и слота
  const mergedSl = normalizeSl(sl, rootSlotProps.sl);
  const mergedClassName = cx(classes.join(" "), className, rootSlotProps.className);

  // За да избегнем конфликт с типовете при дублиране на пропсове, сглобяваме финален обект
  const finalProps = {
    ...rest,
    ...rootSlotProps,
    sl: mergedSl,
    className: mergedClassName,
  };

  return (
    <Root
      ref={ref}
      as={component as any}
      {...dataAttrs}
      {...finalProps}
    >
      {children}
    </Root>
  );
});

/* -------------------------------------------------------
 * CardContent
 * ----------------------------------------------------- */

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  function CardContent(props, ref) {
    const {
      children,
      orientation = "vertical",
      size = "md",
      component,
      slots,
      slotProps,
      className,
      sl,
      ...rest
    } = props;

    const Root = (slots?.root as any) ?? StyledCardContent;
    const rootSlotProps = (slotProps?.root ?? {}) as { sl?: SlProp; className?: string };

    const finalProps = {
      ...rest,
      ...rootSlotProps,
      sl: normalizeSl(sl, rootSlotProps.sl),
      orientation,
      size,
      className: cx(cardClasses.content, className, rootSlotProps.className),
    };

    return (
      <Root ref={ref} as={component as any} {...finalProps}>
        {children}
      </Root>
    );
  }
);

/* -------------------------------------------------------
 * CardActions
 * ----------------------------------------------------- */

const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(
  function CardActions(props, ref) {
    const {
      children,
      orientation = "horizontal",
      size = "md",
      buttonFlex,
      component,
      slots,
      slotProps,
      className,
      sl,
      ...rest
    } = props;

    const Root = (slots?.root as any) ?? StyledCardActions;
    const rootSlotProps = (slotProps?.root ?? {}) as { sl?: SlProp; className?: string };

    const finalProps = {
      ...rest,
      ...rootSlotProps,
      sl: normalizeSl(sl, rootSlotProps.sl),
      orientation,
      size,
      buttonFlex,
      className: cx(cardClasses.actions, className, rootSlotProps.className),
    };

    return (
      <Root ref={ref} as={component as any} {...finalProps}>
        {children}
      </Root>
    );
  }
);

/* -------------------------------------------------------
 * CardCover
 * ----------------------------------------------------- */

const CardCover = forwardRef<HTMLDivElement, CardCoverProps>(function CardCover(
  props,
  ref
) {
  const {
    children,
    component,
    slots,
    slotProps,
    className,
    sl,
    ...rest
  } = props;

  const Root = (slots?.root as any) ?? StyledCardCover;
  const rootSlotProps = (slotProps?.root ?? {}) as { sl?: SlProp; className?: string };

  const finalProps = {
    ...rest,
    ...rootSlotProps,
    sl: normalizeSl(sl, rootSlotProps.sl),
    className: cx(cardClasses.cover, className, rootSlotProps.className),
  };

  return (
    <Root ref={ref} as={component as any} {...finalProps}>
      {children}
    </Root>
  );
});

/* -------------------------------------------------------
 * CardOverflow
 * ----------------------------------------------------- */

const CardOverflow = forwardRef<HTMLDivElement, CardOverflowProps>(
  function CardOverflow(props, ref) {
    const {
      children,
      color = "neutral",
      variant = "plain",
      size = "md",
      component,
      slots,
      slotProps,
      className,
      sl,
      ...rest
    } = props;

    const Root = (slots?.root as any) ?? StyledCardOverflow;
    const rootSlotProps = (slotProps?.root ?? {}) as { sl?: SlProp; className?: string };

    const finalProps = {
      ...rest,
      ...rootSlotProps,
      sl: normalizeSl(sl, rootSlotProps.sl),
      color,
      variant,
      size,
      className: cx(cardClasses.overflow, className, rootSlotProps.className),
    };

    return (
      <Root ref={ref} as={component as any} {...finalProps}>
        {children}
      </Root>
    );
  }
);

/* -------------------------------------------------------
 * Public API export (with static subcomponents)
 * ----------------------------------------------------- */

// Тип за компонент със статични под-компоненти
type CardComponent = React.ForwardRefExoticComponent<
  CardProps & React.RefAttributes<HTMLDivElement>
> & {
  Content: typeof CardContent;
  Actions: typeof CardActions;
  Cover: typeof CardCover;
  Overflow: typeof CardOverflow;
};

// Създаваме основния компонент + статични полета
const Card = CardRoot as CardComponent;
Card.Content = CardContent;
Card.Actions = CardActions;
Card.Cover = CardCover;
Card.Overflow = CardOverflow;

// Имена за по-добра диагностика в React DevTools
Card.displayName = "Card";
CardContent.displayName = "Card.Content";
CardActions.displayName = "Card.Actions";
CardCover.displayName = "Card.Cover";
CardOverflow.displayName = "Card.Overflow";

export default Card;
export { CardContent, CardActions, CardCover, CardOverflow };
