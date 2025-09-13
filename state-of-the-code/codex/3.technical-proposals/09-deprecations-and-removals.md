# Deprecations & Removals (Staged)

Stage A (after migrations complete)
- `components/AuthMenuClient.tsx` — remove if no live usage.
- `lib/article-components.tsx` / `lib/article-components.ts` / `lib/content/example-article.tsx` — move to `legacy/` or remove if no docs depend.
- `components/CodeBlock.tsx` / `lib/highlight.ts` — remove if all articles use multimodal `Code`.

Stage B (after search consolidation)
- Duplicate search-test surface — keep labs version; remove `app/search-test/page.tsx`.
- Any alternate search helpers superseded by canonical `lib/search/index.ts`.

Stage C (evaluate, not immediate)
- `components/ArticleRenderer.tsx` — retain only for derivation testing; remove if derivation pipeline does not rely on it.
