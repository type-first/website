import { NextRequest, NextResponse } from 'next/server';
import { searchByString, searchByVector, getArticleById } from '@/lib/db/articles';
import type { SearchResult } from '@/lib/schemas/article';

async function embedQuery(query: string): Promise<number[] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        input: query,
        model: 'text-embedding-3-small',
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const embedding = data?.data?.[0]?.embedding as number[] | undefined;
    return Array.isArray(embedding) ? embedding : null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q');
  const limit = Math.max(1, Math.min(50, parseInt(searchParams.get('limit') || '10', 10)));
  // Optional threshold override via env or query param
  const envThresh = parseFloat(process.env.SEARCH_VECTOR_THRESHOLD || 'NaN');
  const qpThresh = parseFloat(searchParams.get('t') || 'NaN');
  const vectorThreshold = Number.isFinite(qpThresh)
    ? Math.max(0, Math.min(1, qpThresh))
    : Number.isFinite(envThresh)
      ? Math.max(0, Math.min(1, envThresh))
      : 0.3; // default tuned based on test script output

  if (!q || q.trim().length === 0) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    const textResults = await searchByString(q.trim(), limit);

    const seen = new Set<string>();
    const combined: SearchResult[] = [];

    // First: exact/text matches (with snippet containing <mark>)
    for (const r of textResults) {
      try {
        const article = await getArticleById(r.articleId);
        combined.push({
          article: {
            id: article.id,
            title: article.title,
            slug: article.slug,
            description: article.description,
            tags: article.tags,
            status: article.status,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            publishedAt: article.publishedAt,
            coverImage: article.coverImage,
          },
          snippet: r.snippet,
          score: r.score,
          matchType: 'text',
        });
        seen.add(r.articleId);
      } catch { /* ignore missing */ }
    }

    // Second: semantic matches via embeddings (if key present)
    const embedding = await embedQuery(q.trim());
    if (embedding) {
      const vectorResults = await searchByVector(embedding, limit, vectorThreshold);

      let vectorAdded = 0;
      for (const r of vectorResults) {
        if (seen.has(r.articleId)) continue;
        try {
          const article = await getArticleById(r.articleId);
          const snippet = r.content.length > 200 ? `${r.content.slice(0, 200)}...` : r.content;
          combined.push({
            article: {
              id: article.id,
              title: article.title,
              slug: article.slug,
              description: article.description,
              tags: article.tags,
              status: article.status,
              createdAt: article.createdAt,
              updatedAt: article.updatedAt,
              publishedAt: article.publishedAt,
              coverImage: article.coverImage,
            },
            snippet,
            score: r.score,
            matchType: 'vector',
          });
          vectorAdded++;
        } catch { /* ignore */ }
      }

      // If all vector hits overlapped with text results, surface the top vector hit anyway
      if (vectorAdded === 0 && vectorResults.length > 0) {
        const r = vectorResults[0];
        try {
          const article = await getArticleById(r.articleId);
          const snippet = r.content.length > 200 ? `${r.content.slice(0, 200)}...` : r.content;
          combined.push({
            article: {
              id: article.id,
              title: article.title,
              slug: article.slug,
              description: article.description,
              tags: article.tags,
              status: article.status,
              createdAt: article.createdAt,
              updatedAt: article.updatedAt,
              publishedAt: article.publishedAt,
              coverImage: article.coverImage,
            },
            snippet,
            score: r.score,
            matchType: 'vector',
          });
        } catch { /* ignore */ }
      }
    }

    return NextResponse.json({ query: q, results: combined, total: combined.length });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
