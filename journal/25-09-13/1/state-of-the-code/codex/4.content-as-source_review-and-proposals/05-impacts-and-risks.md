# Impacts & Risks

Impacts
- Clear separation of authored knowledge vs UGC/derived data.
- Easier programmatic derivations for search/RAG.
- More predictable imports and linking.

Risks
- Relocation churn (imports, scripts). Mitigate by doing one article first and codifying patterns.
- Search and derivation coupling: ensure upsert helpers are robust before enabling hybrid search in prod.
- Registry drift: if some metadata remains hand-authored, document which fields are authoritative in content vs registry.
