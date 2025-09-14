# Alternates & Duplications

Documented parallel approaches and duplications (no judgment yet).

## Article Rendering Stacks
- Multimodal (module-based; current article): `lib/multimodal/v1/*`, `articles/advanced-typescript-patterns-react/*`
- Schema-based renderer (alternate): `components/ArticleRenderer.tsx:11` (+ `lib/schemas/article.ts:1`, `lib/content/derivation.ts:15`)
- Legacy/simple article components: `lib/article-components.tsx:1`, `lib/article-components.ts:1` (used by `lib/content/example-article.tsx:1`)

## Code Highlighting
- Multimodal SSR + Shiki: `lib/multimodal/v1/code.mm.srv.tsx:59`, theme `lib/codeTheme.ts:1`
- Client-side simple highlighter: `components/CodeBlock.tsx:1` + `lib/highlight.ts:1`

## Search Backends & UIs
- API backend A (flat results): `lib/search.ts:1` (used in `/api/search/*`)
- API backend B (article-aware): `lib/search/index.ts:1` (not imported by routes)
- Duplicate “search test” pages: `app/labs/search-test/page.tsx:1` and `app/search-test/page.tsx:1`

## Auth UI Variants
- Current: `components/AuthMenu.tsx:1` (+ `AuthProvider.tsx`)
- Alternate variant: `components/AuthMenuClient.tsx:9` (not referenced)

## Islands Usage
- Registry + setup present: `lib/islands/registry.tsx:1`, `lib/islands/setup.ts:1`
- Used by schema-based content/tests (e.g., fixtures `lib/db/fixtures/articles.yaml:74, 122`, tests `plays/islands.test.ts:5, 22, 57`)
- Not used by the current multimodal article.

## Route Path Style
- Mixed usage of `/article/${slug}` vs `/articles/${slug}` across pages, dialogs, tools.
