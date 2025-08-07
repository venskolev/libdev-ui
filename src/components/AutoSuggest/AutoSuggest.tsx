import React, { useState, useEffect, useRef } from "react";
import {
  Wrapper,
  InputWrapper,
  StyledInput,
  InlineCompletion,
  StyledPopupList,
  StyledPopupItem,
} from "./AutoSuggest.styles";
import type { AutoSuggestProps, AutoSuggestOption } from "./AutoSuggest.types";
import {
  getFilteredOptions,
  getInlineCompletionText,
  isOptionMatch,
} from "./AutoSuggest.utils";
import styled from "@emotion/styled";
import { CSSObject } from "@emotion/react";

const ClearButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: #888;
  cursor: pointer;
  padding: 0;
  margin: 0;

  &:hover {
    color: var(--color-primary, #3f51b5);
  }
`;

export const AutoSuggest: React.FC<AutoSuggestProps> = ({
  options,
  value,
  onChange,
  placeholder = "",
  disabled = false,
  readOnly = false,

  highlightFirstOption = true,
  blurClearsInput = true,
  disableClear = false,
  openOnFocus = true,
  keepOpenOnSelect = false,
  inlineCompletion = true,
  noWrapFocus = false,
  hideSelectedOption = false,

  selectTextOnFocus = false,
  popupInParentDom = true,
  disableUserOptionBinding = false,
  includeInputInList = false,
  autoSelect = false,
  clearOnEscape = true,
  blurOnSelect = false,

  showClearButton = true, 
  startDecorator,
  endDecorator,
  sl,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [selected, setSelected] = useState<AutoSuggestOption | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Синхронизира външна стойност
  useEffect(() => {
    const matched = options.find((opt) => isOptionMatch(value ?? "", opt));
    setSelected(matched || null);
    if (!isTyping && matched && matched.label !== inputValue) {
      setInputValue(matched.label);
    }
  }, [value, options]);

  const filtered = getFilteredOptions(options, inputValue);
  const includeTypedInput =
    includeInputInList &&
    inputValue &&
    !filtered.some(
      (opt) => opt.label.toLowerCase() === inputValue.toLowerCase()
    );

  const fullOptions = includeTypedInput
    ? [...filtered, { label: inputValue, value: inputValue }]
    : filtered;

  const visibleOptions = hideSelectedOption
    ? fullOptions.filter((opt) =>
        selected?.label
          ? opt.label.toLowerCase() !== selected.label.toLowerCase()
          : true
      )
    : fullOptions;

  const inlineText =
    inlineCompletion && getInlineCompletionText(inputValue, visibleOptions);

  const handleFocus = () => {
    if (selected) {
      // Нулира избора при нов фокус, за да може да се избере ново
      setSelected(null);
      setInputValue("");
      onChange(null);
    }

    if (openOnFocus) setOpen(true);

    if (selectTextOnFocus) {
      setTimeout(() => {
        inputRef.current?.select();
      }, 0);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setOpen(false);
      setIsTyping(false);
      if (blurClearsInput && !selected) setInputValue("");
      if (autoSelect && visibleOptions.length === 1) {
        handleSelect(visibleOptions[0]);
      }
    }, 100);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setIsTyping(true);
    setInputValue(val);
    if (!disableUserOptionBinding) {
      onChange(null);
      setSelected(null);
    }
    setOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = highlightedIndex + 1;
      if (next < visibleOptions.length) {
        setHighlightedIndex(next);
      } else if (!noWrapFocus) {
        setHighlightedIndex(0);
      }
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = highlightedIndex - 1;
      if (prev >= 0) {
        setHighlightedIndex(prev);
      } else if (!noWrapFocus) {
        setHighlightedIndex(visibleOptions.length - 1);
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const option = visibleOptions[highlightedIndex];
      if (option) {
        handleSelect(option);
      }
    }

    if (e.key === "Escape" && clearOnEscape) {
      handleClear(); // 🆕 използваме бутон логика
    }
  };

  const handleSelect = (option: AutoSuggestOption) => {
    setIsTyping(false);
    setSelected(option);
    setInputValue(option.label);
    onChange(option.value);
    if (blurOnSelect) inputRef.current?.blur();
    if (!keepOpenOnSelect) setOpen(false);
  };

  // 🆕 Добавяме бутон за изчистване
  const handleClear = () => {
    setSelected(null);
    setInputValue("");
    onChange(null);
  };

  useEffect(() => {
    if (highlightFirstOption && visibleOptions.length > 0) {
      setHighlightedIndex(0);
    }
  }, [inputValue]);

  return (
    <Wrapper {...rest} style={sl}>
      <InputWrapper focused={open && !disabled}>
        {startDecorator}

        <StyledInput
          ref={inputRef}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete="off"
        />

        {inlineText && <InlineCompletion>{inlineText}</InlineCompletion>}

        {showClearButton && selected && (
          <ClearButton onClick={handleClear} aria-label="Clear selection">
            ×
          </ClearButton>
        )}
        {endDecorator}
      </InputWrapper>

      <StyledPopupList open={open}>
        {visibleOptions.map((option, index) => (
          <StyledPopupItem
            key={option.value}
            onMouseDown={() => handleSelect(option)}
            highlighted={index === highlightedIndex}
            selected={option.value === selected?.value}
          >
            {option.label}
          </StyledPopupItem>
        ))}
      </StyledPopupList>
    </Wrapper>
  );
};
