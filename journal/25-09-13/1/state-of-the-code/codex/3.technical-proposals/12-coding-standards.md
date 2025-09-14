# Coding Standards (Targeted)

General
- Prefer server components and SSR for article content; keep islands limited to interactive needs.
- Centralize routes via helpers (e.g., `lib/routes.ts`).
- Keep environment gates explicit; avoid silent failures.

Articles (multimodal)
- Always accept an explicit `modality` prop; no implicit defaults in children.
- Use `JsonLd` components for SEO; keep site config DRY.
- Use `Code` (Shiki) not client highlighters.

APIs
- Validate inputs server-side; return `{ error, detail? }` on failures.
- Avoid 500s for expected states (DB off, missing API key); use 4xx/5xx with clear messages.

Search
- Single backend shape; HTML-safe snippets; return `matchType` and `score`.

Community
- Auth‑gate write operations; consistent error shapes; clamp votes.

Chat
- Cap history and tokens; guard LLM calls; text‑only fallback path.
