# Headknot Marketing Website

The public marketing site for Headknot, built with React, TypeScript, Vite, and
Tailwind CSS v4. It shares the design tokens and components from
[`@workspace/ui`](../../packages/ui).

## Getting Started

From the root of the monorepo:

```bash
pnpm install
```

### Develop

```bash
pnpm --filter @headknot/website dev
```

The dev server runs on [http://localhost:5174](http://localhost:5174).

### Build

```bash
pnpm --filter @headknot/website build
```

Static output is emitted to `dist/`. Preview it with:

```bash
pnpm --filter @headknot/website preview
```

## Structure

- `src/App.tsx` — composes the landing page sections in order.
- `src/components/` — one file per section (`Hero`, `Features`, `HowItWorks`,
  `UseCases`, `Pricing`, `FAQ`, `CTA`, `Footer`) plus `Navbar`, `Logo`, and the
  decorative `GraphVisual`.
- `src/styles/site.css` — imports the shared `@workspace/ui` globals and adds a
  few marketing-only helpers (aurora glow, grid, gradient text).

CTAs link to the app at `https://app.headknot.com` (sign in / sign up).
