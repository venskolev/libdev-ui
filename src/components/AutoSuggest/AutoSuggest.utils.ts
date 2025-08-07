import { AutoSuggestOption } from "./AutoSuggest.types";

/**
 * Филтрира опциите според въведения текст.
 */
export function getFilteredOptions(
  options: AutoSuggestOption[],
  input: string
): AutoSuggestOption[] {
  const lowerInput = input.toLowerCase();
  return options.filter((opt) =>
    opt.label.toLowerCase().includes(lowerInput)
  );
}

/**
 * Намира първия съвпадащ текст за inline completion.
 */
export function getInlineCompletionText(
  input: string,
  options: AutoSuggestOption[]
): string | null {
  const match = options.find((opt) =>
    opt.label.toLowerCase().startsWith(input.toLowerCase())
  );
  if (!match || match.label.toLowerCase() === input.toLowerCase()) return null;

  return match.label.slice(input.length);
}

/**
 * Проверява дали дадена стойност съвпада с дадена опция.
 */
export function isOptionMatch(value: string, option: AutoSuggestOption): boolean {
  return option.value === value || option.label === value;
}
