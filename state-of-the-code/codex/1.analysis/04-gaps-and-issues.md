# Gaps, Issues & Inconsistencies

Known wiring gaps, inconsistencies, and missing pieces observed.

## Community API Endpoints
- Forms call endpoints that don’t exist:
  - `POST /api/community/posts` (see `components/community/NewPostForm.tsx:21`)
  - `POST /api/community/posts/[slug]/comments` (see `components/community/CommentForm.tsx:17`)
- No vote endpoints; UI shows vote controls.

## Compiled Content Persistence
- `lib/db/articles.ts:53` `saveDerivedContent` and `:58` `saveSectionEmbeddings` are placeholders; compiled search depends on `compiled_articles` (`lib/db/migrations/003_compiled_articles.sql:1`).

## Type Explorer Scenario Path
- `app/labs/type-explorer/starter/page.tsx:11` expects `/labs/type-explorer/scenarios/starter/src`, but repo has `/labs/type-explorer/starter/src`. Falls back to default files.

## Route Path Inconsistency
- Mixed `/article/${slug}` vs `/articles/${slug}` across:
  - `components/SearchDialog.tsx:88`, `app/labs/search-test/search-test-client.tsx:148`, `app/search-test/page.tsx:240`, `app/seo-test/page.tsx:24`, `app/metadata-inspector/page.tsx:68`

## Search Backends Divergence
- Routes rely on `lib/search.ts:1`; richer `lib/search/index.ts:1` exists but unused; result shapes differ from lab clients.

## Package Script Reference
- `package.json:20–23` references `scripts/articles.ts` which isn’t present.

## Potentially Unused Helpers
- `components/Providers.tsx:6` not referenced.

## Tests/Docs Drift
- Playwright tests and scripts reference paths/slugs that may not exist in current modular article routing.
