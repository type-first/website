# Search Consolidation

Objective
- Present one canonical search backend with a consistent response shape consumed by:
  - Search Dialog (top-right)
  - Chat Assistant suggestions
  - Search Testing Lab

Proposals
- Canonical backend: adopt `lib/search/index.ts` (richer, article-aware) or refactor `lib/search.ts` to that shape. Export a single public API (e.g., `searchArticlesByText`, `searchArticlesByVector`, `searchArticlesHybrid`).
- Response shape: standardize on `{ article, snippet, score, matchType }` to keep metadata attached and future-proof.
- Parameter validation: enforce sane `limit`, non-empty query, and consistent error payloads in `/api/search/*` routes.
- Fallbacks:
  - If `compiled_articles` is absent or DB off: return `[]` with `{ ok: false, reason: 'db_unavailable' }` metadata (or HTTP 503) rather than 500.
  - If `OPENAI_API_KEY` missing: hybrid falls back to text-only with a flag `hasEmbedding: false`.
- Snippet consistency: always return HTML-safe snippets. When client renders, escape if not already escaped.

Chat alignment
- Chat API should reuse `searchArticlesByText/Hybrid` for suggestions to avoid a parallel search path. Keep text-only fallback.

Lab alignment
- Lab client should adapt to canonical shape (no custom flattening), or expose a lab-only endpoint that returns the canonical shape unchanged.

Migration steps
- Implement canonical export in `lib/search/index.ts`.
- Update `/api/search/text`, `/api/search/hybrid` to use it.
- Update `components/SearchDialog.tsx` and lab clients to the unified shape.
- Update Chat route to reuse canonical search helpers.
