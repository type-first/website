# Codex vs Claude: Differences

Agreements:
- Multimodal articles and Type Explorer are current/working.
- Duplicates exist across article rendering, code highlighting, search backends.
- Useful dev/SEO tools identified (metadata inspector, SEO test).

Key differences to note:
- Islands usage: Claude marked as unused; actually used via fixtures/tests and registry setup (not by multimodal article).
- Derivation pipeline: not dead — used by embeddings script to populate compiled content.
- “No duplication” claim: contradicted by parallel search/code paths and test pages.
- `highlight.ts` importance: it’s a simple fallback for legacy paths; not essential for the current article flow.

Additions in this consolidation:
- Explicit callouts of missing community API routes, compiled-content stubs, link path inconsistencies, Type Explorer scenario path mismatch, missing `scripts/articles.ts`.
