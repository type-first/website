# Roadmap Outline (Pragmatic Order)

1) Hygiene (links + paths)
- Standardize `/article/<slug>` in Search Dialog, Chat, labs, SEO tools.
- Align Type Explorer starter path or add the expected folder.

2) Unblock Tier 2
- Community API endpoints (create post, comment, vote) with `auth()`.
- Implement compiled content upserts; run embeddings script.
- Search Dialog param validation + consistent error shape + DB fallback.
- Chat Assistant: unify backend + text-only fallback.

3) Consolidation
- Choose canonical search backend shape (and doc it); migrate clients.
- Keep one “search test” surface.
- Decide fate of schema-based ArticleRenderer (derivation-only vs retire).

4) Cleanup
- Remove unused alternates once safely replaced.
- Fix `package.json` script referencing missing `scripts/articles.ts`.
- Confirm/remove unused helpers (e.g., `components/Providers.tsx`).

5) Documentation
- Add short ADRs for: multimodal as canonical, link path convention, search backend shape, community API contract, compiled content pipeline.
