// src/components/Switch/Switch.utils.ts
// LibDev UI – Switch helpers (slots, motion, styles, classnames) v2

import * as React from "react";
import type { Size, Color, Variant, Radius } from "../common.types";
import type {
  SwitchOwnerState,
  SwitchProps,
  SwitchSlotProps,
  SwitchSlots,
  SwitchMotionPreset,
} from "./Switch.types";

/* -------------------------------------------------
 *  Класове – удобно сливане на имена и условни флагове
 * ------------------------------------------------- */
// Приема низове и обекти {className: boolean}, връща space-joined списък
export function cx(
  ...args: Array<
    | string
    | number
    | null
    | undefined
    | false
    | Record<string, any>
  >
): string {
  const out: string[] = [];
  for (const a of args) {
    if (!a) continue;
    if (typeof a === "string" || typeof a === "number") {
      out.push(String(a));
    } else if (typeof a === "object") {
      for (const k of Object.keys(a)) {
        if ((a as any)[k]) out.push(k);
      }
    }
  }
  return out.join(" ");
}

/* -------------------------------------------------
 *  Slot props – позволява стойност или функция (state) => props
 * ------------------------------------------------- */
type MaybeFn<T, S> = T | ((state: S) => T);

// Ако пропът е функция → извикваме го с ownerState
const resolveMaybeFn = <T, S>(v: MaybeFn<T, S> | undefined, s: S): T | undefined =>
  typeof v === "function" ? (v as any)(s) : v;

// Нормализира обектите за всеки слот
export function resolveSlotProps(
  owner: SwitchOwnerState,
  // типизираме „по-широко“, за да позволим и функции в slotProps
  slotProps?: Partial<Record<keyof SwitchSlotProps, any>>
) {
  const root = resolveMaybeFn(slotProps?.root, owner) ?? {};
  const track = resolveMaybeFn(slotProps?.track, owner) ?? {};
  const thumb = resolveMaybeFn(slotProps?.thumb, owner) ?? {};
  const action = resolveMaybeFn(slotProps?.action, owner) ?? {};
  const input = resolveMaybeFn(slotProps?.input, owner) ?? {};
  const startDecorator = resolveMaybeFn(slotProps?.startDecorator, owner) ?? {};
  const endDecorator = resolveMaybeFn(slotProps?.endDecorator, owner) ?? {};

  return { root, track, thumb, action, input, startDecorator, endDecorator };
}

/* -------------------------------------------------
 *  Default slots – дефолтните елементи за компонентната структура
 * ------------------------------------------------- */
export const defaultSwitchSlots: Required<SwitchSlots> = {
  root: "label",
  track: "span",
  thumb: "span",
  action: "div",
  input: "input",
  startDecorator: "span",
  endDecorator: "span",
};

/* -------------------------------------------------
 *  Data атрибути за root – използваме в стиловете (CSS селектори)
 * ------------------------------------------------- */
export function buildRootDataAttrs(s: {
  checked: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  focused?: boolean;
}) {
  return {
    ...(s.focused ? { "data-focused": "" } : {}),
    ...(s.disabled ? { "data-disabled": "" } : {}),
    ...(s.readOnly ? { "data-readonly": "" } : {}),
    ...(s.required ? { "data-required": "" } : {}),
    ...(s.checked ? { "data-checked": "" } : {}),
  };
}

/* -------------------------------------------------
 *  Motion пресети – v2 (по-стегната пружина, по-малък bounce)
 * ------------------------------------------------- */
export function getSwitchMotionPreset(size: Size = "md"): SwitchMotionPreset {
  switch (size) {
    case "sm":
      return {
        thumbSpring: { type: "spring", stiffness: 420, damping: 30, mass: 0.4 },
        pressScale: 1.04,
        focusGlowIntensity: 0.20,
      };
    case "lg":
      return {
        thumbSpring: { type: "spring", stiffness: 420, damping: 30, mass: 0.6 },
        pressScale: 1.04,
        focusGlowIntensity: 0.22,
      };
    case "md":
    default:
      return {
        thumbSpring: { type: "spring", stiffness: 420, damping: 30, mass: 0.5 },
        pressScale: 1.04,
        focusGlowIntensity: 0.21,
      };
  }
}

/* -------------------------------------------------
 *  TranslateX за палецa – синхрон с новите размери (v2)
 * ------------------------------------------------- */
