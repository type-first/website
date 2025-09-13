# Tier 2: Keep UI, Needs Functional Work

These features have solid UI/UX patterns but require functional work or wiring.

## Community
- Pages: `app/community/page.tsx:1`, `app/community/[id]/page.tsx:1`, `app/community/new/page.tsx:1`
- Forms: `components/community/NewPostForm.tsx:1`, `components/community/CommentForm.tsx:1`
- DB layer + demo fallback: `lib/db/community.ts:1`, `lib/community/data.ts:1`
- Migrations: `lib/db/migrations/002_community.sql:8`
- Observed gaps:
  - Missing API routes invoked by forms: `POST /api/community/posts`, `POST /api/community/posts/[slug]/comments` (no `app/api/community/...` handlers).
  - Voting UI present but no endpoints.
  - Auth enforcement for writes (should reuse `auth()` in routes).

## Search (Top-Right Dialog)
- UI: `components/SearchDialog.tsx:1`, launcher `components/SearchBarLauncher.tsx:1`
- APIs: `app/api/search/text/route.ts:1`, `app/api/search/hybrid/route.ts:1`
- Backends: `lib/search.ts:1` (flat results), `lib/search/index.ts:1` (article-aware, richer)
- Observed gaps:
  - Link path inconsistency: uses `/articles/${slug}` vs canonical `/article/${slug}` elsewhere.
  - DB and compiled content dependency; needs graceful fallback without DB.
  - Parameter validation (limits, errors) to align with tests.

## Search Testing Lab
- Pages: `app/labs/search-test/page.tsx:1`, client `app/labs/search-test/search-test-client.tsx:1`
- Observed gaps:
  - Expects flattened result shape while APIs return `{ article, snippet, ... }` (normalize client or add lab endpoint).
  - Vector-only mode blocked; requires embedding generation or hybrid path.
  - Duplicate “search-test” also exists at `app/search-test/page.tsx:1` with overlapping purpose.

## Chat Assistant
- UI: `components/ChatSidebar.tsx:1`, controls `components/chatControls.ts:1`
- API route: `app/api/chat/route.ts:1`
- Observed gaps:
  - Suggestion source uses DB/string/vector paths distinct from the main search backend; consider aligning with `lib/search/index.ts:1` semantics.
  - Link path inconsistency: suggestions use `/articles/${slug}`; consider canonicalization.
  - No-OpenAI fallback currently returns 503; may want a text-only fallback mode.
