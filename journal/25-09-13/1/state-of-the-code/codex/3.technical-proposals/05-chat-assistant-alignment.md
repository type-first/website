# Chat Assistant Alignment

Keep
- UI and conversational shape.

Align with search
- Build suggestions using canonical search helpers (`text` then optional `vector`).
- If no `OPENAI_API_KEY`, skip the LLM call and return a canned assistant reply with suggestions from text search only.

Linking
- Use `linkToArticle(slug)` for canonical article links.

Safety & latency
- Rate limit per IP (simple token bucket or time window) to avoid abuse.
- Truncate history to last N messages (already done); keep max tokens small.

Observability
- Log suggestion queries and response paths (text vs hybrid) at info level (without PII).
