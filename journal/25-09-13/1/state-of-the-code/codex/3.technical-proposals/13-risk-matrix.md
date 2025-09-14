# Risk Matrix (Summary)

Low
- Link path canonicalization; Type Explorer path hygiene; doc/ADRs; test updates.

Medium
- Community endpoints (auth + DB error handling); search param validation; chat fallback path; compiled content upserts.

High
- Search backend consolidation (ensure clients updated in lockstep); retiring alternates; changing schema-based renderer scope.

Mitigations
- Stage changes per migration plan; add lightweight tests; keep redirects for old paths.
