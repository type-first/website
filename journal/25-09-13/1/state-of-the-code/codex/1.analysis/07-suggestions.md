# Suggestions & Notes (from analyses)

This captures suggestions and notes raised during analysis (not judgments; for future triage).

## Non-invasive hygiene (low risk)
- Normalize links to `/article/${slug}` across dialogs/tools/tests (e.g., `components/SearchDialog.tsx:88`, lab pages, SEO tooling).
- Fix Type Explorer starter path mismatch (either adjust path in `app/labs/type-explorer/starter/page.tsx:11` or add the expected folder). Keeps UX predictable.

## Wire-ups to unblock Tier 2 features
- Community API endpoints: add `POST /api/community/posts`, `POST /api/community/posts/[slug]/comments`, `POST /api/community/posts/[slug]/vote` and gate via `auth()`.
- Search compiled content persistence: implement `saveDerivedContent`/`saveSectionEmbeddings` to populate `compiled_articles` (then rerun embeddings generation).
- Align Chat Assistant suggestions with main search backend semantics; add no-OpenAI fallback (text-only) to avoid 503.

## Consolidation candidates (later)
- Choose canonical search backend shape; update clients (Search Dialog, Lab) accordingly.
- Decide on route path convention (`/article` vs `/articles`) and migrate callers.
- Evaluate legacy/alternate stacks for eventual deprecation after Tier 2 stabilizes:
  - `components/ArticleRenderer.tsx`, `lib/article-components.*`, `components/CodeBlock.tsx`/`lib/highlight.ts`, `components/AuthMenuClient.tsx`.

## Housekeeping
- Investigate `scripts/articles.ts` references in `package.json` (add or remove).
- Confirm usage of `components/Providers.tsx:6` and remove if unused.
