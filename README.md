# @libdev-ui/base

Modern React UI component library built for speed, consistency, and developer experience.

## 🚀 Installation

```bash
npm install @libdev-ui/base
# or
pnpm add @libdev-ui/base
```

## 📦 Usage

```tsx
import React from 'react';
import { Button, AutoSuggest } from '@libdev-ui/base';

export default function App() {
  return (
    <div>
      <Button variant="primary">Click Me</Button>

      <AutoSuggest
        options={[
          { label: 'Apple', value: 'apple' },
          { label: 'Banana', value: 'banana' },
          { label: 'Cherry', value: 'cherry' },
        ]}
        onChange={(value) => console.log(value)}
      />
    </div>
  );
}
```

## ✨ Features

- **Type-safe by design** – Strict TypeScript support for all components.
- **Unified theming** – CSS variables for colors, radii, spacing.
- **Accessible by default** – Keyboard navigation and ARIA support.
- **Production-ready** – Minimal bundle size and zero runtime dependencies.

## 📚 Documentation

Full documentation is available at:  
[**libdev.net/docs**](https://libdev.net/docs)

## 🛠 Development

Clone the repository and run:

```bash
pnpm install
pnpm dev
```

## 📄 License

MIT © 2025 [WebDigiTech - Ventsislav Kolev](https://libdev.net)
