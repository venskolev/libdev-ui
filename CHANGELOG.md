# Changelog

All notable changes to **@libdev-ui/base** will be documented in this file.  
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

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

### Changed

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
