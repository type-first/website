# Summary of Author’s Position

Core idea
- “Content-as-source”: the repo is the canonical store for authored knowledge. The database remains essential for dynamic, user-generated material and derived artifacts (e.g., embeddings, caches).

Why this works here
- Articles authored as React/TypeScript using multimodal components deliver interactivity, composability, types, and dual-mode rendering (SSR + markdown/plaintext derivations).
- Section-level derivations enable search and RAG (chat assistant).
- Modality awareness supports different outputs for human readers vs crawlers vs chatbots.

Proposed domains
- `content/` — canonical, authored, multimodal knowledge:
  - `content/articles/` — multimodal articles as modules
  - `content/contributors/` — contributor profiles as components
  - `content/terminology/` — branded concepts and definitions
  - `content/labs/` — catalog entries (metadata, links) describing lab experiences
- `app/` — routes, navigation, presentation; consumes content and lib
- `lib/` — multimodal primitives and shared UI/tooling; consumed by content and app

Directional dependencies
- app → content, lib
- content → lib
- lib ↛ app, content (no circularity)
