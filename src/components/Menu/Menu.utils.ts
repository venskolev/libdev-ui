// LibDev UI — Menu scoped utils (минимални и съвместими с текущата имплементация)
import * as React from "react";

/** Допустима стойност за data-* атрибут */
export type DataValue = "" | string | number | boolean | undefined;

/** Превръща { open: true, size: 'md' } -> { 'data-open': '', 'data-size': 'md' } */
export function toDataSet(rec: Record<string, DataValue>) {
  const out: Record<string, any> = {};
  for (const k in rec) {
    const v = rec[k];
    if (v === undefined) continue;
    out[`data-${k}`] = typeof v === "boolean" ? (v ? "" : undefined) : v;
  }
  return out;
}

/** Безопасно „сливане“/задаване на ref (function | RefObject) */
export function assignRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (!ref) return;
  if (typeof ref === "function") {
    ref(value);
  } else {
    try {
      (ref as React.MutableRefObject<T | null>).current = value;
    } catch {
      /* no-op */
    }
  }
}

/** Контролирано/неконтролирано булево състояние — връща [value, setUncontrolled, isControlled] */
export function useControlled(
  value: boolean | undefined,
  defaultValue?: boolean
) {
  const [inner, setInner] = React.useState<boolean>(!!defaultValue);
  const isControlled = value != null;
  const cur = isControlled ? !!value : inner;

  const setUncontrolled = React.useCallback(
    (v: boolean) => {
      if (!isControlled) setInner(v);
    },
    [isControlled]
  );

  return [cur, setUncontrolled, isControlled] as const;
}
