# Tier 1: Current Keepers (Active, Canonical)

These features/patterns are current, working, and represent the preferred approach.

## Multimodal Article Pattern
- Advanced Article (route): `app/article/advanced-typescript-patterns-react/page.tsx:1`
- Article module (semantic composition + markdown mode): `articles/advanced-typescript-patterns-react/article.tsx:7`
- Sections + snippets: `articles/advanced-typescript-patterns-react/section.*.tsx`, `.../snippet.*.tsx`
- Multimodal library used: `lib/multimodal/v1/*`
  - Core: `lib/multimodal/v1/multimodal.model.ts:12`, `lib/multimodal/v1/render.ts:1`, `lib/multimodal/v1/markdown-utils.ts:1`
  - Components: `article.mm.srv.tsx`, `header.mm.srv.tsx`, `navigation.mm.srv.tsx`, `link.mm.srv.tsx`, `cover-image.mm.srv.tsx`, `article-header.mm.srv.tsx`, `article-metadata.mm.srv.tsx`, `heading.mm.srv.tsx`, `paragraph.mm.srv.tsx`, `section.mm.srv.tsx`, `list.mm.srv.tsx`, `code.mm.srv.tsx`, `footer.mm.srv.tsx`, `container.mm.srv.tsx`, `text.mm.srv.tsx`, `strong.mm.srv.tsx`, `tags-list.mm.srv.tsx`, `code-explore.mm.srv.tsx`

## Type Explorer (Lab)
- Redirect + starter route: `app/labs/type-explorer/page.tsx:1`, `app/labs/type-explorer/starter/page.tsx:1`
- Editor: `components/TypeExplorer.tsx:1`
- Note: Scenario path mismatch (graceful fallback): `app/labs/type-explorer/starter/page.tsx:11`

## Articles Listing & Registry
- Articles index page: `app/articles/page.tsx:1`
- Registry: `registry.articles.ts:1`, wrapper `lib/articles/registry.ts:1`
- Cover images: `public/images/covers/*`

## Labs Listing
- Labs index page: `app/labs/page.tsx:1`
- Registry: `registry.labs.tsx:1`

## Layout & Navigation
- Root layout: `app/layout.tsx:57`
- Sidebar/top bars/search/chat: `components/NavSidebar.tsx:1`, `components/MobileTopBar.tsx:1`, `components/SearchBarLauncher.tsx:1`, `components/ChatSidebar.tsx:1`, `components/Breadcrumbs.tsx:1`

## Auth (Infrastructure + UI)
- NextAuth config + API routes: `auth.ts:1`, `app/api/auth/[...nextauth]/route.ts:1`
- UI helpers: `components/AuthProvider.tsx:1`, `components/AuthMenu.tsx:1`, `components/AuthPopupButtons.tsx:1`, `components/RequireAuthButton.tsx:1`, `components/AuthWrapper.tsx:1`
- Popup flow: `public/auth/start-github.html:1`, `public/auth/complete.html:1`, `app/auth/start/[provider]/page.tsx:1`, `app/auth/popup-complete/page.tsx:1`
