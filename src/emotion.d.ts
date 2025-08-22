// src/emotion.d.ts
// LibDev UI – Emotion types

/** @jsxImportSource @emotion/react */
import "@emotion/react";

declare module "react" {
  interface Attributes {
    css?: import("@emotion/react").SerializedStyles;
  }
}

import "@emotion/react";
import type { LibDevTheme } from "../system/styleEngine";

declare module "@emotion/react" {
  // правим Theme супермножество на нашия LibDevTheme
  export interface Theme extends LibDevTheme {}
}
