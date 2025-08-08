import { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { Size, Color, Variant, Radius } from "../common.types"; 

// Основни пропсове за Input компонента
export interface BaseInputProps {
  /** Стойността на полето (контролиран режим) */
  value?: string | number;
  /** Начална стойност (неконтролиран режим) */
  defaultValue?: string | number;
  /** Събитие при промяна на стойността */
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /** Placeholder текст (показван, когато няма въведена стойност) */
  placeholder?: string;
  /** Тип на input-а (text, number, email, password, и др.) */
  type?: string;
  /** Деактивиране на полето */
  disabled?: boolean;
  /** Състояние за грешка */
  error?: boolean;
  /** Пълна ширина на контейнера */
  fullWidth?: boolean;
  /** Name атрибут на input елемента */
  name?: string;
  /** ID атрибут на input елемента */
  id?: string;
  /** Само за четене (не позволява промяна на стойността) */
  readOnly?: boolean;
  /** Задължително поле */
  required?: boolean;
  /** Автоматично фокусиране при mount */
  autoFocus?: boolean;
  /** Автоматично допълване на полето */
  autoComplete?: string;
  /** Минимален брой редове при multiline */
  minRows?: number;
  /** Максимален брой редове при multiline */
  maxRows?: number;
  /** Брой редове при multiline */
  rows?: number;
  /** Ако е true, рендерира textarea вместо input */
  multiline?: boolean;
  /** Елемент в началото на полето (икона, текст и т.н.) */
  startAdornment?: ReactNode;
  /** Елемент в края на полето (икона, бутон и т.н.) */
  endAdornment?: ReactNode;
  /** Показва бутон за изчистване на стойността */
  showClearButton?: boolean;
  /** Събитие при клик върху бутона за изчистване */
  onClear?: () => void;
  /** Визуален вариант на стила */
  variant?: Variant;
  /** Цвят на полето */
  color?: Color | string;
  /** Размер на полето */
  size?: Size;
  /** Радиус на ъглите */
  radius?: Radius;
  /** Допълнителен CSS клас */
  className?: string;
  /** Inline стилове */
  style?: React.CSSProperties;
}

// Комбинация от базовите пропсове + HTML атрибутите за <input> и <textarea>
export type InputProps = BaseInputProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, keyof BaseInputProps> &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof BaseInputProps>;
