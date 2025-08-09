'use client';
import * as React from 'react';

/**
 * Базов хук за всички button-подобни компоненти.
 * - Поддържа controlled/uncontrolled "pressed" (за toggle бутони)
 * - Управлява фокус състояние (вкл. focus-visible)
 * - preventFocusOnPress, autoFocus, disabled, loading
 * - Връща getButtonProps / getRootProps, както при useInputBase
 * - Не налага стилове — само логика и ARIA/DOM пропсове
 */

export interface UseButtonBaseProps {
  // поведение
  disabled?: boolean;
  loading?: boolean;
  autoFocus?: boolean;
  preventFocusOnPress?: boolean;

  // toggle поведение (по избор)
  toggleable?: boolean;
  pressed?: boolean;               // controlled
  defaultPressed?: boolean;        // uncontrolled
  onPressedChange?: (pressed: boolean) => void;

  // ARIA / DOM
  id?: string;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  name?: string;
  value?: string;
  buttonRef?: React.Ref<HTMLButtonElement>;

  // събития
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLButtonElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface UseButtonBaseReturn {
  /** Дали е фокусиран (DOM фокус) */
  focused: boolean;
  /** Дали да се визуализира focus ring (клавиатурен фокус) */
  focusVisible: boolean;
  /** Дали бутона е в pressed състояние (при toggleable) */
  pressed: boolean;
  /** Дали е интерактивен (не е disabled/loading) */
  interactive: boolean;

  /** Ref към бутона */
  buttonRef: React.RefObject<HTMLButtonElement>;

  /** Хелпъри */
  focus: () => void;
  blur: () => void;
  setPressed: (next: boolean) => void;

  /** Атрибути за root контейнера (за data-атрибути и т.н.) */
  getRootProps: () => {
    'data-focused'?: '' | undefined;
    'data-focus-visible'?: '' | undefined;
    'data-disabled'?: '' | undefined;
    'data-loading'?: '' | undefined;
    'data-pressed'?: '' | undefined;
  };

  /** Атрибути и хендлъри за самия <button> */
  getButtonProps: (
    extra?: React.ButtonHTMLAttributes<HTMLButtonElement>
  ) => React.ButtonHTMLAttributes<HTMLButtonElement>;
}

export function useButtonBase(props: UseButtonBaseProps): UseButtonBaseReturn {
  const {
    // поведение
    disabled = false,
    loading = false,
    autoFocus = false,
    preventFocusOnPress = false,

    // toggle
    toggleable = false,
    pressed: pressedProp,
    defaultPressed = false,
    onPressedChange,

    // aria/dom
    id,
    type = 'button',
    name,
    value,
    buttonRef: buttonRefProp,

    // събития
    onClick,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
    onMouseDown,
    onMouseUp,
  } = props;

  // ---------- refs ----------
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // merge външен ref, ако е подаден
  React.useEffect(() => {
    if (!buttonRefProp) return;
    if (typeof buttonRefProp === 'function') {
      buttonRefProp(buttonRef.current);
    } else if (typeof buttonRefProp === 'object') {
      // @ts-ignore - buttonRefProp може да е RefObject
      buttonRefProp.current = buttonRef.current;
    }
  }, [buttonRefProp]);

  const lastPointerDownByMouseRef = React.useRef(false);

  // ---------- state ----------
  const isInteractive = !(disabled || loading);
  const isPressedControlled = pressedProp !== undefined;

  const [innerPressed, setInnerPressed] = React.useState<boolean>(defaultPressed);
  const [focused, setFocused] = React.useState<boolean>(false);
  const [focusVisible, setFocusVisible] = React.useState<boolean>(false);

  const pressed = isPressedControlled ? (pressedProp as boolean) : innerPressed;

  // autoFocus при mount
  React.useEffect(() => {
    if (autoFocus && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [autoFocus]);

  const setPressed = (next: boolean) => {
    if (!toggleable) return;
    if (!isPressedControlled) setInnerPressed(next);
    onPressedChange?.(next);
  };

  const focus = () => buttonRef.current?.focus();
  const blur = () => buttonRef.current?.blur();

  // ---------- handlers ----------
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isInteractive) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (toggleable) {
      setPressed(!pressed);
    }
    onClick?.(e);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    lastPointerDownByMouseRef.current = true;
    if (!isInteractive) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    // предотвратява браузърния auto-focus след mousedown
    if (preventFocusOnPress) e.preventDefault();
    onMouseDown?.(e);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    onMouseUp?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!isInteractive) return;
    // визуално "pressed" при space/enter – държим го леко семпло
    if ((e.key === ' ' || e.key === 'Enter') && toggleable) {
      // забележка: не променяме реалното pressed тук, оставяме click да го направи
    }
    onKeyDown?.(e);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!isInteractive) return;
    onKeyUp?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    setFocused(true);
    // focus-visible: клавиатурен фокус (ако не е имало mousedown)
    setFocusVisible(!lastPointerDownByMouseRef.current);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    setFocused(false);
    setFocusVisible(false);
    lastPointerDownByMouseRef.current = false;
    onBlur?.(e);
  };

  // ---------- props builders ----------
  const getRootProps: UseButtonBaseReturn['getRootProps'] = () => ({
    'data-focused': focused ? '' : undefined,
    'data-focus-visible': focusVisible ? '' : undefined,
    'data-disabled': disabled ? '' : undefined,
    'data-loading': loading ? '' : undefined,
    'data-pressed': toggleable && pressed ? '' : undefined,
  });

  const getButtonProps: UseButtonBaseReturn['getButtonProps'] = (extra) => ({
    id,
    type,
    name,
    value,
    disabled,                             // за истински <button>
    'aria-disabled': disabled || loading ? true : undefined,
    'aria-busy': loading || undefined,
    ...(toggleable ? { 'aria-pressed': !!pressed } : null),

    onClick: handleClick,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,

    ref: buttonRef,
    ...extra,
  });

  return {
    focused,
    focusVisible,
    pressed,
    interactive: isInteractive,
    buttonRef,
    focus,
    blur,
    setPressed,
    getRootProps,
    getButtonProps,
  };
}
