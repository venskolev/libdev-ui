// src/components/Typography/Typography.types.ts
// LibDev UI – Custom React UI components

import type * as React from "react";
// Пътищата по-долу са съобразени с типичната ви структура:
// ако при теб са различни (напр. system/ да е другаде) — кажи и ще ги коригираме.
import type { LDColorToken } from "../../system/tokens.types"; // tokens: цветови токени от темата
import type { CommonLayoutProps } from "../../system/layout.types"; // общ layout API (m, p, width, ...)
// Ако CommonLayoutProps е в друг файл, коригираме импорта при следващата стъпка.

/* -------------------------------------------------------
 * Типове за Typography – съвместими с глобалните токени,
 * layout пропсове и sl={{}} стил подхода.
 * ----------------------------------------------------- */

// Нива на типография (комбинация от заглавия и текстови стилове)
export type TextLevel =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "title-lg"
  | "title-md"
  | "title-sm"
  | "body-lg"
  | "body-md"
  | "body-sm"
  | "body-xs"
  | "inherit"
  | (string & {}); // разширяемост при нужда

// Мапинг ниво -> HTML елемент
export type LevelMapping = Partial<Record<TextLevel | string, React.ElementType>>;

// Варианти (Joy-подобни, но независими) + разширяемост
export type TextVariant = "plain" | "soft" | "solid" | "outlined" | (string & {});

// Цветът може да е LD токен (вкл. dot-стейтове) или произволна CSS стойност
export type TextColor = LDColorToken | string;

// Тежест на шрифта
export type TextWeight = "light" | "regular" | "medium" | "bold" | number;

// Подравняване
export type TextAlign = "left" | "center" | "right" | "justify";

// Поведение на пренасяне
export type TextWrap = "wrap" | "nowrap" | "balance" | "pretty";

// Слот компоненти
export interface TypographySlots {
  root?: React.ElementType;
  startDecorator?: React.ElementType;
  endDecorator?: React.ElementType;
}

// Пропсове за слотовете
export interface TypographySlotProps {
  root?: React.ComponentPropsWithoutRef<any>;
  startDecorator?: React.ComponentPropsWithoutRef<any>;
  endDecorator?: React.ComponentPropsWithoutRef<any>;
}

// Собствени пропсове на компонента (без DOM/родни пропсове)
export interface TypographyOwnProps<E extends React.ElementType = "span"> {
  /** Семантичен елемент (alias на MUI `component`), полиморфично API */
  as?: E;
  component?: E;

  /** Съдържание */
  children?: React.ReactNode;

  /** Тематичен цвят чрез LD токени или произволна CSS стойност */
  color?: TextColor;

  /** Директен override за CSS цвят на текста */
  textColor?: string;

  /** Глобален вариант (plain | soft | solid | outlined) */
  variant?: TextVariant;

  /** Ниво на типографията (определя size/line-height/semantics) */
  level?: TextLevel;

  /** Мапинг ниво -> елемент (override по желание) */
  levelMapping?: LevelMapping;

  /** Ако е true, добавя долна междина */
  gutterBottom?: boolean;

  /** Ако е true, не пренася и троши с ellipsis */
  noWrap?: boolean;

  /** Удобно съкратено за ellipsis/overflow */
  truncate?: boolean;

  /** Управление на пренасянето (CSS text-wrap) */
  wrap?: TextWrap;

  /** Подравняване на текста */
  align?: TextAlign;

  /** Тежест на шрифта */
  weight?: TextWeight;

  /** Украса преди текста (икона/етикет) */
  startDecorator?: React.ReactNode;

  /** Украса след текста (икона/етикет) */
  endDecorator?: React.ReactNode;

  /** Слотове (замяна на вътрешните елементи) */
  slots?: TypographySlots;

  /** Пропсове за слотовете */
  slotProps?: TypographySlotProps;

  /** Допълнителни клас/стил – стандартни React пропсове */
  className?: string;

  /** Инлайн стил, ако е нужно (обикновено предпочитаме sl) */
  style?: React.CSSProperties;

  /** Стандартизиран стил-слой като при Button: `style={sl}` */
  sl?: React.CSSProperties;
}

// Полиморфична референция
export type PolymorphicRef<E extends React.ElementType> =
  React.ComponentPropsWithRef<E>["ref"];

// Краен публичен тип пропсове: собствени + родни (без конфликт с нашите ключове)
// Включваме и CommonLayoutProps за изцяло унифициран layout API (m/px/width/...)
export type TypographyProps<E extends React.ElementType = "span"> =
  TypographyOwnProps<E> &
    CommonLayoutProps &
    Omit<React.ComponentPropsWithoutRef<E>, keyof TypographyOwnProps>;

// Подпис на компонента (полиморфичен)
export type TypographyComponent = <E extends React.ElementType = "span">(
  props: TypographyProps<E> & { ref?: PolymorphicRef<E> }
) => React.ReactElement | null;
