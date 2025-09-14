# DevEx & Tooling

Package scripts
- Remove or add missing `scripts/articles.ts` (fix `package.json` scripts that reference it).
- Keep `md:gen:*` scripts for multimodal markdown export.

Environment consistency
- Document `AUTH_SECRET` vs `NEXTAUTH_SECRET` and standardize on one.
- Document OpenAI env var and DB requirements for search hybrid.

Tests
- Update Playwright tests to reflect canonical article route (`/article/<slug>`).
- Add minimal API tests for community endpoints.

Code quality
- If eslint is disabled, keep it disabled but add a short formatting guideline (see Coding Standards).
- Optionally add a pre-commit type-check script (`tsc --noEmit`).

Docs
- Add short ADRs for multimodal as canonical, link path convention, and search shape choice.
