# Gus Blog

A small editorial blog built with React, TypeScript, and Vite. The app ships a minimalist landing page, animated post cards, post detail routes, and a persisted light/dark theme toggle.

## Technology Stack

- React 19
- TypeScript 5.9
- Vite 7
- React Router 7
- Framer Motion 12
- Tailwind CSS 4
- ESLint 9 with type-aware `typescript-eslint` rules
- pnpm 10

## Project Architecture

This is a client-side single-page application.

- [`src/main.tsx`](./src/main.tsx) boots the app and mounts `BrowserRouter`.
- [`src/App.tsx`](./src/App.tsx) contains the main UI composition, theme context, route definitions, and page transitions.
- [`src/data/posts.ts`](./src/data/posts.ts) stores the current post content and lookup map.
- [`src/index.css`](./src/index.css) loads Tailwind and sets the base typography/layout rules.
- [`vite.config.ts`](./vite.config.ts) enables the React and Tailwind Vite plugins.

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

## Project Structure

```text
.
├── public/              Static public assets
├── src/
│   ├── data/            Post content and content types
│   ├── App.tsx          App shell, routes, theme state, animations
│   ├── index.css        Tailwind import and base styles
│   └── main.tsx         React entrypoint
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
- Tailwind-driven responsive layout and typography

## Development Workflow

The current workflow is intentionally small:

1. Install dependencies with `pnpm install`.
2. Build features in `src/App.tsx`, `src/data/posts.ts`, and `src/index.css`.
3. Run `pnpm lint` before committing.
4. Run `pnpm build` to verify the production bundle.

There is no documented branching model in the repository today. The app is also using local in-repo content rather than a CMS or API.

## Coding Standards

- Use TypeScript with strict compiler settings.
- Keep the codebase ESM-only.
- Follow the existing flat ESLint configuration in [`eslint.config.js`](./eslint.config.js).
- Prefer simple local state and colocated UI logic for this small app.
- Keep styling in Tailwind utility classes, with only base globals in [`src/index.css`](./src/index.css).

## Testing

There is no automated test suite configured yet.

Current quality checks:

- `pnpm lint`
- `pnpm build`
