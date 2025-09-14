# Proposed Structure & Moves

1) Introduce `content/` at repo root (source-as-source)
- `content/articles/<slug>/*` — multimodal article modules (what lives in `articles/` today)
- `content/contributors/<id>.tsx` — profiles as multimodal components (bio, links, authored articles)
- `content/terminology/<term>.tsx` — brand concepts/definitions (multimodal)
- `content/labs/<slug>.tsx` — catalog entries linking to `/labs/<slug>` with metadata for SEO/OG

2) Keep platform vs content cleanly separated
- `app/` continues to host page routes, navigation, and platform-level composition.
- `lib/` remains home for multimodal primitives, json-ld model helpers, search, derivation, db, islands registry, etc.

3) Centralize article linking
- Add `lib/routes.ts`: `export const linkToArticle = (slug: string) => '/article/' + encodeURIComponent(slug);`
- Replace inline strings across Search Dialog, labs, SEO tooling, chat suggestions.

4) Preserve current routes while relocating source
- Continue serving article pages from `app/article/<slug>/page.tsx`.
- Article page imports move from `@/articles/...` to `@/content/articles/...`.
- Optionally add redirect from `/articles/<slug>` → `/article/<slug>`.

5) Derived data pipeline
- Implement concrete upserts in `lib/db/articles.ts` for `compiled_articles` when derivation runs.
- Keep embeddings script as-is, now reflecting content-as-source location.

6) Registries
- `registry.articles.ts` continues, but may be partially generated from `content/articles` metadata in the future.
- Add `content/labs` to a labs registry (or map to existing `registry.labs.tsx`).