// Трябва да е 1:1 с SIZE_MAP в Switch.styles.ts
const SIZE_NUMERIC = {
  sm: { trackW: 28, trackH: 16, thumb: 12, pad: 2 },
  md: { trackW: 40, trackH: 20, thumb: 16, pad: 2 },
  lg: { trackW: 52, trackH: 28, thumb: 22, pad: 2 },
} as const;

export function getThumbTranslateX(size: Size = "md"): number {
  const s = SIZE_NUMERIC[size] ?? SIZE_NUMERIC.md;
  return s.trackW - s.thumb - s.pad * 2;
}

/* -------------------------------------------------
 *  Border animation – inline стилови променливи (custom stops/скорост)
 * ------------------------------------------------- */
// Превеждаме LD token → CSS var(--ld-color-...)
const toCssColor = (c: string) =>
  c.startsWith("var(") || c.startsWith("#") || c.startsWith("rgb(") || c.startsWith("hsl(")
    ? c
    : `var(--ld-color-${c.replace(/\./g, "-")})`;

// Строим linear-gradient от цветни стопове; ако няма стопове → derive от baseColor
function buildGradientFromStops(stops: string[] | undefined, baseColor: string) {
  const base = toCssColor(baseColor);
  const arr =
    stops && stops.length >= 2
      ? stops.map(toCssColor)
      : [
          base,
          `color-mix(in oklab, ${base} 80%, white)`,
          `color-mix(in oklab, ${base} 55%, black)`,
          base,
        ];
  return `linear-gradient(90deg, ${arr.join(", ")})`;
}

// Връща обект за style={}, който задава CSS custom properties за границата
export function getBorderAnimationStyle(opts: {
  borderAnimation?: "none" | "gradient" | "glow" | "pulse";
  borderColors?: string[];
  borderAnimationSpeed?: number;
  color?: Color | string;
}): React.CSSProperties {
  const style: React.CSSProperties = {};
  const { borderAnimation, borderColors, borderAnimationSpeed, color = "primary" } = opts;

  if (borderAnimation === "gradient" && (borderColors?.length || borderAnimationSpeed)) {
    style["--ld-switch-border-gradient" as any] = buildGradientFromStops(
      borderColors,
      String(color)
    );
    if (borderAnimationSpeed) {
      style["--ld-switch-border-speed" as any] = `${borderAnimationSpeed}ms`;
    }
  }
  // glow/pulse не изискват допълнителни inline променливи
  return style;
}

/* -------------------------------------------------
 *  OwnerState – централизиране на видимите пропсове към стиловете
 * ------------------------------------------------- */
// Събираме всичко необходимо за стиловете/анимацията в един обект
export function buildOwnerState(input: {
  checked: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  focusVisible?: boolean;
  variant?: Variant;
  size?: Size;
  color?: Color | string;
  radius?: Radius | number | string;
  borderAnimation?: "none" | "gradient" | "glow" | "pulse";
  borderWidth?: number | string;
}): SwitchOwnerState {
  return {
    checked: !!input.checked,
    disabled: !!input.disabled,
    readOnly: !!input.readOnly,
    focusVisible: !!input.focusVisible,
    variant: input.variant ?? "filled",
    size: input.size ?? "md",
    color: input.color,
    radius: input.radius ?? "xl",
    borderAnimation: input.borderAnimation ?? "gradient",
    borderWidth: input.borderWidth ?? 2,
  };
}

/* -------------------------------------------------
 *  Decorators – приемат ReactNode или (state) => ReactNode
 * ------------------------------------------------- */
// коментар: ако е функция – извиква с ownerState, иначе връща стойността
export function renderDecorator(
  node: SwitchProps["startDecorator"] | SwitchProps["endDecorator"],
  ownerState: SwitchOwnerState
): React.ReactNode {
  if (typeof node === "function") {
    return (node as any)(ownerState);
  }
  return node ?? null;
}

/* -------------------------------------------------
 *  Motion helpers – начални/крайни състояния за Thumb (Framer Motion)
 * ------------------------------------------------- */
export function getThumbMotionProps(params: {
  checked: boolean;
  size?: Size;
}) {
  const { checked, size = "md" } = params;
  const x = getThumbTranslateX(size);
  const preset = getSwitchMotionPreset(size);

  return {
    initial: { x: checked ? x : 0, scale: 1 },
    animate: { x: checked ? x : 0, scale: 1 },
    whileTap: { scale: preset.pressScale },
    transition: preset.thumbSpring,
  } as const;
}
