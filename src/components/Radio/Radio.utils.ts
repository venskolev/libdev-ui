// src/components/Radio/Radio.utils.ts
// LibDev UI – Radio utilities

import * as React from "react";
import type { SlotProp } from "./Radio.types";

/* -------------------------------------------------
 *  Помощник за извличане на slot props (обект/функция)
 * ------------------------------------------------- */
export function resolveSlotProps<P, OwnerState>(
  prop: SlotProp<P, OwnerState> | undefined,
  ownerState: OwnerState
): P | undefined {
  if (!prop) return undefined;
  return typeof prop === "function" ? (prop as any)(ownerState) : prop;
}

/* -------------------------------------------------
 *  Обединяване на className стойности
 * ------------------------------------------------- */
export function cx(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(" ");
}
