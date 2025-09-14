# Architecture & Layout

Goals
- Clarify responsibilities and directory layout.
- Keep article authoring modular and semantic; keep labs independent; keep layout/auth simple and reliable.
- Reduce duplication while retaining optionality for future expansion.

Recommended top‑level domains (unchanged in substance, clarified in purpose)
- `articles/` — Module-based articles (per-article folder).
- `lib/multimodal/v1/` — Canonical article component system (server-first, markdown export path).
- `app/article/[slug]/` — Article routes (one page per module article).
- `app/articles/` — Articles listing (registry-backed browsing).
- `registry.articles.ts` — Canonical registry for browse/SEO card data.
- `app/labs/` — Labs entry pages (Type Explorer, others). Keep labs independent from article stack.
- `components/` — Cross-feature components (Auth, Nav, Search dialog, Chat, Islands, TypeExplorer).
- `lib/` — Shared libs (db, search, derivation, json-ld, code themes, utils, islands registry).

Separation of responsibilities
- Article authoring: multimodal components (rendering, markdown generation), per-article composition.
- Browsing: registry + list pages + card UIs; no heavy logic here.
- Search: one backend surface + route handlers; result shapes consistent.
- Community: UI pages + API routes + db access; auth-gated writes.
- Chat: UI + API; leverages same search semantics; optional OpenAI fallback.
- Labs: self-contained experiences; do not bleed into article authoring logic.

Folder hygiene proposals
- Add `lib/search/canonical.ts` (or repurpose `lib/search/index.ts`) as the single exported shape; deprecate alternates.
- Add `lib/content/compiled.ts` with concrete upsert helpers for `compiled_articles` (called by derivation pipeline).
- Add `lib/routes.ts` with helpers: `linkToArticle(slug) => '/article/' + slug` (centralize canonical links).

Dependency directions (high level)
- UI pages depend on registries/libs; not vice‑versa.
- Article modules depend on multimodal components; not vice‑versa.
- Search routes depend on `lib/search/*`; not on UI.
- Derivation depends on schema types + db helpers; not on UI.

Outcomes
- Predictable structure for new features.
- Cleaner imports and fewer circular dependencies.
- Easier consolidation choices later (search, article renderers).
