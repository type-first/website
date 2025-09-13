# Articles & Multimodal

Keep
- Multimodal v1 components as canonical authoring/rendering system.
- Advanced article as reference implementation (`articles/advanced-typescript-patterns-react/*`).

Improve
- Consistency: pass `modality` prop uniformly (avoid `modality={null}` anomalies).
- Markdown export: document `scripts/generate-markdown.ts` usage; ensure components generate clean markdown via `renderToMarkdown`.
- SEO: Prefer `JsonLd` components within articles; centralize site config in one place.

Consolidate
- Legacy `lib/article-components*.tsx` and `lib/content/example-article.tsx`: move to `legacy/` (or mark deprecated). Keep only if useful for docs/examples.
- Schema-based `components/ArticleRenderer.tsx`: retain for DB derivation use cases only (not for canonical rendering). Make that intent explicit in file header.

Compiled Content Pipeline (for search)
- Implement concrete upserts in db helpers:
  - `saveDerivedContent(articleId, content)` → upsert into `compiled_articles` (markdown/plain_text/outline/metadata/reading_time/word_count, timestamps).
  - `saveSectionEmbeddings(articleId, embeddings)` → optional section-level embeddings or aggregate article embedding.
- Derivation ownership: `lib/content/derivation.ts` calls new upsert helpers; Embeddings script remains the batch job.

Future‑proofing (no new features added)
- Prepare for article variants by preserving multimodal’s markdown mode.
- Keep code highlighting server-side (Shiki) to avoid CLS and client cost.
