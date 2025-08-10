// src/components/Container/Container.tsx
// LibDev UI – Custom React UI components

import React from "react";
import { StyledContainer } from "./Container.styles";
import type { ContainerProps } from "./Container.types";

export const Container: React.FC<ContainerProps> = ({
  as: Component = "div",
  asChild,
  children,
  ...props
}) => {
  // asChild: без wrapper – рендерираме StyledContainer като типа на child
  // Запазваме child props/className и ги мерджваме
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    const {
      children: childChildren,
      className: childClassName,
      ...childRest
    } = child.props || {};

    return (
      <StyledContainer
        as={child.type as React.ElementType}
        {...childRest}
        {...props}
        // Emotion ще мерджне className от StyledContainer с подадения
        className={childClassName}
      >
        {childChildren}
      </StyledContainer>
    );
  }

  // Нормален рендер с полиморфен `as`
  return (
    <StyledContainer as={Component as React.ElementType} {...props}>
      {children}
    </StyledContainer>
  );
};
