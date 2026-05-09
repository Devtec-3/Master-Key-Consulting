# Master Key Consulting

Professional business website for Master Key Consulting — a geophysical and engineering services firm based in Ilorin, Nigeria.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at /api)
- `pnpm --filter @workspace/master-key run dev` — run the frontend (port via $PORT, proxied at /)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `SESSION_SECRET` — session signing secret
- Optional env: `ADMIN_PASSWORD` — overrides default admin password (default: `masterkey2025`)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + shadcn/ui + Framer Motion
- API: Express 5 + express-session (admin auth)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/master-key/` — React+Vite frontend
- `artifacts/api-server/` — Express API server
- `lib/db/src/schema/` — Drizzle ORM schema (4 tables: reviews, projects, blog_posts, bookings)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contract)
- `lib/api-client-react/src/generated/api.ts` — Generated React Query hooks
- `artifacts/api-server/src/routes/` — All route handlers

## Architecture decisions

- Contract-first API: OpenAPI spec drives all client/server contracts via Orval codegen
- Session-based admin auth (no JWT) — single-password, stored in `ADMIN_PASSWORD` env var
- All public pages are pre-seeded with real sample data for demonstration
- Brand: red (#CC0000), gold (#C9A84C / `accent`), black (#0A0A0A) — consistent across all pages
- Reviews require admin approval before appearing publicly

## Product

- **Homepage**: Hero, stats bar, services preview, why choose us, featured projects, testimonials, CTA, blog preview
- **Services** (`/services`): Full detail on all 6 services with FAQ accordion
- **Portfolio** (`/portfolio`): Filterable project grid with detail modal
- **Reviews** (`/reviews`): Approved reviews + public review submission form
- **Blog** (`/blog`, `/blog/:slug`): Articles with search, tags, share buttons
- **Booking** (`/booking`): Full booking form stored in DB, pre-fills from service links
- **Contact** (`/contact`): Contact form + embedded map + WhatsApp link
- **Admin panel** (`/admin`): Dashboard with stats, bookings management, projects CRUD, blog CRUD, reviews approval
- WhatsApp floating button on all public pages

## User preferences

- No Firebase — use Replit PostgreSQL + Drizzle ORM
- Brand colors: red (#CC0000), gold (#C9A84C), black (#0A0A0A)
- Admin password: `masterkey2025` (default)

## Gotchas

- Admin auth uses express-session; ensure SESSION_SECRET env is set in production
- Blog slugs are auto-generated from title on the server (slugify)
- The `pt-[80px]` on PublicLayout main accounts for the fixed navbar height
- CORS is set to `origin: true` for development; restrict in production if needed

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
