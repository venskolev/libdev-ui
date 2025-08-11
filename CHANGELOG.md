# Changelog

All notable changes to **@libdev-ui/base** will be documented in this file.  
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## 0.9.0 - 2025-08-11

### Added

- **Typography** component (with **Text** alias).
  - Polymorphic root via `as`/`component`.
  - Levels: `h1` | `h2` | `h3` | `h4` | `title-lg` | `title-md` | `title-sm` | `body-lg` | `body-md` | `body-sm` | `body-xs` | `inherit`.
  - Variants: `plain` | `soft` | `solid` | `outlined`.
  - Themed colors via `LDColorToken` (e.g. `text.secondary`, `primary.hover`) or any CSS color / `var(...)`.
  - Decorators: `startDecorator`, `endDecorator`.
  - Wrapping: `wrap="wrap|nowrap|balance|pretty"`, `noWrap`, `truncate`.
  - Typography controls: `align`, `weight`, `gutterBottom`, `levelMapping`.
  - Slots API: `slots` and `slotProps` for `root`, `startDecorator`, `endDecorator`.
  - **sl** style layer (merged before `style`) and full **CommonLayoutProps** support (m/p/size/position/overflow/flex/grid).

## 0.8.0 – 2025-08-11

### Added in 0.8.0

- **New `BoxMotion` component** (layout-friendly motion wrapper).
  - **Entrance animations** (triggered on scroll into view):
    `fadeIn`, `fadeInUp`, `fadeInDown`, `fadeInLeft`, `fadeInRight`,
    `zoomIn`, `zoomOut`,
    `bounceIn`, `bounceInUp`, `bounceInDown`, `bounceInLeft`, `bounceInRight`,
    `slideInUp`, `slideInDown`, `slideInLeft`, `slideInRight`,
    `rotateIn`,
    `lightSpeedIn`,
    `flipInX`, `flipInY`,
    `rollIn`, `jackInTheBox`, `wobble`, `hinge`, `pulse`, `swing`, `tada`,
    `rubberBand`, `bounce`, `flash`, `shake`, `jello`.
  - **Scrolling effects** (live while scrolling): vertical/horizontal parallax, opacity, blur, rotate, scale.
  - **Mouse interactions**: `mouseTrack` (subtle XY translation) and `tilt3d` (rotateX/rotateY with perspective).
  - **API**:
    - `effect`, `speed` (`slow` | `normal` | `fast`), `delay`, `staggerChildren`
    - `viewportOnce`, `viewportAmount` (or pass a custom `viewport`)
    - `disabled`, `variantsOverride`
    - `scroll` `{ vertical, horizontal, opacity, blur, rotate, scale, mouseTrack, tilt3d }`
    - `sl` (Style Layer) + full **CommonLayoutProps** via the layout engine.
  - **Behavior**:
    - Uses `whileInView` by default (`once: true`) for entrance.
    - If a user provides `animate`, the component respects it and **does not** attach `whileInView/viewport` (no conflicts).
    - MotionValues for scroll/mouse/tilt are attached **only when requested**, so entrance variants aren’t overridden unintentionally.
  - **DOM hygiene**: style-only and motion-only props are filtered from the DOM; styles are applied through `$styles` and `applyCommonLayoutStyles`.

## [0.7.2] - 2025-08-10

### Fixed in 0.7.2

- **Container**: Now properly exported from the main package entry (`src/index.ts`), allowing it to be imported via `import { Container } from "@libdev-ui/base"`.
- Added explicit export of `Container` and its types (`ContainerProps`, `ContainerSize`, `ContainerAlign`) from the correct path to ensure availability in the built `dist` output.

## [0.7.1] - 2025-08-10

### Fixed in 0.7.1

- **Container**: Removed local `Responsive` type definition in `Container.types.ts` to avoid conflicts with the global `Responsive` type from `common.types.ts`.
- Updated `Container` to import and use the global `Responsive` type, ensuring full compatibility with `system/responsive.ts` and preventing duplicate export errors in `components/index.ts`.

## [0.7.0] - 2025-08-10

### Added in 0.7.0

- **Container**: A new layout component that constrains the maximum width of page content and ensures consistent horizontal alignment.  
  - Supports responsive `size` (1–4) using the new CSS variables `--ld-container-1`..`--ld-container-4`.
  - Allows horizontal `align` (`left`, `center`, `right`) and integrates with `layoutMixin` for full spacing, sizing, positioning, and overflow control.
  - Supports polymorphic rendering via `as` and `asChild` props.
  - Designed to be part of the Layout component family (`Box`, `Flex`, `Grid`, `Section`).

## [0.6.1] - 2025-08-10

### Added in 0.6.1

