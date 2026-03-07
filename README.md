# Gus Blog

A small editorial blog built with React, TypeScript, and Vite. The app ships a minimalist landing page, animated post cards, post detail routes, a persisted light/dark theme toggle, runtime-fetched Markdown posts, and a Vitest + React Testing Library test suite.

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

- [`src/main.tsx`](./src/main.tsx) boots the app and mounts `BrowserRouter` with the `/blog` base path.
- [`src/App.tsx`](./src/App.tsx) contains the app shell and route composition.
- [`src/theme.tsx`](./src/theme.tsx) owns theme state and persistence.
- [`src/theme-context.ts`](./src/theme-context.ts) contains the theme context and hook.
- [`src/components/`](./src/components) contains reusable UI pieces such as the theme toggle and post cards.
- [`src/routes/`](./src/routes) contains the route-level screens.
- [`src/lib/config.ts`](./src/lib/config.ts) resolves the `/blog` runtime configuration.
- [`src/lib/posts.ts`](./src/lib/posts.ts) fetches the post manifest and Markdown bodies.
- [`src/index.css`](./src/index.css) loads Tailwind and sets the base typography/layout rules.
- [`src/test/`](./src/test) contains shared test setup and render helpers.
- [`vite.config.ts`](./vite.config.ts) enables the React and Tailwind Vite plugins plus Vitest config.

Routing is simple and local under the `/blog` base path:

- `/blog/` renders the post index.
- `/blog/posts/:slug` renders a single post view.
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

The Vite development server runs the UI, while Markdown content is expected at `http://localhost:80/blog/posts`. Set `VITE_BLOG_POSTS_ENDPOINT` if you need a different dev endpoint.

### Create a Production Build

```bash
pnpm build
```

### Deploy with Docker Compose

```bash
docker compose build
docker compose up -d
```

The production deployment uses a multi-stage Docker build. Vite generates the static bundle, then `nginx` serves the baked files on port `80` under `/blog` and exposes Markdown posts from a named Docker volume at `/blog/posts`.

Important defaults:

- `/blog/index.html` is served with `Cache-Control: no-store`
- hashed files under `/blog/assets/` are served with `Cache-Control: public, max-age=31536000, immutable`
- `/blog/posts/index.json` is served with `Cache-Control: no-store`
- `/blog/posts/*.md` is served with `Cache-Control: public, max-age=300, must-revalidate`
- client-side routes under `/blog` fall back to `index.html`
- the container exposes a `/healthz` endpoint for health checks
- this setup assumes TLS and volumetric DDoS protection are handled by an upstream edge or load balancer
- IP-based nginx rate limiting is intentionally disabled until trusted proxy `real_ip` settings are defined

Environment values:

- `BLOG_POSTS_ENDPOINT`: runtime endpoint injected into `/blog/runtime-config.js`
- `VITE_BLOG_POSTS_ENDPOINT`: Vite dev fallback for local UI development

### Posts Volume Layout

The named volume mounted at `/srv/blog-posts` must contain:

```text
index.json
building-calm-software.md
notes-on-minimalism.md
```

`index.json` must be an array of summaries:

```json
[
  {
    "slug": "building-calm-software",
    "title": "Building calm software",
    "excerpt": "A few notes on making products that feel small, fast, and focused.",
    "date": "2026-03-07",
    "readingTime": "4 min read",
    "tag": "Product"
  }
]
```

Each Markdown file is loaded from `/blog/posts/<slug>.md`.

### Add a Post Through the nginx Markdown Pipeline

Posts are not bundled into the React app. `nginx` serves them directly from the read-only volume mounted at `/srv/blog-posts`, so publishing a new post means updating the files in that volume.

Use this workflow:

1. Pick a slug such as `shipping-small-products`.
2. Add a new entry to `/srv/blog-posts/index.json` with the same slug and the card metadata you want to show on the homepage.
3. Create `/srv/blog-posts/shipping-small-products.md` with the full Markdown body.
4. Restart the container only if it is not already running. You do not need to rebuild the image for content-only changes.
5. Open `/blog/` to verify the new card appears, then open `/blog/posts/shipping-small-products` to verify the Markdown page loads.

Example manifest entry:

```json
{
  "slug": "shipping-small-products",
  "title": "Shipping small products",
  "excerpt": "Why tighter scope usually leads to better software.",
  "date": "2026-03-07",
  "readingTime": "5 min read",
  "tag": "Engineering"
}
```

Example Markdown file:

```md
# Shipping small products

The fastest way to ship better software is usually to cut scope earlier.

## Why this works

- Smaller releases are easier to review.
- Smaller releases are easier to test.
- Smaller releases are easier to undo.
```

Important details:

- The `slug` in `index.json` must exactly match the Markdown filename without the `.md` extension.
- `index.json` is fetched from `/blog/posts/index.json`.
- Post bodies are fetched from `/blog/posts/<slug>.md`.
- `index.json` is served with `Cache-Control: no-store`, so manifest changes should appear on the next request.
- Markdown files are served with `Cache-Control: public, max-age=300, must-revalidate`, so body updates may take up to five minutes to refresh unless the client revalidates sooner.

### Seed the Named Volume

Create and inspect the volume:

```bash
docker volume create blog_blog_posts
docker run --rm -it -v blog_blog_posts:/posts alpine sh
```

Inside that shell, create `index.json` and one or more `.md` files under `/posts`, then start the app with `docker compose up -d`.

If the container is already running, you can update the same volume in a one-off shell:

```bash
docker run --rm -it -v blog_blog_posts:/posts alpine sh
```

Edit `/posts/index.json` and add `/posts/<slug>.md`, then refresh the site. This updates the content source that `nginx` already exposes at `/blog/posts`.

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
│   ├── lib/             Runtime config and post-fetching helpers
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
- Individual post pages resolved from slug-based routes and loaded from Markdown
- Shared-layout motion between list and detail views
- Persisted theme toggle using `localStorage`
- Theme initialization that respects system color preference
- Route and component coverage with Vitest and React Testing Library
- Tailwind-driven responsive layout and typography

## Development Workflow

The current workflow is intentionally small:

1. Install dependencies with `pnpm install`.
2. Build features in `src/routes`, `src/components`, `src/lib`, `src/theme.tsx`, `src/theme-context.ts`, and `src/index.css`.
3. Run `pnpm lint` and `pnpm test` before committing.
4. Run `pnpm build` to verify the production bundle.

There is no documented branching model in the repository today. The app now expects a Docker-mounted posts directory rather than in-repo post bodies.

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

- route rendering for `/blog/`, `/blog/posts/:slug`, and redirect behavior
- navigation flows between the index and post detail views
- theme toggle behavior and `localStorage` persistence
- post card rendering, runtime config resolution, and route link correctness
