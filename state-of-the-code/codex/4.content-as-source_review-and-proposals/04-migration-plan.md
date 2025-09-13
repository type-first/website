# Migration Plan (Content-as-Source)

Phase 1 — Scaffolding
- Create `content/` with subfolders: `articles/`, `contributors/`, `terminology/`, `labs/`.
- Add `lib/routes.ts` helper; update callers progressively.

Phase 2 — Articles relocation
- Move `articles/advanced-typescript-patterns-react/*` → `content/articles/advanced-typescript-patterns-react/*`.
- Update `app/article/advanced-typescript-patterns-react/page.tsx` imports to new path.
- Verify markdown generation script against new location.

Phase 3 — Lab catalog + contributors/terminology
- Add initial `content/labs/<slug>.tsx` entries mirroring `registry.labs.tsx`.
- Add placeholder `content/contributors/*` and `content/terminology/*` per author’s plan.

Phase 4 — Derivation and compiled data
- Implement upserts in `lib/db/articles.ts` for compiled content and embeddings.
- Run embeddings script; verify search routes work with compiled data.

Phase 5 — Cleanup & docs
- Update `registry.articles.ts` comments to note content-as-source and possible future generation.
- Add short ADR: Content-as-Source is canonical; DB for UGC + derived artifacts.
