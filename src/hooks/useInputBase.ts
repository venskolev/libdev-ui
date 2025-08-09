'use client';
import * as React from 'react';

/**
 * Базов хук за всички input-подобни компоненти.
 * - Поддържа controlled/uncontrolled стойност
 * - Управлява фокус състояние
 * - selectOnFocus, clearOnEscape, autoFocus
 * - Връща getInputProps / getRootProps за лесно закачане на атрибути
 * - Не налага стилове — само логика и ARIA/DOM пропсове
 */

export interface UseInputBaseProps {
  // value управление
  value?: string;
  defaultValue?: string;

  // поведение
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  selectOnFocus?: boolean;
  clearOnEscape?: boolean;

  // ARIA / DOM
  id?: string;
  name?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  inputRef?: React.Ref<HTMLInputElement>;

  // събития
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear?: () => void;
}

export interface UseInputBaseReturn {
  /** Текущата стойност (controlled или uncontrolled) */
  value: string;
  /** Дали инпутът е фокусиран */
  focused: boolean;
  /** Дали е деактивиран */
  disabled: boolean;
  /** Дали е само за четене */
  readOnly: boolean;
  /** Дали е required */
  required: boolean;

  /** Ref към input елемента */
  inputRef: React.RefObject<HTMLInputElement>;

  /** Хелпъри */
  focus: () => void;
  blur: () => void;
  select: () => void;
  setValue: (next: string) => void;

  /** Атрибути за root контейнера (за data-атрибути и т.н.) */
  getRootProps: () => {
    'data-focused'?: '' | undefined;
    'data-disabled'?: '' | undefined;
    'data-readonly'?: '' | undefined;
    'data-required'?: '' | undefined;
  };

  /** Атрибути и хендлъри за самия <input> */
  getInputProps: (extra?: React.InputHTMLAttributes<HTMLInputElement>) => React.InputHTMLAttributes<HTMLInputElement>;
}

export function useInputBase(props: UseInputBaseProps): UseInputBaseReturn {
  const {
    value: valueProp,
    defaultValue,
    disabled = false,
    readOnly = false,
    required = false,
    autoFocus = false,
    selectOnFocus = false,
    clearOnEscape = false,

    id,
    name,
    placeholder,
    type = 'text',
    inputRef: inputRefProp,

    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
    onClear,
  } = props;

  const isControlled = valueProp !== undefined;

  const [innerValue, setInnerValue] = React.useState<string>(defaultValue ?? '');
  const [focused, setFocused] = React.useState<boolean>(false);

  // Вътрешен ref, който може да бъде слет с външен ref
  const inputRef = React.useRef<HTMLInputElement>(null);

  // merge външен ref, ако е подаден
  React.useEffect(() => {
    if (!inputRefProp) return;
    if (typeof inputRefProp === 'function') {
      inputRefProp(inputRef.current);
    } else if (typeof inputRefProp === 'object' && inputRefProp) {
      // @ts-ignore - inputRefProp може да е RefObject или RefCallback
      inputRefProp.current = inputRef.current;
    }
  }, [inputRefProp]);

  // autoFocus при mount
  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      if (selectOnFocus) {
        // изчакваме фокусът да се приложи
        setTimeout(() => inputRef.current?.select(), 0);
      }
    }
  }, [autoFocus, selectOnFocus]);

  const currentValue = isControlled ? (valueProp as string) : innerValue;

  const setValue = (next: string) => {
    if (!isControlled) setInnerValue(next);
  };

  const focus = () => inputRef.current?.focus();
  const blur = () => inputRef.current?.blur();
  const select = () => inputRef.current?.select();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    if (!isControlled) setInnerValue(next);
    onChange?.(event, next);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(event);
    if (selectOnFocus) {
      // select след event loop, за да няма конфликт с браузърното поведение
      setTimeout(() => inputRef.current?.select(), 0);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (clearOnEscape && event.key === 'Escape' && !disabled && !readOnly) {
      if (currentValue !== '') {
        onClear?.();
        if (!isControlled) setInnerValue('');
        // предотвратяваме странични ефекти (затваряне на модален, и т.н.)
        event.stopPropagation();
        event.preventDefault();
      }
    }
    onKeyDown?.(event);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyUp?.(event);
  };

  const getRootProps: UseInputBaseReturn['getRootProps'] = () => ({
    'data-focused': focused ? '' : undefined,
    'data-disabled': disabled ? '' : undefined,
    'data-readonly': readOnly ? '' : undefined,
    'data-required': required ? '' : undefined,
  });

  const getInputProps: UseInputBaseReturn['getInputProps'] = (extra) => ({
    id,
    name,
    placeholder,
    type,
    disabled,
    readOnly,
    required,
    value: currentValue,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    ref: inputRef,
    ...extra,
  });

  return {
    value: currentValue,
    focused,
    disabled,
    readOnly,
    required,
    inputRef,
    focus,
    blur,
    select,
    setValue,
    getRootProps,
    getInputProps,
  };
}
