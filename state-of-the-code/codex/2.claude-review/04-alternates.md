# Alternates & Duplications

Parallel approaches identified (to be reconciled deliberately, not immediately removed).

- Article stacks:
  - Multimodal (current, module-based): `lib/multimodal/v1/*`.
  - Schema-based renderer: `components/ArticleRenderer.tsx:11` (+ `lib/schemas/article.ts:1`, `lib/content/derivation.ts:15`).
  - Legacy components: `lib/article-components.tsx:1`, `lib/article-components.ts:1` (used by `lib/content/example-article.tsx:1`).
- Code highlighting:
  - SSR Shiki via multimodal `Code`.
  - Client fallback: `components/CodeBlock.tsx:1` + `lib/highlight.ts:1`.
- Search backends:
  - `lib/search.ts:1` (used by `/api/search/*`).
  - `lib/search/index.ts:1` (richer, currently unused by routes).
- Auth menus:
  - Current: `components/AuthMenu.tsx:1` (+ `AuthProvider.tsx`).
  - Alternate: `components/AuthMenuClient.tsx:9`.
- Duplicate “search test” surfaces:
  - `app/labs/search-test/page.tsx:1` vs `app/search-test/page.tsx:1`.
- Islands:
  - Registry/setup present; used by fixtures/tests; not used by the current multimodal article.
