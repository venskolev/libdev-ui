# Changelog

All notable changes to **@libdev-ui/base** will be documented in this file.  
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.0] - 2025-08-08

### Added

- **Input** component with variants (`outlined`, `filled`, `ghost`), sizes (`sm`, `md`, `lg`), colors (`primary`, `secondary`, `success`, `danger`, `warning`, `info` or custom), radius, adornments, multiline support, and clear button.
- Shared UI tokens: sizing, colors, variants, and radius via `src/components/common.types.ts` across components for consistent typing.

## [0.1.2] - 2025-08-07

### Changed

- Styles aligned with global CSS variables (from `:root`) to keep theming centralized.

### Fixed

- Minor style edge-cases for focus ring and disabled opacity in input fields.

## [0.1.1] - 2025-08-07

### Fixed (0.1.1)

- Package name normalized and metadata updated.
- Docs polished for initial publish.

## [0.1.0] - 2025-08-07

### Initial Release

- Initial release of **@libdev-ui/base**.
- `Button` component with variants, colors, and sizes.
- `AutoSuggest` component with adjustable behavior and clear button.
- Global CSS variables for theming.
