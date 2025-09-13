# Alignment With Current Repo

What already aligns
- Multimodal article modules exist and work (advanced article); can be moved under `content/articles/` without changing authoring model.
- Derivation pipeline exists for markdown/plaintext/outline (and embeddings script hooks) — fits content-as-source well.
- Labs are independent routes (Type Explorer), consistent with keeping `app/labs/*` as platform surfaces.

What needs mapping/moves
- Today’s articles live under `articles/*` and route under `app/article/<slug>` — propose moving source modules to `content/articles/*` while keeping route the same.
- Contributor/terminology/lab catalog components are not yet in `content/` — propose adding and migrating where applicable.

Backends and derived data
- DB is already used for community (UGC) and `compiled_articles` (derived content + embeddings) — fits the “dynamic + derived” bucket.

Link conventions
- We need a canonical helper for article links to ensure consistency (`/article/<slug>`).
