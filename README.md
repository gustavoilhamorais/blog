# Gus Blog

A small editorial blog built with React, TypeScript, and Vite. The app ships a minimalist landing page, animated post cards, post detail routes, a persisted light/dark theme toggle, and a Vitest + React Testing Library test suite.

## Technology Stack

- React 19
- TypeScript 5.9
- Vite 7
- React Router 7
- Framer Motion 12
- Tailwind CSS 4
- Vitest with React Testing Library and `jsdom`
- ESLint 9 with type-aware `typescript-eslint` rules
- pnpm 10

## Project Architecture

This is a client-side single-page application.

- [`src/main.tsx`](./src/main.tsx) boots the app and mounts `BrowserRouter`.
- [`src/App.tsx`](./src/App.tsx) contains the app shell and route composition.
- [`src/theme.tsx`](./src/theme.tsx) owns theme state and persistence.
- [`src/theme-context.ts`](./src/theme-context.ts) contains the theme context and hook.
- [`src/components/`](./src/components) contains reusable UI pieces such as the theme toggle and post cards.
- [`src/routes/`](./src/routes) contains the route-level screens.
- [`src/data/posts.ts`](./src/data/posts.ts) stores the current post content and lookup map.
- [`src/index.css`](./src/index.css) loads Tailwind and sets the base typography/layout rules.
- [`src/test/`](./src/test) contains shared test setup and render helpers.
- [`vite.config.ts`](./vite.config.ts) enables the React and Tailwind Vite plugins plus Vitest config.

Routing is simple and local:

- `/` renders the post index.
- `/posts/:slug` renders a single post view.
- Unknown routes redirect back to `/`.

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+

### Install

```bash
pnpm install
```

### Run the Development Server

```bash
pnpm dev
```

### Create a Production Build

```bash
pnpm build
```

### Preview the Production Build

```bash
pnpm preview
```

### Lint the Project

```bash
pnpm lint
```

### Run the Test Suite

```bash
pnpm test
```

### Watch Tests During Development

```bash
pnpm test:watch
```

### Generate Coverage

```bash
pnpm test:coverage
```

## Project Structure

```text
.
├── public/              Static public assets
├── src/
│   ├── components/      Reusable UI components
│   ├── data/            Post content and content types
│   ├── routes/          Route-level screens
│   ├── test/            Shared Vitest and RTL helpers
│   ├── App.tsx          App shell and route composition
│   ├── index.css        Tailwind import and base styles
│   ├── main.tsx         React entrypoint
│   ├── theme-context.ts Theme context and hook
│   └── theme.tsx        Theme provider and persistence logic
├── eslint.config.js     ESLint flat config
├── index.html           Vite HTML entry
├── package.json         Scripts and dependencies
├── tsconfig*.json       TypeScript project config
└── vite.config.ts       Vite plugin setup
```

## Key Features

- Minimal blog homepage with editorial hero copy
- Individual post pages resolved from slug-based routes
- Shared-layout motion between list and detail views
- Persisted theme toggle using `localStorage`
- Theme initialization that respects system color preference
- Route and component coverage with Vitest and React Testing Library
- Tailwind-driven responsive layout and typography

## Development Workflow

The current workflow is intentionally small:

1. Install dependencies with `pnpm install`.
2. Build features in `src/routes`, `src/components`, `src/theme.tsx`, `src/theme-context.ts`, `src/data/posts.ts`, and `src/index.css`.
3. Run `pnpm lint` and `pnpm test` before committing.
4. Run `pnpm build` to verify the production bundle.

There is no documented branching model in the repository today. The app is also using local in-repo content rather than a CMS or API.

## Coding Standards

- Use TypeScript with strict compiler settings.
- Keep the codebase ESM-only.
- Follow the existing flat ESLint configuration in [`eslint.config.js`](./eslint.config.js).
- Prefer simple local state and small focused modules over one large app file.
- Keep styling in Tailwind utility classes, with only base globals in [`src/index.css`](./src/index.css).

## Testing

The repository now uses Vitest with React Testing Library in a `jsdom` environment.

Current quality checks:

- `pnpm lint`
- `pnpm test`
- `pnpm test:coverage`
- `pnpm build`

Current test coverage focuses on:

- route rendering for `/`, `/posts/:slug`, and redirect behavior
- navigation flows between the index and post detail views
- theme toggle behavior and `localStorage` persistence
- post card rendering and route link correctness
