"use client";
import * as React from "react";
import type { AutoSuggestOption, AutoSuggestProps } from "./AutoSuggest.types";
import { useInputBase } from "../../hooks/useInputBase";
import {
  Wrapper,
  InputWrapper,
  StyledInput,
  InlineCompletion,
  ClearButton,
  StyledPopupList,
  StyledPopupItem,
} from "./AutoSuggest.styles";

/* ---------------------------------------------
 * Локални утилити – съвместими с твоите типове
 * ------------------------------------------- */
const getOptionLabel = (o: AutoSuggestOption) => o?.label ?? "";
const isOptionEqualToValue = (
  o: AutoSuggestOption,
  v: string | null | undefined
) => (o?.value ?? null) === (v ?? null);

const filterOptions = (
  options: AutoSuggestOption[],
  inputValue: string,
  {
    includeInputInList,
    hideSelectedValue,
    selectedValue,
  }: {
    includeInputInList: boolean;
    hideSelectedValue: string | null;
    selectedValue: string | null;
  }
) => {
  const q = (inputValue || "").toLowerCase().trim();

  let base = options.filter((opt) => {
    if (hideSelectedValue && isOptionEqualToValue(opt, selectedValue))
      return false;
    if (!q) return true;
    return getOptionLabel(opt).toLowerCase().includes(q);
  });

  if (includeInputInList && q) {
    const exists = base.some((opt) => getOptionLabel(opt).toLowerCase() === q);
    if (!exists) {
      base = [{ label: inputValue, value: inputValue }, ...base];
    }
  }
  return base;
};

/* ---------------------------------------------
 * Компонент
 * ------------------------------------------- */
