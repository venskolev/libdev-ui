# LibDev UI — Base

Modern React UI component library built for speed, consistency, and developer experience.

- [Documentation](https://libdev.net)
- **Type-safe by design** — strict TypeScript across the codebase
- **Unified theming** — CSS variables for colors, radii, spacing
- **Accessible by default** — ARIA + keyboard interactions
- **Production-ready** — lean styles, minimal runtime overhead

Includes core building blocks (Box, Button, Input) and layout primitives (Flex, Grid) with a shared **responsive** system.

## Installation

```bash
# with pnpm
pnpm add @libdev-ui/base 

# with yarn
yarn add @libdev-ui/base 

# with npm
npm i @libdev-ui/base 
```

## Quick start

```tsx
import * as React from "react";
import { ThemeProvider } from "@emotion/react";
import { defaultTheme, Box, Flex, Grid, Button, Input } from "@libdev-ui/base";

export default function App(): JSX.Element {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box p={{ xs: 8, md: 16 }}>
        <Flex direction={{ xs: "column", md: "row" }} gap={{ xs: 8, md: 16 }}>
          <Input placeholder="Email" />
          <Button>Send</Button>
        </Flex>
        <Grid columns={{ xs: 2, md: 4 }} gap={12} mt={16}>
          {/* ... */}
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
```

## Responsive props

All core layout props support breakpoint-aware values using this pattern:

```ts
type BreakpointKey = "xs" | "sm" | "md" | "lg" | "xl";
type Responsive<T> = T | Partial<Record<BreakpointKey, T>>;
```

Examples:

```tsx
<Flex direction={{ xs: "column", md: "row" }} gap={{ xs: 8, md: 16 }} />
<Box width={{ xs: "100%", md: 480 }} p={{ xs: 8, md: 16 }} />
<Grid columns={{ xs: 2, md: 4 }} gapY={{ xs: 8, md: 12 }} />
```

Numeric spacing values use the theme spacing scale (`theme.spacing(n)`) when available; otherwise numbers are interpreted as **px**.

## Polymorphic components

Use `component?: ElementType` to change the rendered element:

```tsx
<Flex component="span" />
<Grid component="section" />
<Box component={MyCustomLink} />
```

Internally, the `as` prop is set only when a custom `component` is provided and is **not forwarded** to the DOM by default.

## Components

- **Box** — basic container with Style Layer (`sl`) support and shared layout props.
- **Flex** — flex layout container (`direction`, `align`, `justify`, `wrap`, `gap/gapX/gapY`) + shared layout props.
- **Grid** — CSS Grid container (`columns`, `rows`, `areas`, `autoFlow`, alignment, gaps) + shared layout props.
- **Button**, **Input**, **AutoSuggest** — standard form controls.
- **Hooks**: `useButtonBase`, `useInputBase`, `useStyleResolver`.

## Docs

- `docs/components/flex.mdx` — Flex docs with TS/JS examples.
- `docs/components/grid.mdx` — Grid docs with TS/JS examples.

## Contributing

```bash
pnpm i
pnpm build
pnpm test # (if tests exist)
```

## Development notes

- The shared responsive engine lives in `src/system/`:
  - `responsive.ts` — media query helpers and value converters.
  - `layout.types.ts` — `CommonLayoutProps` definition.
  - `layout.mixin.ts` — `applyCommonLayoutStyles` mixin used by Box/Flex/Grid.
- Global types are in `src/components/common.types.ts`.

---

## License

MIT © 2025 [WebDigiTech - Ventsislav Kolev](https://webdigitech.de)
