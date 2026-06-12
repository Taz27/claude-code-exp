# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
bun dev          # dev server (Turbopack, default in Next.js 16)
bun build        # production build
bun start        # production server
bun lint         # ESLint via eslint CLI (not next lint)
```

No test runner is configured yet.

## Project Overview

A rich-text note-taking app. Users can create, edit, delete, and publicly share notes via a unique slug URL. See `SPEC.MD` for the full spec.

**Stack:** Next.js 16 (App Router) · Bun runtime · React 19 · TailwindCSS v4 · better-auth · TipTap (rich text) · SQLite via Bun's native `bun:sqlite`

## Architecture

```
app/
  layout.tsx              # root layout (Geist fonts)
  page.tsx                # landing page
  (auth)/login            # login page (better-auth)
  (auth)/register         # register page (better-auth)
  dashboard/              # authenticated note list
  notes/[id]/             # note editor (TipTap, title, share toggle, delete)
  p/[slug]/               # public read-only note view
  api/
    auth/[...all]/        # better-auth route handler
    notes/
      route.ts            # GET list, POST create
      [id]/route.ts       # GET, PUT, DELETE single note
      [id]/share/route.ts # POST toggle public sharing
    public-notes/[slug]/  # GET public note (or handled directly in /p/[slug])
lib/
  db.ts                   # Bun SQLite singleton + query/get/run helpers
  notes.ts                # note repository functions (all scoped to user_id)
  auth.ts                 # better-auth server config
data/
  app.db                  # SQLite database file (gitignored)
```

**Data flow:** Server Components fetch directly from `lib/notes.ts` → DB. Route Handlers in `app/api/` serve the JSON API for client-side mutations (create, update, delete, share). TipTap content is stored as `JSON.stringify(editor.getJSON())` and parsed on load.

## Next.js 16 Breaking Changes

> Next.js 16 has breaking changes vs. what most training data knows. Read `node_modules/next/dist/docs/` before writing any Next.js-specific code.

Key differences from Next.js 14/15:

- **Async Request APIs are fully async — no sync fallback.** Always `await` these:
  ```ts
  const cookieStore = await cookies()
  const headersList = await headers()
  const { slug } = await params   // params in page/layout/route props
  ```
- **`middleware.ts` → `proxy.ts`.** The file must be named `proxy.ts` and export a function named `proxy` (not `middleware`). The edge runtime is not supported in `proxy`; use Node.js runtime only.
- **`skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize`** in `next.config.ts`.
- **Turbopack is the default** bundler for both `next dev` and `next build`.
- **`revalidateTag` requires a second argument** (a `cacheLife` profile).

## TailwindCSS v4

This project uses Tailwind v4, configured via `postcss.config.mjs` (`@tailwindcss/postcss`). There is no `tailwind.config.ts` — customization goes in `app/globals.css` using CSS variables and `@theme`.

## Database

SQLite accessed via Bun's native `bun:sqlite` (not `better-sqlite3`). The DB file lives at `data/app.db`. Schema is in `SPEC.MD` §5. Initialize the DB and run migrations in `scripts/init-db.ts` or equivalent.

```ts
import { Database } from 'bun:sqlite'
const db = new Database('data/app.db', { create: true })
```

## Auth

better-auth handles session management. The server config (`lib/auth.ts`) exports `auth`; use `auth.api.getSession({ headers: await headers() })` in Server Components and Route Handlers to get the current user. All note API routes must return 401 when no valid session exists.
