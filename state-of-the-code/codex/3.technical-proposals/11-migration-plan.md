# Migration Plan

Phase 1: Hygiene (low risk)
- Canonicalize `/article/<slug>` links across UI/tests/tools.
- Align Type Explorer starter path or add the expected folder.

Phase 2: Unblock Tier 2
- Implement community API endpoints with auth and friendly DB-off behavior.
- Implement compiled content upserts and run embeddings script.
- Update search routes to canonical backend + param validation + fallback.
- Update Chat to reuse canonical search and add text-only fallback.

Phase 3: Consolidation
- Choose search backend shape; migrate Dialog + labs + chat.
- Keep one search-test surface.
- Decide schema-based renderer’s scope.

Phase 4: Cleanup
- Remove deprecated alternates after verifying no references.
- Fix `package.json` scripts.

Phase 5: Documentation
- Add ADRs and update README sections for authoring/search/community.
