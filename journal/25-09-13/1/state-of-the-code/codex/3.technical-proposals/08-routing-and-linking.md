# Routing & Linking

Canonical links
- Adopt `/article/<slug>` as the canonical article route everywhere.
- Add `lib/routes.ts` helper: `export const linkToArticle = (slug: string) => "/article/" + encodeURIComponent(slug);` and replace inline strings.

Update callers
- Search Dialog, Chat suggestions, SEO tools, labs pages, metadata inspector — replace `/articles/` with helper.

Redirects (optional)
- To protect old links, consider adding a lightweight redirect from `/articles/<slug>` → `/article/<slug>`.
