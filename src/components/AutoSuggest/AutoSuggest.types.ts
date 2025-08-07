import type { HTMLAttributes, ReactNode } from "react";

import { Size } from "../common.types"; // Assuming these types are defined in common.types.ts
// Тип за всяка опция
export interface AutoSuggestOption {
  label: string;
  value: string;
}

// Основни пропсове
export interface AutoSuggestProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: AutoSuggestOption[];
  value?: string;
  onChange: (value: string | null) => void;

  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;

  // Поведение
  highlightFirstOption?: boolean; // автоматично маркиране на първия
  blurClearsInput?: boolean; // ако няма избрана стойност → изчисти текста при blur
  disableClear?: boolean; // не може да се изчисти
  openOnFocus?: boolean; // popup отваряне при фокус
  keepOpenOnSelect?: boolean; // popup не се затваря при селекция
  inlineCompletion?: boolean; // визуално дописване в input
  noWrapFocus?: boolean; // не wrap-ва фокуса в popup
  hideSelectedOption?: boolean; // скрива селектирания от listbox-а

  selectTextOnFocus?: boolean; // маркира целия текст при фокус
  popupInParentDom?: boolean; // popup-ът е под родителския DOM, не портали
  disableUserOptionBinding?: boolean; // потребителският текст не е обвързан със стойностите

  includeInputInList?: boolean; // включи ръчния текст като опция
  autoSelect?: boolean;         // автоматично селектиране при 1 опция
  clearOnEscape?: boolean;      // Escape да трие стойността
  blurOnSelect?: boolean;       // след селекция да се затваря и блърва
  showClearButton?: boolean;   // показва бутон за изчистване на стойността

  // Визуално
  startDecorator?: ReactNode;
  endDecorator?: ReactNode;

  size?: Size;
  sl?: React.CSSProperties;
}
