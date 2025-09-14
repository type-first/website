# Tier 2: Keep UI, Fix Functionality

UI/UX should be preserved while functionality is completed/refined.

## Community
- Pages/forms: `app/community/*`, `components/community/*`.
- Needs: add API routes (`POST /api/community/posts`, `POST /api/community/posts/[slug]/comments`, voting), enforce `auth()` on writes, handle DB-not-configured with friendly 503.

## Search (Top-Right Dialog)
- UI: `components/SearchDialog.tsx:1` (+ launcher).
- Needs: canonicalize links to `/article/${slug}`, add parameter validation and consistent error formats, provide graceful fallback without compiled DB.

## Search Testing Lab
- UI: `app/labs/search-test/*` (and duplicate at `app/search-test/page.tsx:1`).
- Needs: reconcile response shape mismatch (flatten results in client or offer lab endpoint), enable vector-only path by embedding generation or documented limitation, decide on single “test lab” surface.

## Chat Assistant
- UI/API: `components/ChatSidebar.tsx:1`, `app/api/chat/route.ts:1`.
- Needs: align suggestions with main search backend semantics, canonicalize article links, provide text-only fallback when `OPENAI_API_KEY` is absent.
