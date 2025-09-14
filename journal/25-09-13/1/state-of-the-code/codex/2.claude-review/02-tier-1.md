# Tier 1: Current Keepers

These are the stable, canonical implementations to preserve as the reference pattern.

- Multimodal Article (module-based): `articles/advanced-typescript-patterns-react/*`, `lib/multimodal/v1/*`, route `app/article/advanced-typescript-patterns-react/page.tsx:1`.
- Type Explorer Lab: `app/labs/type-explorer/*`, `components/TypeExplorer.tsx:1` (Monaco multi-file explorer). Note: scenario path mismatch; current code gracefully falls back.
- Articles Listing & Registries: `app/articles/page.tsx:1`, `registry.articles.ts:1`, `lib/articles/registry.ts:1` (+ cover assets under `public/images/covers/*`).
- Labs Listing & Registry: `app/labs/page.tsx:1`, `registry.labs.tsx:1`.
- Layout & Navigation: `app/layout.tsx:57`, `components/NavSidebar.tsx:1`, `components/MobileTopBar.tsx:1`, `components/SearchBarLauncher.tsx:1`, `components/ChatSidebar.tsx:1`, `components/Breadcrumbs.tsx:1`.
- Auth Infrastructure & UI: `auth.ts:1`, `app/api/auth/[...nextauth]/route.ts:1`, plus UI in `components/AuthProvider.tsx:1`, `components/AuthMenu.tsx:1`, `components/RequireAuthButton.tsx:1`, popup flow pages and `public/auth/*`.
