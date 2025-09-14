# Gaps, Issues & Inconsistencies

- Missing community API routes: forms call `/api/community/posts` and `/api/community/posts/[slug]/comments` but no handlers exist.
- Compiled content persistence: `saveDerivedContent` / `saveSectionEmbeddings` are stubs; `compiled_articles` is present and search depends on it.
- Type Explorer scenario path mismatch: looks for `/labs/type-explorer/scenarios/starter/src` but repo has `/labs/type-explorer/starter/src`.
- Route path inconsistency: `/article/${slug}` vs `/articles/${slug}` in several UIs/APIs/tools.
- Search backends divergence: `lib/search.ts` vs `lib/search/index.ts` response shapes and usage.
- Package script references missing `scripts/articles.ts`.
- Possibly unused helper: `components/Providers.tsx:6`.
- Tests/docs drift: Playwright/tests reference routes/slugs not aligned with current article routing.
