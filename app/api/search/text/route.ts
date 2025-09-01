import { NextRequest, NextResponse } from 'next/server';
import { searchByText, getArticleById } from '@/lib/db/articles';
import { SearchResult } from '@/lib/schemas/article';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    );
  }

  if (limit < 1 || limit > 50) {
    return NextResponse.json(
      { error: 'Limit must be between 1 and 50' },
      { status: 400 }
    );
  }

  try {
    const searchResults = await searchByText(query.trim(), limit);
    
    // Enrich results with article metadata
    const enrichedResults: SearchResult[] = [];
    
    for (const result of searchResults) {
      try {
        const article = await getArticleById(result.articleId);
        enrichedResults.push({
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
          snippet: result.snippet,
          score: result.score,
          matchType: 'text' as const,
        });
      } catch (error) {
        // Skip articles that can't be found (e.g., deleted)
        continue;
      }
    }

    return NextResponse.json({
      query,
      results: enrichedResults,
      total: enrichedResults.length,
    });
  } catch (error) {
    console.error('Text search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, limit = 10 } = body;

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 50' },
        { status: 400 }
      );
    }

    const searchResults = await searchByText(query.trim(), limit);
    
    const enrichedResults: SearchResult[] = [];
    
    for (const result of searchResults) {
      try {
        const article = await getArticleById(result.articleId);
        enrichedResults.push({
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
          snippet: result.snippet,
          score: result.score,
          matchType: 'text' as const,
        });
      } catch (error) {
        continue;
      }
    }

    return NextResponse.json({
      query,
      results: enrichedResults,
      total: enrichedResults.length,
    });
  } catch (error) {
    console.error('Text search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
