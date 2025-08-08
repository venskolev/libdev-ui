import React, {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  KeyboardEvent,
} from "react";
import {
  StyledAdornment,
  StyledClearButton,
  StyledField,
  StyledInputElement,
  StyledInputRoot,
  StyledTextareaElement,
} from "./Input.styles";
import { InputProps } from "./Input.types";
import {
  callAll,
  focusElement,
  getAriaProps,
  getEventValue,
  guardInteraction,
  isControlled,
  isEmptyValue,
  mergeRefs,
  resolveInputType,
  resolveRows,
} from "./Input.utils";

/* -------------------------------------------------------
 *   Input компонент
 * - Поддържа контролиран/неконтролиран режим
 * - Поддържа multiline (textarea)
 * - Поддържа start/end adornments
 * - Поддържа clear бутон (✕)
 * - Всички коментари са на български; визуални текстове са на английски
 * ----------------------------------------------------- */

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (props, ref) => {
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
      variant = "outlined",
      color = "primary",
      size = "md",
      radius = "md",

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

      // всичко останало да отиде към input/textarea
      ...rest
    } = props;

    // локални рефове към елементите
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
    const mergedRef = useMemo(() => mergeRefs(ref, inputRef), [ref]);

    // контролиран/неконтролиран режим
    const controlled = isControlled(value);
    const [uncontrolledValue, setUncontrolledValue] = useState<string>(() => {
      // начална стойност при неконтролиран режим
      const initial =
        defaultValue !== undefined && defaultValue !== null ? String(defaultValue) : "";
      return initial;
    });

    // синхронизация на autoFocus
    useEffect(() => {
      if (autoFocus) {
        focusElement(inputRef.current || undefined);
      }
    }, [autoFocus]);

    // текущата стойност, според режима
    const currentValue = controlled ? String(value ?? "") : uncontrolledValue;

    // фокус състояние (използваме data-attr за стил)
    const [focused, setFocused] = useState(false);

    // onChange обработка (и за input, и за textarea)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (guardInteraction(disabled, readOnly)) return;
      const next = getEventValue(e);
      if (!controlled) setUncontrolledValue(next);
      onChange?.(e);
    };

    // изчистване на стойността (бутон ✕ и Escape)
    const performClear = () => {
      if (guardInteraction(disabled, readOnly)) return;
      // ако е контролиран – извикваме onChange с празна стойност
      if (controlled) {
        const el = inputRef.current;
        if (el && onChange) {
          const event = {
            ...new Event("input", { bubbles: true, cancelable: true }),
            target: { ...el, value: "" },
            currentTarget: { ...el, value: "" },
          } as unknown as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
          onChange(event);
        }
      } else {
        setUncontrolledValue("");
      }
      onClear?.();
      // фокус обратно към полето
      focusElement(inputRef.current || undefined);
    };

    // обработка на клавиши (Escape = clear)
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === "Escape" && showClearButton && !isEmptyValue(currentValue)) {
        e.stopPropagation();
        e.preventDefault();
        performClear();
        return;
      }
    };

    // ARIA атрибути
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

    // има ли адорнменти
    const hasStartAdornment = !!startAdornment;
    const hasEndAdornment = !!endAdornment;

    // показваме ли clear бутона
    const canShowClearButton =
      !!showClearButton && !disabled && !readOnly && !isEmptyValue(currentValue) && !multiline;

    return (
      <StyledInputRoot
        data-focused={focused ? "true" : "false"}
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
        <StyledField
          $size={size}
          $hasStartAdornment={hasStartAdornment}
          $hasEndAdornment={hasEndAdornment}
        >
          {multiline ? (
            <StyledTextareaElement
              {...(rest as any)}
              {...ariaProps}
              ref={mergedRef as any}
              name={name}
              placeholder={placeholder}
              autoComplete={autoComplete}
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              value={currentValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={callAll<React.FocusEventHandler<HTMLTextAreaElement>>(
                (e) => setFocused(true),
                rest.onFocus as any
              )}
              onBlur={callAll<React.FocusEventHandler<HTMLTextAreaElement>>(
                (e) => setFocused(false),
                rest.onBlur as any
              )}
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
            <StyledInputElement
              {...(rest as any)}
              {...ariaProps}
              ref={mergedRef as any}
              type={inputType}
              name={name}
              placeholder={placeholder}
              autoComplete={autoComplete}
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              value={currentValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={callAll<React.FocusEventHandler<HTMLInputElement>>(
                (e) => setFocused(true),
                rest.onFocus as any
              )}
              onBlur={callAll<React.FocusEventHandler<HTMLInputElement>>(
                (e) => setFocused(false),
                rest.onBlur as any
              )}
              $size={size}
              $hasStartAdornment={hasStartAdornment}
              $hasEndAdornment={hasEndAdornment}
              $disabled={disabled}
            />
          )}

          {/* Clear бутон (само за single-line) */}
          {canShowClearButton && (
            <StyledClearButton
              type="button"
              aria-label="Clear"
              title="Clear"
              onClick={performClear}
              $size={size}
              $hasEndAdornment={hasEndAdornment}
              $disabled={disabled}
            >
              ✕
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
  }
);

Input.displayName = "Input";
