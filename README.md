# @libdev-ui/base

Modern React UI component library built for speed, consistency, and developer experience.

- [Documentation](https://libdev.net)
- **Type-safe by design** — strict TypeScript across the codebase
- **Unified theming** — CSS variables for colors, radii, spacing
- **Accessible by default** — ARIA + keyboard interactions
- **Production-ready** — lean styles, minimal runtime overhead

---

## Installation

```bash
# npm
npm install @libdev-ui/base

# pnpm
pnpm add @libdev-ui/base
```

### Peer dependencies

LibDev UI uses Emotion for styling and Framer Motion for motion-enabled components.

```bash
pnpm add @emotion/react @emotion/styled framer-motion
```

> If you don’t use motion props, Framer Motion is still required currently because `Button` wraps `motion.button`. A separate `ButtonMotion` will be provided later.

---

## Quick Start

```tsx
import React, { useState } from "react";
import { Button, AutoSuggest, Input } from "@libdev-ui/base";

export default function App() {
  const [fruit, setFruit] = useState("");

  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 520 }}>
      {/* Button */}
      <Button color="primary" variant="filled">Click Me</Button>

      {/* AutoSuggest */}
      <AutoSuggest
        options={[
          { label: "Apple",      value: "apple" },
          { label: "Banana",     value: "banana" },
          { label: "Strawberry", value: "strawberry" },
        ]}
        value={fruit}
        onChange={setFruit}
        placeholder="Start typing..."
      />

      {/* Input */}
      <Input placeholder="Your name" showClearButton />
    </div>
  );
}
```

---

## Theming (CSS variables)

All components read design tokens from global CSS variables. Add these to your `global.css` (values are examples):

```css
:root {
  /* brand colors */
  --color-primary:  #3b82f6;
  --color-secondary:#64748b;
  --color-success:  #22c55e;
  --color-danger:   #ef4444;
  --color-warning:  #f59e0b;
  --color-info:     #0ea5e9;

  /* radii */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
}
```

> You can also pass custom colors directly (e.g., `color="var(--brand-accent)"`, `color="#22c55e"`).

---

## Components

### Button

A versatile button driven by the shared `useButtonBase` hook.

```tsx
<Button variant="filled"  color="primary">Primary</Button>
<Button variant="outlined" color="success">Outlined</Button>
<Button variant="ghost"    color="#22c55e">Ghost (HEX)</Button>

<Button loading>Loading…</Button>
<Button disabled>Disabled</Button>

{/* Toggle behavior */}
function ToggleExample() {
  const [pressed, setPressed] = React.useState(false);
  return (
    <Button toggleable pressed={pressed} onPressedChange={setPressed}>
      {pressed ? "On" : "Off"}
    </Button>
  );
}
```

Props highlights:

- `variant`: `"filled" | "outlined" | "ghost"` (default: `"filled"`)
- `color`: `"primary" | "secondary" | "success" | "danger" | "warning" | "info" | string"`
- `size`: `"sm" | "md" | "lg"` (default: `"md"`)
- `radius`: `"sm" | "md" | "lg"` (default: `"md"`)
- `loading`, `disabled`, `preventFocusOnPress`, `toggleable`, `pressed`, `defaultPressed`, `onPressedChange`

### Input

A highly customizable input with variants, sizes, colors, adornments and multiline.

```tsx
<Input placeholder="Outlined (default)" variant="outlined" />
<Input placeholder="Filled" variant="filled" />
<Input placeholder="Ghost" variant="ghost" />

<Input placeholder="Small"  size="sm" />
<Input placeholder="Medium" size="md" />
<Input placeholder="Large"  size="lg" />
```

### AutoSuggest

Combo-box style suggestions with controlled/uncontrolled value, clear behavior and custom options.

```tsx
const options = [
  { label: "Apple", value: "apple" },
  { label: "Orange", value: "orange" },
  { label: "Mango", value: "mango" },
];

<AutoSuggest
  options={options}
  value={value}
  onChange={setValue}
  placeholder="Select a fruit"
/>
```

---

## Hooks

### `useButtonBase`

Centralized logic for all button-like components (focus handling, accessibility, optional toggle, `getRootProps()` / `getButtonProps()`).

```tsx
import { useButtonBase } from "@libdev-ui/base/hooks";

function IconButton(props) {
  const { getRootProps, getButtonProps } = useButtonBase(props);
  return (
    <span {...getRootProps()} className="icon-button-root">
      <button {...getButtonProps()} className="icon-button">
        {props.children}
      </button>
    </span>
  );
}
```

---

## What’s new in 0.3.0

- **New hook:** `useButtonBase` with `getRootProps` / `getButtonProps`, ARIA guards, and optional toggle state.
- **Button:** added `toggleable`, `pressed`, `defaultPressed`, `onPressedChange`, and `loading`.
- **Button styles:** `color` now accepts palette tokens **or** custom strings (e.g., `var(--brand)`, `#22c55e`).

See full changes in [`CHANGELOG.md`](./CHANGELOG.md).

---

## Development

```bash
pnpm install
pnpm build        # tsup
pnpm dev          # if you have a local playground
# Docs (if present in this repo)
pnpm -C libdev-docs build
pnpm -C libdev-docs serve
```

---

## License

MIT © 2025 [WebDigiTech - Ventsislav Kolev](https://webdigitech.de)
