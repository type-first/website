import { NextRequest } from 'next/server';
import { getArticleBySlug } from '@/lib/db/articles';

export const revalidate = 3600;

export async function GET(_req: NextRequest, context: { params: { slug: string } }) {
  const slug = context.params.slug;
  try {
    const article = await getArticleBySlug(slug);
    const url = article.coverImage;
    if (url) {
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (res.ok) {
        const ab = await res.arrayBuffer();
        const contentType = res.headers.get('content-type') || 'image/jpeg';
        return new Response(ab, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=3600',
          },
        });
      }
    }
  } catch {}

  // Fallback placeholder
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img" aria-label="typefirst">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1e6ad8"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <g>
      <rect x="72" y="72" width="80" height="80" rx="16" fill="#ffffff"/>
      <text x="112" y="130" text-anchor="middle" fill="#1e6ad8" font-family="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" font-weight="800" font-size="44">tf</text>
    </g>
  </svg>`;
  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=600' },
  });
}