- **Margin shorthands:** Introduced `m`, `mx`, `my`, `mt`, `mr`, `mb`, `ml` to `CommonLayoutProps`.
- **layout.mixin:** Responsive CSS mapping for the new margin shorthands (uses `theme.spacing` when available).

### Fixed in 0.6.1

- **DOM leakage:** Added margin shorthands to `STYLE_ONLY_PROPS` filters in **Box**, **Flex**, and **Grid** so they do not appear as DOM attributes.
- **Grid styles:** Ensured margin shorthands are respected via `applyCommonLayoutStyles` and filtered from the DOM.

### Documentation

- **Box docs:** Updated notes to include margin shorthands (m/mx/my/mt/mr/mb/ml) and responsive behavior.

## [0.6.0] - 2025-08-10

### Added in 0.6.0

- **Global responsive system**
  - `src/components/common.types.ts`: added `BreakpointKey`, `Responsive<T>`, `CSSLength`, `Space`, `ResponsiveSpace`.
  - `src/system/responsive.ts`: media query helpers (`getMediaQuery`), value mappers (`toSpace`, `toCssLength`), and `buildResponsiveStyle`.
  - `src/system/layout.types.ts`: `CommonLayoutProps` shared across layout components.
  - `src/system/layout.mixin.ts`: `layoutMixin` / `applyCommonLayoutStyles` to translate common layout props into CSS.
- **New components**
  - `Flex`: responsive flex container with `direction`, `align`, `justify`, `wrap`, `gap`, `gapX`, `gapY` + `CommonLayoutProps`.
  - `Grid`: responsive CSS Grid container with `columns`, `rows`, `areas`, `autoFlow`, alignment props, and gaps + `CommonLayoutProps`.

### Changed in 0.6.0

- **Box**: adopted the shared responsive system via `applyCommonLayoutStyles`. Now supports `CommonLayoutProps` responsively.
- **Polymorphic rendering**:
  - `Box` and `Flex` use `component?: ElementType` for polymorphic roots. Internal `as` is set only when `component` is provided and differs from `"div"`.
  - `shouldForwardProp` guards were added to prevent style-only props from leaking into the DOM.

### Fixed in 0.6.0

- Prevented leaking of style-only props to DOM, e.g. `direction="[object Object]"` or `as="div"`.
- Consistent gap handling for numeric values using the theme spacing scale when available.

### Migration notes

- Prefer `component` over `as` for polymorphic usage:

  ```tsx
  // Before (not recommended)
  // <Flex as="span" ... />

  // After
  <Flex component="span" ... />

  ```

- If you had tests asserting DOM attributes, note that style-only props (e.g. `direction`, `gap`, `p`) no longer appear as attributes.
- Box now accepts responsive layout props (`p`, `width`, `position`, etc.).

## [0.5.1] - 2025-08-10

### Fixed in 0.5.1

- **Spacing shorthands:** prevent double-scaling for `m*/p*` shorthands. Values now scale exactly once via `theme.spacing()`.
  - `mt: 20` → `margin-top: 160px` (with spacing(20) = 160)
  - `marginTop: 20` → `margin-top: 160px`
  - `mt: "20px"` → `margin-top: 20px` (no scaling for strings)

## [0.5.0] - 2025-08-10

### Added in 0.5.0

- **Runtime token injection:** tokens are injected from `global.css` at import time (generated injector), so consumers do not need to import any CSS.
- **Semantic `boxShadow` support:** `xs | sm | md | lg | xl` mapped to CSS variables with sensible fallbacks.

### Changed

- **Shadows:** strengthened values for dark-friendly rendering:

  ```css
  --ld-shadow-xs: 0 1px 2px rgba(0,0,0,.50);
  --ld-shadow-sm: 0 1px 3px rgba(0,0,0,.60);
  --ld-shadow-md: 0 4px 12px rgba(0,0,0,.70);
  --ld-shadow-lg: 0 8px 24px rgba(0,0,0,.80);
  --ld-shadow-xl: 0 14px 40px rgba(0,0,0,.90);

- **styleEngine / `varChain`:** safe var() chaining that never wraps literals (e.g. `white`, `20px`, `#fff`, `rgb(...)`).
  
- **Token mapping:** improved mapping for `color` and `borderRadius`:
  - CSS keywords are kept as-is (e.g. `white`).
  - Tokens map to `--ld-*` with valid fallbacks (no `var(literal)`).
- **Aliases:** `bgcolor/bg` → `backgroundColor` (coverage improved).

Aliases: bgcolor/bg → backgroundColor (coverage improved).

### Fixed in 0.5.0

