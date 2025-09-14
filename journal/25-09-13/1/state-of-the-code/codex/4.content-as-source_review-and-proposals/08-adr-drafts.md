# ADR Drafts (Templates)

## ADR: Content-as-Source as Canonical
- Context: Replace DB-as-source with source-as-source for authored knowledge.
- Decision: Create `content/` for multimodal articles, contributors, terminology, labs catalog.
- Consequences: DB persists for UGC and derived artifacts; app consumes content+lib.

## ADR: Canonical Article Link
- Decision: Use `/article/<slug>` everywhere; add `lib/routes.ts`.
- Consequences: Replace existing `/articles/<slug>` links; optional redirect route.

## ADR: Search Backend Shape
- Decision: Single canonical response `{ article, snippet, score, matchType }` across Dialog, Chat, Lab.
- Consequences: Consolidate backends; update clients; consistent param validation + fallbacks.
