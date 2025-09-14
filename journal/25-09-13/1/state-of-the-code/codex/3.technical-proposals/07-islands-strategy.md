# Islands Strategy

Current
- Islands registry/setup exists; used in fixtures/tests; not used by the multimodal article.

Proposal
- Keep islands infra (do not remove). It supports schema-rendered content and future interactive docs.
- Document intended use: test/demo content, selective interactivity, non-critical features.
- If future multimodal articles need islands, compose them as client islands embedded within multimodal sections.

Hygiene
- Ensure all registered islands have a minimal a11y baseline and safe fallback UIs.
