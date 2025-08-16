'use client';
import * as React from 'react';

/**
 * Базов хук за всички toggle-подобни компоненти (Checkbox, Switch, Radio).
 * - Поддържа controlled/uncontrolled checked
 * - Управлява фокус състояние и автофокус
 * - clearOnEscape: при Escape връща в "off" (false) ако позволява UI/UX-ът
 * - Връща getInputProps / getRootProps за лесно закачане на атрибути
 * - Не налага стилове — само логика и ARIA/DOM пропсове
 */

export interface UseToggleBaseProps {
  // стойност
  checked?: boolean;
  defaultChecked?: boolean;

  // поведение
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  clearOnEscape?: boolean;

  // ARIA / DOM
  id?: string;
  name?: string;
  value?: string | number | string[];
  inputRef?: React.Ref<HTMLInputElement>;
  // Допълнителни ARIA флагове (примерно за indeterminate, mixed)
  ariaChecked?: boolean | 'mixed';

  // събития
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;

  // when Escape clears (sets false)
  onClear?: () => void;
}

export interface UseToggleBaseReturn {
  /** Текущото състояние (controlled или uncontrolled) */
  checked: boolean;
  /** Дали input-ът е фокусиран */
  focused: boolean;
  /** Флагове */
  disabled: boolean;
  readOnly: boolean;
  required: boolean;

  /** Ref към input елемента */
  inputRef: React.RefObject<HTMLInputElement>;

  /** Хелпъри */
  focus: () => void;
  blur: () => void;
  setChecked: (next: boolean) => void;

  /** Атрибути за root контейнера (за data-атрибути и т.н.) */
  getRootProps: () => {
    'data-focused'?: '' | undefined;
    'data-disabled'?: '' | undefined;
    'data-readonly'?: '' | undefined;
    'data-required'?: '' | undefined;
  };

  /** Атрибути и хендлъри за самия <input type="checkbox"> */
  getInputProps: (extra?: React.InputHTMLAttributes<HTMLInputElement>) => React.InputHTMLAttributes<HTMLInputElement>;
}

export function useToggleBase(props: UseToggleBaseProps): UseToggleBaseReturn {
  const {
    checked: checkedProp,
    defaultChecked,
    disabled = false,
    readOnly = false,
    required = false,
    autoFocus = false,
    clearOnEscape = false,

    id,
    name,
    value,
    inputRef: inputRefProp,
    ariaChecked,

    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
    onClear,
  } = props;

  const isControlled = checkedProp !== undefined;

  const [innerChecked, setInnerChecked] = React.useState<boolean>(!!defaultChecked);
  const [focused, setFocused] = React.useState<boolean>(false);

  // вътрешен ref, може да се слее с външен
  const inputRef = React.useRef<HTMLInputElement>(null);

  // merge външен ref, ако е подаден
  React.useEffect(() => {
    if (!inputRefProp) return;
    if (typeof inputRefProp === 'function') {
      inputRefProp(inputRef.current);
    } else if (typeof inputRefProp === 'object' && inputRefProp) {
      // @ts-ignore
      inputRefProp.current = inputRef.current;
    }
  }, [inputRefProp]);

  // autoFocus при mount
  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const currentChecked = isControlled ? !!checkedProp : innerChecked;

  const setChecked = (next: boolean) => {
    if (!isControlled) setInnerChecked(next);
  };

  const focus = () => inputRef.current?.focus();
  const blur = () => inputRef.current?.blur();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;
    const next = event.target.checked;
    if (!isControlled) setInnerChecked(next);
    onChange?.(event, next);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (clearOnEscape && event.key === 'Escape' && !disabled && !readOnly) {
      if (currentChecked !== false) {
        onClear?.();
        if (!isControlled) setInnerChecked(false);
        event.stopPropagation();
        event.preventDefault();
      }
    }
    onKeyDown?.(event);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyUp?.(event);
  };

  const getRootProps: UseToggleBaseReturn['getRootProps'] = () => ({
    'data-focused': focused ? '' : undefined,
    'data-disabled': disabled ? '' : undefined,
    'data-readonly': readOnly ? '' : undefined,
    'data-required': required ? '' : undefined,
  });

  const getInputProps: UseToggleBaseReturn['getInputProps'] = (extra) => ({
    id,
    name,
    value,
    type: 'checkbox',
    checked: currentChecked,
    disabled,
    readOnly,
    required,
    'aria-checked': ariaChecked ?? currentChecked,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    ref: inputRef,
    ...extra,
  });

  return {
    checked: currentChecked,
    focused,
    disabled,
    readOnly,
    required,
    inputRef,
    focus,
    blur,
    setChecked,
    getRootProps,
    getInputProps,
  };
}
