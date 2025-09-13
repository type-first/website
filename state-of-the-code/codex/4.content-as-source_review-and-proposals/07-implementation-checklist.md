# Implementation Checklist

Scaffold
- [ ] Create `content/` with subfolders.
- [ ] Add `lib/routes.ts` with `linkToArticle` helper.

Pilot move
- [ ] Move `advanced-typescript-patterns-react` to `content/articles/...`.
- [ ] Update its route imports.
- [ ] Verify markdown export still works.

Derived data
- [ ] Implement compiled upserts in `lib/db/articles.ts`.
- [ ] Run embeddings script and verify search/hybrid.

Catalogs
- [ ] Seed `content/labs` entries (mirror existing registry).
- [ ] Add initial `content/contributors` and `content/terminology` placeholders.

Hygiene
- [ ] Replace hard-coded `/articles/<slug>` with `linkToArticle`.
- [ ] Add optional redirect route from `/articles/<slug>`.

Docs
- [ ] Add ADR: Content-as-Source is canonical; DB for UGC + derived artifacts.
