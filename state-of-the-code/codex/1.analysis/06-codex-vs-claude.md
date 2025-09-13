# Codex vs Claude — Comparison

Summary of agreements, discrepancies, new ideas, and misses.

## Agreements
- Multimodal article (`lib/multimodal/v1/*`) and the advanced article module are the current pattern.
- Type Explorer is a working, separate lab (article links via `CodeExplore`).
- Alternates/duplicates exist across article rendering, code highlighting, search, and auth menu variants.
- Useful dev/SEO tools identified (metadata inspector, SEO test, markdown generator).

## Discrepancies
- Islands “unused” assertion:
  - Claude implies islands are registered but unused; however, they are used in fixtures/tests (`lib/db/fixtures/articles.yaml:1`, `plays/islands.test.ts:1`) and enabled via `lib/islands/setup.ts:1`. They are not used by the multimodal article, but the system is exercised.
- Derivation pipeline “unused”:
  - `lib/content/derivation.ts:15` is used by `lib/db/scripts/generate-embeddings.ts:1` to populate compiled content/embeddings.
- “No component duplication found” contradicts observed alternates (renderer, highlighter, search backends, search-test pages).
- `highlight.ts` labeled “essential” — it’s a placeholder helper used by legacy paths, not by the current multimodal pattern.

## New Ideas From Claude
- Called out additional pages/tools for tracking: metadata inspector, SEO test, static auth pages in `public/auth/*`.
- Noted dev/testing features mixed into main app (useful for future scoping decisions).

## Missed Items
- Route path inconsistency: `/article/<slug>` vs `/articles/<slug>` across UI/tools/APIs.
- Missing community API routes (forms post to non-existent handlers).
- Search backend duplication and shape differences (`lib/search.ts:1` vs `lib/search/index.ts:1`).
- Compiled content save functions are stubs; search depends on `compiled_articles` being populated.
- Type Explorer scenario path mismatch (starter vs scenarios path).
- Package script references missing `scripts/articles.ts`.
- Potentially unused `components/Providers.tsx:6`.

## Bottom Line
- Claude’s high-level mapping is directionally sound and adds helpful context on dev tools. Some usage details (islands/derivation) and wiring gaps (routes, persistence, paths) were understated or missed.
