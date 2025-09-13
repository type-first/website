# Comprehensive Inventory (Mapped Areas)

Organized list of features/files we’ve examined (non-exhaustive but broad coverage).

## Articles & Authoring
- Multimodal article stack: `articles/advanced-typescript-patterns-react/*`, `lib/multimodal/v1/*`
- Article route: `app/article/advanced-typescript-patterns-react/page.tsx:1`
- Markdown generation script: `scripts/generate-markdown.ts:1`

## Articles Listing
- Page: `app/articles/page.tsx:1`
- Registry: `registry.articles.ts:1`, `lib/articles/registry.ts:1`
- Cover images: `public/images/covers/*`

## Labs
- Labs index: `app/labs/page.tsx:1`, registry `registry.labs.tsx:1`
- Type Explorer: `app/labs/type-explorer/page.tsx:1`, `app/labs/type-explorer/starter/page.tsx:1`, `components/TypeExplorer.tsx:1`, starter files under `app/labs/type-explorer/starter/src/*`

## Layout & Navigation
- Root layout: `app/layout.tsx:57`
- Sidebar/top bars/search/chat: `components/NavSidebar.tsx:1`, `components/MobileTopBar.tsx:1`, `components/SearchBarLauncher.tsx:1`, `components/ChatSidebar.tsx:1`, `components/Breadcrumbs.tsx:1`

## Auth
- Config + API: `auth.ts:1`, `app/api/auth/[...nextauth]/route.ts:1`
- UI: `components/AuthProvider.tsx:1`, `components/AuthMenu.tsx:1`, `components/AuthPopupButtons.tsx:1`, `components/RequireAuthButton.tsx:1`, `components/AuthWrapper.tsx:1`, `components/AuthMenuClient.tsx:9`
- Popup pages: `app/auth/start/[provider]/page.tsx:1`, `app/auth/popup-complete/page.tsx:1`, static `public/auth/*`

## Search
- UI: `components/SearchDialog.tsx:1`, launcher `components/SearchBarLauncher.tsx:1`
- API routes: `app/api/search/text/route.ts:1`, `app/api/search/hybrid/route.ts:1`
- Backends: `lib/search.ts:1`, `lib/search/index.ts:1`

## Community
- Pages: `app/community/page.tsx:1`, `app/community/[id]/page.tsx:1`, `app/community/new/page.tsx:1`
- Forms: `components/community/NewPostForm.tsx:1`, `components/community/CommentForm.tsx:1`
- DB + migrations: `lib/db/community.ts:1`, `lib/db/migrations/002_community.sql:8`

## Content Pipeline & Compiled Articles
- Schema: `lib/schemas/article.ts:1`
- Derivation pipeline: `lib/content/derivation.ts:15`
- Compiled table: `lib/db/migrations/003_compiled_articles.sql:1`
- DB helpers (stubs): `lib/db/articles.ts:53`, `:58`

## Islands
- Registry + setup: `lib/islands/registry.tsx:1`, `lib/islands/setup.ts:1`
- Client islands: `components/islands/Counter.tsx:1`, `components/islands/InteractiveChart.tsx:1`, `components/islands/CodePlayground.tsx:1`
- Fixtures/tests involving islands: `lib/db/fixtures/articles.yaml:1`, `plays/islands.test.ts:1`

## Misc Utilities & Assets
- Code themes: `lib/codeTheme.ts:1`, `lib/themes/shiki-typefirst-light.json:1`
- Static assets: `public/*.svg`, icons and auth pages
- Next config: `next.config.ts:1`

## Testing/Tools
- Playwright tests: `plays/basic.test.ts:1`, `plays/islands.test.ts:1`
- SEO tools: `app/seo-test/page.tsx:1`, `scripts/test-seo.sh:1`
- Metadata inspector: `app/metadata-inspector/page.tsx:1`

