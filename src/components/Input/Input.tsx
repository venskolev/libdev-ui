'use client';
import React, { forwardRef, useMemo, KeyboardEvent } from 'react';
import {
  StyledAdornment,
  StyledClearButton,
  StyledField,
  StyledInputElement,
  StyledInputRoot,
  StyledTextareaElement,
} from './Input.styles';
import { InputProps } from './Input.types';
import {
  callAll,
  getAriaProps,
  guardInteraction,
  isEmptyValue,
  mergeRefs,
  resolveInputType,
  resolveRows,
} from './Input.utils';
import { useInputBase } from '../../hooks/useInputBase';

/* помощник: нормализирай към string за базовия хук */
const toStr = (v: string | number | undefined | null) =>
  v === undefined || v === null ? undefined : typeof v === 'number' ? String(v) : v;

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>((props, ref) => {
  const {
    // управление на стойностите
    value,
    defaultValue,
    onChange,

    // базови HTML пропсове
    placeholder,
    type,
    name,
    id,
    autoComplete,
    autoFocus,

    // състояния и флагове
    disabled,
    error,
    readOnly,
    required,
    fullWidth,

    // визуални пропсове
    variant = 'outlined',
    color = 'primary',
    size = 'md',
    radius = 'md',

    // допълнителни елементи
    startAdornment,
    endAdornment,
    showClearButton = true,
    onClear,

    // multiline
    multiline,
    rows,
    minRows,
    maxRows,

    // стил/клас
    className,
    style,

    // остатъчни атрибути за елемента
    ...rest
  } = props;

  // -----------------------------------------
  // useInputBase: централизирана логика за value/focus/handlers
  // -----------------------------------------
  const { getInputProps, inputRef, focused, setValue } = useInputBase({
    value: toStr(value),
    defaultValue: toStr(defaultValue),
    disabled,
    readOnly,
    required,
    autoFocus,
    onChange: (e) => {
      // делегираме към външния onChange (поддържа input и textarea)
      onChange?.(e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
    },
  });

  // merge с външния ref и вътрешния от хука
  const mergedRef = useMemo(() => mergeRefs(ref, inputRef), [ref, inputRef]);

  // ARIA атрибути (запазваме утилитито ти)
  const ariaProps = getAriaProps({
    id,
    disabled,
    readOnly,
    required,
    error,
    placeholder,
  });

  // тип на инпута (по подразбиране "text")
  const inputType = resolveInputType(type);

  // редове при textarea
  const rowProps = resolveRows(rows, minRows, maxRows);

  // текуща стойност: controlled -> външно value, иначе -> стойността от хука
  const hookValue = (getInputProps().value as string) ?? '';
  const currentValue = toStr(value) ?? hookValue ?? '';

  // controlled режим: ако value е undefined, използваме стойността от хука
  const isControlled = value !== undefined;

  // clear поведение (✕) – нулира стойността, вика onClear, връща фокус
 const performClear = () => {
  if (guardInteraction(!!disabled, !!readOnly)) return;

  const el = inputRef.current as HTMLInputElement | HTMLTextAreaElement | null;

  if (isControlled && onChange && el) {
    // уведомяваме родителя в контролиран режим
    const event = {
      ...new Event('input', { bubbles: true, cancelable: true }),
      target: { ...el, value: '' },
      currentTarget: { ...el, value: '' },
    } as unknown as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
    onChange(event);
  } else {
    // неконтролиран режим: нулираме вътрешната стойност
    setValue('');
  }

  onClear?.();
  el?.focus?.();
};


  // обработка на клавиши (Escape = clear)
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Escape' && showClearButton && !isEmptyValue(currentValue)) {
      e.stopPropagation();
      e.preventDefault();
      performClear();
    }
  };

  // има ли адорнменти / clear
  const hasStartAdornment = !!startAdornment;
  const hasEndAdornment = !!endAdornment;
  const canShowClearButton =
    !!showClearButton && !disabled && !readOnly && !isEmptyValue(currentValue) && !multiline;

  return (
    <StyledInputRoot
      data-focused={focused ? 'true' : 'false'}
      $variant={variant}
      $color={color as any}
      $size={size}
      $radius={radius}
      $fullWidth={!!fullWidth}
      $disabled={!!disabled}
      $error={!!error}
      $multiline={!!multiline}
      $hasStartAdornment={hasStartAdornment}
      $hasEndAdornment={hasEndAdornment}
      $isFocused={focused}
      className={className}
      style={style}
    >
      {/* Start adornment */}
      {hasStartAdornment && (
        <StyledAdornment $position="start" $size={size} aria-hidden>
          {startAdornment}
        </StyledAdornment>
      )}

      {/* Поле (input/textarea) */}
      <StyledField $size={size} $hasStartAdornment={hasStartAdornment} $hasEndAdornment={hasEndAdornment}>
        {multiline ? (
          // --- TEXTAREA ВАРИАНТ (типово съвместим) ---
          <StyledTextareaElement
            {...(rest as any)}
            {...ariaProps}
            ref={mergedRef as any}
            name={name}
            placeholder={placeholder}
            autoComplete={autoComplete}
            // мапваме ръчно от getInputProps (които са за <input>)
            value={hookValue}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            onChange={
              (getInputProps().onChange as unknown) as React.ChangeEventHandler<HTMLTextAreaElement>
            }
            onKeyDown={callAll(
              rest.onKeyDown as any,
              (handleKeyDown as unknown) as React.KeyboardEventHandler<HTMLTextAreaElement>
            )}
            onKeyUp={
              (getInputProps().onKeyUp as unknown) as React.KeyboardEventHandler<HTMLTextAreaElement>
            }
            onFocus={
              (getInputProps().onFocus as unknown) as React.FocusEventHandler<HTMLTextAreaElement>
            }
            onBlur={
              (getInputProps().onBlur as unknown) as React.FocusEventHandler<HTMLTextAreaElement>
            }
            $size={size}
            $hasStartAdornment={hasStartAdornment}
            $hasEndAdornment={hasEndAdornment}
            $disabled={disabled}
            $rows={rowProps.rows}
            $minRows={rowProps.minRows}
            $maxRows={rowProps.maxRows}
            rows={rowProps.rows}
          />
        ) : (
          // --- INPUT ВАРИАНТ ---
          <StyledInputElement
            {...(rest as any)}
            {...ariaProps}
            {...getInputProps({
              type: inputType,
              name,
              placeholder,
              autoComplete,
              onKeyDown: callAll(rest.onKeyDown as any, handleKeyDown as any),
            })}
            ref={mergedRef as any}
            $size={size}
            $hasStartAdornment={hasStartAdornment}
            $hasEndAdornment={hasEndAdornment}
            $multiline={false}
            $disabled={disabled}
          />
        )}

        {/* Clear бутон (само за single-line) – видим текст няма; иконата е inline SVG */}
        {canShowClearButton && (
          <StyledClearButton
            type="button"
            aria-label="Clear"
            title="Clear"
            onMouseDown={(e) => e.preventDefault()} // предотвратява blur преди click
            onClick={performClear}
            $size={size}
            $hasEndAdornment={hasEndAdornment}
            $disabled={disabled}
          >
            <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </StyledClearButton>
        )}
      </StyledField>

      {/* End adornment */}
      {hasEndAdornment && (
        <StyledAdornment $position="end" $size={size} aria-hidden>
          {endAdornment}
        </StyledAdornment>
      )}
    </StyledInputRoot>
  );
});

Input.displayName = 'Input';
