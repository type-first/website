# Community Backend Plan

Scope
- Preserve UI; add the missing backend.

Endpoints (Next.js App Router)
- `POST /api/community/posts` — create post
  - Auth required; body: `{ title, body }`; returns `{ slug }`.
- `POST /api/community/posts/[slug]/comments` — add comment
  - Auth required; body: `{ body }`.
- `POST /api/community/posts/[slug]/vote` — vote up/down
  - Auth required; body: `{ dir: 1 | -1 }`; server clamps and sums.

DB integration
- Use existing schema `community_posts` / `community_comments` (002 migration).
- Implement helpers in `lib/db/community.ts` to back endpoints.
- Handle DB-off gracefully (503 JSON with helpful message); keep demo data for reads.

Validation & errors
- Validate length and emptiness server-side (not just in UI).
- Consistent error responses `{ error, detail? }`.

Security
- Use `auth()` per request; do not trust client-provided identities.

Testing
- Add minimal route tests (happy path + auth failure + db-off fallback).
