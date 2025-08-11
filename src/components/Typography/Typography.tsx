// src/components/Typography/Typography.tsx
// LibDev UI – Custom React UI components
// Базов типографски компонент с полиморфичен root елемент и
// поддръжка на стилове, декоратори и responsive layout.

import * as React from "react";
import { StyledTypography } from "./Typography.styles";
import type {
  TypographyComponent,
  TypographyProps,
  LevelMapping,
  TextLevel,
} from "./Typography.types";

/* -------------------------------------------------------------
 * ВНИМАНИЕ:
 * - Работим полиморфично: `as` / `component` сменят root елемента.
 * - `sl` е стандартизираният inline-стил слой; обединяваме го с `style`.
 * - Слотове: root/startDecorator/endDecorator + slotProps.
 * - levelMapping: по подразбиране → тук в компонента (без външен файл).
 * ----------------------------------------------------------- */

/** Базов mapping ниво → HTML елемент; може да се override-не чрез `levelMapping` пропса */
const DEFAULT_LEVEL_MAPPING: Required<LevelMapping> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  "title-lg": "p",
  "title-md": "p",
  "title-sm": "p",
  "body-lg": "p",
  "body-md": "p",
  "body-sm": "p",
  "body-xs": "span",
  inherit: "p",
};

/** Помощен merge за className (пази реда и избягва фалшиви интервали) */
const cx = (...parts: Array<string | undefined | false | null>) =>
  parts.filter(Boolean).join(" ");

/** Подреден merge за стилове:
 *  1) sl (стандартизиран слой – най-нисък приоритет),
 *  2) slotProps.root?.style (ако има),
 *  3) style (краен override от потребителя, най-висок приоритет).
 */
const mergeStyles = (
  sl?: React.CSSProperties,
  slotRootStyle?: React.CSSProperties,
  style?: React.CSSProperties
): React.CSSProperties | undefined => {
  if (!sl && !slotRootStyle && !style) return undefined;
  return { ...(sl ?? {}), ...(slotRootStyle ?? {}), ...(style ?? {}) };
};

export const Typography = React.forwardRef(function Typography<
  E extends React.ElementType = "span"
>(props: TypographyProps<E>, ref: React.Ref<any>) {
  // ---- Деструктуриране на пропсовете с дефолтни стойности ----
  const {
    as,
    component,
    children,

    // визуални
    color,
    textColor,
    variant = "plain",
    level = "body-md",
    levelMapping,
    gutterBottom = false,
    noWrap = false,
    truncate = false,
    wrap = "wrap",
    align,
    weight,

    // декоратори
    startDecorator,
    endDecorator,

    // слотове
    slots,
    slotProps,

    // клас/стил
    className,
    style,
    sl,

    // всичко останало към root (вкл. CommonLayoutProps и native)
    ...rest
  } = props;

  // ---- Определяме семантичния елемент: (component|as) > levelMapping > default ----
  const mapping = { ...DEFAULT_LEVEL_MAPPING, ...(levelMapping ?? {}) } as Required<LevelMapping>;
  const semanticTag = (component ?? as ?? mapping[level as TextLevel] ?? "span") as React.ElementType;

  // ---- Слотове ----
  const RootSlot: React.ElementType = slots?.root ?? StyledTypography;
  const StartSlot: React.ElementType = slots?.startDecorator ?? "span";
  const EndSlot: React.ElementType = slots?.endDecorator ?? "span";

  // ---- Обединяване на стиловете (sl + slotProps.root?.style + style) ----
  const mergedStyle = mergeStyles(sl, slotProps?.root?.style as React.CSSProperties | undefined, style);

  // ---- Обединяване на className ----
  const mergedClassName = cx("ld-Typography-root", slotProps?.root?.className as string, className);

  // ---- Рендер ----
  return (
    <RootSlot
      // Полиморфично: `as` определя real DOM елемента
      as={semanticTag}
      ref={ref}
      className={mergedClassName}
      style={mergedStyle}
      // Визуални пропсове към StyledTypography (филтрират се за DOM чрез shouldForwardProp)
      color={color as any}
      textColor={textColor}
      variant={variant as any}
      level={level as any}
      gutterBottom={gutterBottom}
      noWrap={noWrap}
      truncate={truncate}
      wrap={wrap as any}
      align={align as any}
      weight={weight as any}
      $hasStart={!!startDecorator}
      $hasEnd={!!endDecorator}
      // Диагностични data-атрибути (полезни при дебъг/тестове)
      data-level={level}
      data-variant={variant}
      data-color={color ?? undefined}
      // slotProps за root – след нашите контролирани полета, за да не override-ва критични неща
      {...(slotProps?.root as any)}
      // Остатъчни пропсове (вкл. CommonLayoutProps, native атрибути като id, onClick и т.н.)
      {...(rest as any)}
    >
      {startDecorator ? (
        <StartSlot className="ld-typography-startDecorator" {...(slotProps?.startDecorator as any)}>
          {startDecorator}
        </StartSlot>
      ) : null}

      {children}

      {endDecorator ? (
        <EndSlot className="ld-typography-endDecorator" {...(slotProps?.endDecorator as any)}>
          {endDecorator}
        </EndSlot>
      ) : null}
    </RootSlot>
  );
}) as TypographyComponent;

export default Typography;
