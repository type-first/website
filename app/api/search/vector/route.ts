import { NextRequest, NextResponse } from 'next/server';
import { searchByVector, getArticleById } from '@/lib/db/articles';
import { SearchResult } from '@/lib/schemas/article';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { embedding, limit = 10, threshold = 0.8 } = body;

    if (!embedding || !Array.isArray(embedding)) {
      return NextResponse.json(
        { error: 'Embedding array is required' },
        { status: 400 }
      );
    }

    if (embedding.length !== 1536) {
      return NextResponse.json(
        { error: 'Embedding must be 1536 dimensions (OpenAI format)' },
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 50' },
        { status: 400 }
      );
    }

    if (threshold < 0 || threshold > 1) {
      return NextResponse.json(
        { error: 'Threshold must be between 0 and 1' },
        { status: 400 }
      );
    }

    const searchResults = await searchByVector(embedding, limit, threshold);
    
    // Group results by article and aggregate scores
    const articleResults = new Map<string, {
      articleId: string;
      maxScore: number;
      sections: Array<{ content: string; score: number; sectionIndex: number }>;
    }>();

    searchResults.forEach(result => {
      const existing = articleResults.get(result.articleId);
      if (existing) {
        existing.maxScore = Math.max(existing.maxScore, result.score);
        existing.sections.push({
          content: result.content,
          score: result.score,
          sectionIndex: result.sectionIndex,
        });
      } else {
        articleResults.set(result.articleId, {
          articleId: result.articleId,
          maxScore: result.score,
          sections: [{
            content: result.content,
            score: result.score,
            sectionIndex: result.sectionIndex,
          }],
        });
      }
    });

    // Sort by max score and enrich with article metadata
    const sortedResults = Array.from(articleResults.values())
      .sort((a, b) => b.maxScore - a.maxScore);

    const enrichedResults: SearchResult[] = [];
    
    for (const result of sortedResults) {
      try {
        const article = await getArticleById(result.articleId);
        
        // Create snippet from best matching section
        const bestSection = result.sections.reduce((best, current) => 
          current.score > best.score ? current : best
        );
        
        const snippet = bestSection.content.length > 200 
          ? `${bestSection.content.slice(0, 200)}...`
          : bestSection.content;

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
          snippet,
          score: result.maxScore,
          matchType: 'vector' as const,
        });
      } catch (error) {
        // Skip articles that can't be found
        continue;
      }
    }

    return NextResponse.json({
      results: enrichedResults,
      total: enrichedResults.length,
      threshold,
    });
  } catch (error) {
    console.error('Vector search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Example endpoint to generate embeddings (you'd typically use OpenAI API)
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Vector search endpoint. Use POST with embedding array.',
    example: {
      embedding: '[1536 dimensional array]',
      limit: 10,
      threshold: 0.8,
    },
  });
}
