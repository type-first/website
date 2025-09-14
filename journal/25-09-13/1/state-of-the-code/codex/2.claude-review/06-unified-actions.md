# Unified Recommendations & Plan

A pragmatic order that tightens functionality while preserving UI.

## Phase 1 — Non-invasive hygiene
- Canonicalize article links to `/article/${slug}` in Search Dialog, Chat suggestions, search labs, SEO tooling.
- Type Explorer: either align path or create the expected `scenarios/starter/src` folder for predictability.

## Phase 2 — Unblock Tier 2 features
- Community API: implement `POST /api/community/posts`, `POST /api/community/posts/[slug]/comments`, and a vote endpoint; enforce `auth()`; friendly DB-off errors.
- Compiled content persistence: implement `saveDerivedContent`/`saveSectionEmbeddings` to upsert into `compiled_articles`; then run embeddings script.
- Search Dialog: add param validation and consistent error shape; provide “DB not available” fallback.
- Chat Assistant: unify suggestion sourcing with main search backend; provide text-only fallback without API key.

## Phase 3 — Consolidation choices
- Choose canonical search backend shape and migrate callers (Search Dialog, labs).
- Decide on a single “search test” surface (labs vs top-level) and remove the other.
- Decide on keeping schema-based ArticleRenderer solely for derivation/search vs retiring it.

## Phase 4 — De-risked cleanup
- Remove unused variants once migrations complete: `AuthMenuClient`, legacy `article-components.*`, `CodeBlock.tsx`/`lib/highlight.ts` if fully superseded.
- Remove or fix `scripts/articles.ts` reference.

## Notes
- Islands remain valuable via fixtures/tests; not used by the multimodal article today but shouldn’t be removed prematurely.
