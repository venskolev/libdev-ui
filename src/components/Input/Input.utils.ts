import { MutableRefObject, Ref, RefCallback } from "react";

/* -------------------------------------------------------
 * Общи помощни функции за Input компонента
 * Всички коментари са на български за яснота в разработката.
 * ----------------------------------------------------- */

/** Проверява дали стойността се счита за "празна" */
export function isEmptyValue(value: unknown): boolean {
  return value === null || value === undefined || value === "";
}

/** Композира няколко хендлъра в един (изпълнява ги по ред) */
export function callAll<T extends (...args: any[]) => any>(...fns: Array<T | undefined>) {
  return (...args: Parameters<T>) => {
    fns.forEach((fn) => {
      if (typeof fn === "function") fn(...args);
    });
  };
}

/** Слива множество рефове в един (поддържа както callback, така и object refs) */
export function mergeRefs<T = any>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (value: T) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(value);
      } else {
        try {
          (ref as MutableRefObject<T | null>).current = value;
        } catch {
          // игнорирай грешката ако рефа е само за четене
        }
      }
    });
  };
}

/** Връща true ако компонентът е контролиран (има подадено value проп) */
export function isControlled(valueProp: unknown): boolean {
  return valueProp !== undefined;
}

/** Нормализира стойността от събитие onChange за <input>/<textarea> */
export function getEventValue(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): string {
  return event?.target?.value ?? "";
}

/** Безопасен фокус върху елемент (input/textarea) */
export function focusElement(el?: HTMLElement | null) {
  if (!el) return;
  try {
    el.focus({ preventScroll: true });
  } catch {
    // някои браузъри не поддържат опции
    el.focus();
  }
}

/** Подготовка на ARIA атрибути за достъпност */
export function getAriaProps(opts: {
  id?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: boolean;
  placeholder?: string;
}) {
  const { id, disabled, readOnly, required, error, placeholder } = opts;
  return {
    id,
    "aria-invalid": !!error || undefined,
    "aria-required": !!required || undefined,
    "aria-disabled": !!disabled || undefined,
    "aria-readonly": !!readOnly || undefined,
    "aria-placeholder": placeholder || undefined,
  } as const;
}

/** Връща валиден тип за input; по подразбиране 'text' */
export function resolveInputType(type?: string): string {
  return type && typeof type === "string" ? type : "text";
}

/** Валидира и нормализира редовете за textarea */
export function resolveRows(rows?: number, minRows?: number, maxRows?: number) {
  const normalize = (n?: number) => (typeof n === "number" && n > 0 ? Math.floor(n) : undefined);
  const r = normalize(rows);
  const min = normalize(minRows);
  const max = normalize(maxRows);

  // ако имаме rows, той има приоритет
  if (r !== undefined) {
    return {
      rows: r,
      minRows: undefined,
      maxRows: undefined,
    } as const;
  }

  // иначе използваме min/max при autosize сценарии (ако решим да добавим autosize по-късно)
  return {
    rows: undefined,
    minRows: min,
    maxRows: max,
  } as const;
}

/** Предпазва от действие, ако компонентът е disabled или readOnly */
export function guardInteraction(disabled?: boolean, readOnly?: boolean): boolean {
  return !!disabled || !!readOnly;
}
