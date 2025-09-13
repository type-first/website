# Labs: Type Explorer Enhancements

Keep
- Core UX and Monaco integration; multi-file support; diagnostics pipeline.

Fixes
- Path mismatch: either change `starter/page.tsx` to read `app/labs/type-explorer/starter/src` (it already falls back) or add the expected `scenarios/starter/src` folder for predictability.

Refinements (no functional change)
- Theme unification: read monaco theme from `lib/codeTheme.ts` consistently; ensure parity with Shiki light theme.
- Diagnostics batching: current on-change scheduling is good; consider slightly higher debounce in heavy files (configurable constant).
- Hover tooltips: already implemented; ensure disposal on unmount (done).
- File ops: ensure unique naming collision logic stays fast (Set-based; already present).

Future‑ready ideas
- Optional read‑only preset mode (prop gate) for embedding in articles (no editing), without changing current default behavior.
- Optional “Save snapshot” hook for future persistence (behind a prop; noop by default).