export const AutoSuggest: React.FC<AutoSuggestProps> = (props) => {
  const {
    options,
    value: valueProp,
    onChange,

    placeholder,
    disabled = false,
    readOnly = false,

    // Поведение (според твоите типове)
    highlightFirstOption = true,
    blurClearsInput = false,
    disableClear = false,
    openOnFocus = true,
    keepOpenOnSelect = false,
    inlineCompletion = false,
    noWrapFocus = false,
    hideSelectedOption = false,
    selectTextOnFocus = false,
    popupInParentDom = true, // остава в DOM на родителя
    disableUserOptionBinding = false,
    includeInputInList = false,
    autoSelect = false,
    clearOnEscape = false,
    blurOnSelect = true,
    showClearButton = true,

    // Визуално
    startDecorator,
    endDecorator,

    size,
    sl,
    className,
    ...rest // HTMLAttributes<HTMLDivElement>, включително id/aria/role/style...
  } = props;

  // Selected (стойност) – string|null
  const isSelectedControlled = valueProp !== undefined;
  const [innerValue, setInnerValue] = React.useState<string | null>(
    valueProp ?? null
  );
  const selectedValue =
    (isSelectedControlled ? valueProp! : innerValue) ?? null;

  // Input text – отделен state
  const [inputValue, setInputValue] = React.useState<string>("");
  const [open, setOpen] = React.useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState<number>(0);

  // Синхронизация inputValue с избора (когато се смени отвън)
  React.useEffect(() => {
    if (selectedValue == null) return;
    const match = options.find((o) => isOptionEqualToValue(o, selectedValue));
    if (match) {
      setInputValue(getOptionLabel(match));
    }
  }, [selectedValue, options]);

  // useInputBase за input логиката
  const {
    getInputProps,
    getRootProps,
    inputRef,
    focused,
    setValue: setHookValue,
  } = useInputBase({
    value: inputValue,
    disabled,
    readOnly,
    required: false,
    selectOnFocus: selectTextOnFocus,
    clearOnEscape,
    onChange: (_e, next) => {
      setInputValue(next);
      setHookValue(next);
      if (!open) setOpen(true);
      if (highlightFirstOption) setHighlightedIndex(0);
    },
    onClear: () => {
      setInputValue("");
      setHookValue("");
      if (highlightFirstOption) setHighlightedIndex(0);
    },
  });

  // Филтрирани опции според inputValue и настройки
  const filtered = React.useMemo(
    () =>
      filterOptions(options, inputValue, {
        includeInputInList,
        hideSelectedValue: hideSelectedOption ? selectedValue : null,
        selectedValue,
      }),
    [options, inputValue, includeInputInList, hideSelectedOption, selectedValue]
  );

  // Автоматична селекция при 1 резултат
  React.useEffect(() => {
    if (!autoSelect || !open) return;
    if (filtered.length === 1) {
      const only = filtered[0];
      const isFree = only.value === inputValue && only.label === inputValue;
      if (disableUserOptionBinding && isFree) return;
      commitSelection(only, { keepFocus: !blurOnSelect });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSelect, filtered, inputValue, open]);

  const closePopup = () => setOpen(false);

  const commitSelection = (
    option: AutoSuggestOption | null,
    opts?: { keepFocus?: boolean }
  ) => {
    // Забрана за свободна опция
    if (option && disableUserOptionBinding) {
      const exists = options.some((o) => isOptionEqualToValue(o, option.value));
      if (!exists) return;
    }

    const nextValue = option ? option.value : null;

    if (!isSelectedControlled) setInnerValue(nextValue);
    onChange?.(nextValue);

    const nextText = option ? getOptionLabel(option) : "";
    setInputValue(nextText);
    setHookValue(nextText);

    // Контрол на поведението след избор
    if (blurOnSelect && !opts?.keepFocus) {
      inputRef.current?.blur();
      if (!keepOpenOnSelect) closePopup();
    } else {
      if (!keepOpenOnSelect) closePopup();
      setHighlightedIndex(0);
    }
  };

  /* ---------------------------------------------
   * Handlers
   * ------------------------------------------- */
  const handleInputFocus = () => {
    if (disabled || readOnly) return;
    if (openOnFocus) {
      setOpen(true);
      if (highlightFirstOption) setHighlightedIndex(0);
    }
  };

  const handleInputBlur: React.FocusEventHandler<HTMLInputElement> = () => {
    // позволяваме click на опция преди да затворим
    setTimeout(() => {
      if (!selectedValue && blurClearsInput) {
        setInputValue("");
        setHookValue("");
      }
      closePopup();
    }, 0);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      if (highlightFirstOption) setHighlightedIndex(0);
      return;
    }

    if (e.key === "Escape") {
      if (clearOnEscape && !disableClear && !readOnly && !disabled) {
        if (selectedValue != null || inputValue) {
          commitSelection(null, { keepFocus: true });
          setInputValue("");
          setHookValue("");
          setHighlightedIndex(0);
          return;
        }
      }
      closePopup();
      return;
    }

    if (!filtered.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        noWrapFocus
          ? Math.min(prev + 1, filtered.length - 1)
          : (prev + 1) % filtered.length
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        noWrapFocus
          ? Math.max(prev - 1, 0)
          : (prev - 1 + filtered.length) % filtered.length
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = filtered[highlightedIndex];
      if (opt) commitSelection(opt);
    }
  };

  const handleOptionMouseDown = (option: AutoSuggestOption) => {
    commitSelection(option);
  };

  // FIX: Clear бутонът вече НЕ отваря popup-а
  const handleClearClick = () => {
    if (disableClear || readOnly || disabled) return;
    // само чистим стойността и текста и запазваме фокуса
    commitSelection(null, { keepFocus: true });
    setInputValue("");
    setHookValue("");
    setHighlightedIndex(0);
    // без setOpen(true) – оставяме popup състоянието непроменено
  };

  /* ---------------------------------------------
   * Inline completion (визуален суфикс)
   * ------------------------------------------- */
  const completionSuffix = React.useMemo(() => {
    if (!inlineCompletion) return "";
    if (!inputValue) return "";
    const first = filtered[0];
    if (!first) return "";
    const label = getOptionLabel(first);
    const lower = label.toLowerCase();
    const q = inputValue.toLowerCase();
    if (!lower.startsWith(q)) return "";
    return label.slice(inputValue.length);
  }, [inlineCompletion, filtered, inputValue]);

  /* ---------------------------------------------
   * Render
   * ------------------------------------------- */
  const baseId = (rest.id as string) || "autosuggest";
  const listboxId = `${baseId}-listbox`;

  return (
    <Wrapper
      {...getRootProps()}
      {...rest}
      className={className}
      style={sl || rest.style}
      data-open={open || undefined}
      data-size={size || undefined}
    >
      <InputWrapper size={size} focused={focused} disabled={disabled}>
        {startDecorator ? (
          <div className="ld-decorator ld-start">{startDecorator}</div>
        ) : null}

        {/* Inline completion: показва суфикса визуално до въвеждания текст */}
        {inlineCompletion && completionSuffix && (
          <InlineCompletion aria-hidden="true">
            {inputValue}
            {completionSuffix}
          </InlineCompletion>
        )}

        <StyledInput
          {...getInputProps({
            onFocus: handleInputFocus,
            onBlur: handleInputBlur,
            onKeyDown: handleKeyDown,
            "aria-autocomplete": "list",
            "aria-controls": open ? listboxId : undefined,
            "aria-expanded": open ? true : undefined,
            "aria-activedescendant":
              open && filtered[highlightedIndex]
                ? `${listboxId}-opt-${highlightedIndex}`
                : undefined,
            role: "combobox",
            autoComplete: "off",
            placeholder,
          })}
          disabled={disabled}
          readOnly={readOnly}
        />

        {/* Clear и endDecorator */}
        {showClearButton &&
        (inputValue || selectedValue) &&
        !disableClear &&
        !readOnly &&
        !disabled ? (
          <ClearButton
            type="button"
            aria-label="Clear" // достъпност
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClearClick}
          >
            {/* Лека, вградена SVG; няма зависимост от библиотека */}
            <svg
              aria-hidden="true"
              focusable="false"
              width="16"
              height="16"
              viewBox="0 0 24 24"
            >
              {/* X иконка */}
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </ClearButton>
        ) : null}

        {endDecorator ? (
          <div className="ld-decorator ld-end">{endDecorator}</div>
        ) : null}
      </InputWrapper>

      {/* Popup / Listbox (в DOM на родителя – без портали) */}
      <StyledPopupList open={open} role="listbox" id={listboxId}>
        {filtered.length === 0 ? (
          <StyledPopupItem as="div" aria-disabled="true">
            No options
          </StyledPopupItem>
        ) : (
          filtered.map((opt, idx) => {
            const label = getOptionLabel(opt);
            const isSel = isOptionEqualToValue(opt, selectedValue);
            const isHi = idx === highlightedIndex;
            return (
              <StyledPopupItem
                key={`${opt.value}-${idx}`}
                id={`${listboxId}-opt-${idx}`}
                role="option"
                aria-selected={isHi}
                highlighted={isHi}
                selected={!!isSel}
                onMouseDown={() => handleOptionMouseDown(opt)}
              >
                {label}
              </StyledPopupItem>
            );
          })
        )}
      </StyledPopupList>
    </Wrapper>
  );
};

export default AutoSuggest;