- **DevTools strike-through:** removed invalid constructs like `var(white)` / `var(20px)` so properties now apply correctly.
- **Invisible shadows on dark backgrounds:** shadows are now clearly visible (previous `lg`/`xl` were too subtle).

> **Note:** No breaking changes. Consumers don’t need to import CSS manually.

## [0.4.2] - 2025-08-09

### Fixed in 0.4.2

- **sl/tokens:** Added full design token support:
  - **palette tokens** for color props (`color`, `backgroundColor/bgcolor`, `borderColor`, `outlineColor`, `caretColor`, `fill`, `stroke`) — e.g. `primary.outlinedBorder`, `background.level1` → `var(--color-...))`.
  - **borderRadius tokens:** `sm|md|lg|xl|2xl|pill|circle` → `var(--radius-*))` (with `pill=9999px`, `circle=50%`).
  - **boxShadow tokens:** `xs|sm|md|lg|xl` →  var(--shadow-*))`.
- **aliases:** `bgcolor`/`bg` now map to `backgroundColor`.

> Note: No API changes. This release focuses solely on token/alias compatibility so styles like `borderRadius: "xl"`, `boxShadow: "md"`, and `bgcolor: "background.level1"` apply correctly.

## [0.4.1] - 2025-08-09

### Fixed

- **sl/types:** allow per-property responsive values (`width: { xs, sm, md }`, etc.) and keep spacing shorthands + top-level breakpoints working together.

### Internal

- **styleEngine:** add `Responsive<T>` type and runtime expansion for responsive per-property values.

## [0.4.0] - 2025-08-09

### Added in 0.4.0

- **Box:** Introduced the `Box` layout component with `sl` (style layer) prop for theme-aware styling.  
  Supports objects, arrays, functions with theme context, nested selectors, responsive breakpoints, and spacing shorthands (`p`, `m`, `px`, `py`, etc.).
- **Style Engine:** Core `sl` resolver extracted to a shared system module, enabling consistent styling across all components.

### Fixed in 0.4.0

- **Button:** Applied mid-cycle fix for export resolution and improved TypeScript type safety when importing from the main `components` index.

## [0.3.0] - 2025-08-09

### Added in 0.3.0

- **Hooks:** Introduced `useButtonBase` for centralized focus management, keyboard/mouse guards, optional toggle state, and utility props (`getRootProps`, `getButtonProps`, ARIA support).
- **Button:** Added support for toggleable buttons with `toggleable`, `pressed`, `defaultPressed`, and `onPressedChange` props for true toggle behavior.
- **Button:** Added `loading` prop with `aria-busy` and interaction guard.

### Changed in 0.3.0

- **Button:** Refactored internals to use `useButtonBase` for consistent behavior across future components like `IconButton`, `ToggleButton`, etc.

### Fixed in 0.3.0

- **Button styles:** `color` prop now accepts `Color` or any string (e.g., `var(--brand)`, `#22c55e`, `rgb(...)`) without TypeScript errors.

### Docs

- **Button docs:** Added a new page with TypeScript/JavaScript tabs, live examples, and documentation for variants, sizes, colors, toggle, and loading states.
- **Hooks docs:** Added a new page for `useButtonBase` with API details and example usage.

### Breaking Changes

- None.

## [0.2.1] - 2025-08-08

### Bug Fixes

- **Input:** default **white** root background to avoid dark corners on dark pages.
- **Input:** make the inner `<input>`/`<textarea>` background **transparent** so the root controls the fill.
- **Input:** keep **exact size tokens** (sm/md/lg) — no height changes; use `min-height` on root and remove double padding to prevent visual stretching.
- **Input:** add `overflow: hidden` on root to fully clip rounded corners.
- No API changes; this is a styling patch.

## [0.2.0] - 2025-08-08

### Added in 0.2.0

- **Input** component with variants (`outlined`, `filled`, `ghost`), sizes (`sm`, `md`, `lg`), colors (`primary`, `secondary`, `success`, `danger`, `warning`, `info` or custom), radius, adornments, multiline support, and clear button.
- Shared UI tokens: sizing, colors, variants, and radius via `src/components/common.types.ts` across components for consistent typing.

## [0.1.2] - 2025-08-07

### Updated

- Styles aligned with global CSS variables (from `:root`) to keep theming centralized.

### Fixed in 0.1.2

- Minor style edge-cases for focus ring and disabled opacity in input fields.

## [0.1.1] - 2025-08-07

### Fixed & Updated

- Package name normalized and metadata updated.
- Docs polished for initial publish.

## [0.1.0] - 2025-08-07

### Initial Release

- Initial release of **@libdev-ui/base**.
- `Button` component with variants, colors, and sizes.
- `AutoSuggest` component with adjustable behavior and clear button.
- Global CSS variables for theming.
