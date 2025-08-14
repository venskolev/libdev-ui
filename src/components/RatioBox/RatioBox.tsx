// src/components/Media/RatioBox/RatioBox.tsx
// LibDev UI – Custom React UI components

import React, { forwardRef } from "react";
import type { RatioBoxProps } from "./RatioBox.types";
import { ratioBoxClasses } from "./RatioBox.types";
import { StyledRatioBoxRoot, StyledRatioBoxContent } from "./RatioBox.styles";
import type { SlProp, StyleArg } from "../../system/styleEngine";

// помощник: класове
const cx = (...a: Array<string | undefined | null | false>) => a.filter(Boolean).join(" ");

// помощник: normalize sl (без вложени масиви)
function normalizeSl(...all: Array<SlProp | undefined>): SlProp | undefined {
  const out: StyleArg[] = [];
  for (const s of all) {
    if (!s) continue;
    if (Array.isArray(s)) out.push(...(s as StyleArg[]));
    else out.push(s as StyleArg);
  }
  if (out.length === 0) return undefined;
  return out.length === 1 ? out[0] : out;
}

const RatioBox = forwardRef<HTMLDivElement, RatioBoxProps>(function RatioBox(props, ref) {
  const {
    children,
    ratio = "16/9",
    objectFit = "cover",
    component,
    slots,
    slotProps,
    className,
    sl,
    ...rest
  } = props;

  const Root = (slots?.root as any) ?? StyledRatioBoxRoot;
  const Content = (slots?.content as any) ?? StyledRatioBoxContent;

  const rootSlot = (slotProps?.root ?? {}) as { sl?: SlProp; className?: string };
  const contentSlot = (slotProps?.content ?? {}) as { sl?: SlProp; className?: string };

  const finalRootProps = {
    ...rest,
    ...rootSlot,
    ratio,
    objectFit,
    sl: normalizeSl(sl, rootSlot.sl),
    className: cx(ratioBoxClasses.root, className, rootSlot.className),
  };

  return (
    <Root ref={ref} as={component as any} {...finalRootProps}>
      <Content className={cx(ratioBoxClasses.content, contentSlot.className)} sl={contentSlot.sl}>
        {children}
      </Content>
    </Root>
  );
});

RatioBox.displayName = "RatioBox";

export default RatioBox;
