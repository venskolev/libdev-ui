# Changelog

All notable changes to **@libdev-ui/base** will be documented in this file.  
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.5.0] - 2025-08-10

### Added

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
