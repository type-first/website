import { getAllArticles, ArticleWithSlug } from '@/lib/articles/registry';
import { sql } from '@/lib/db';

export interface SearchResult {
  article: ArticleWithSlug;
  snippet: string;
  score: number;
  matchType: 'text' | 'vector' | 'hybrid';
}

export interface VectorSearchResult {
  slug: string;
  score: number;
  snippet: string;
}

export interface TextSearchResult {
  slug: string;
  score: number;
  snippet: string;
}

/**
 * Search articles by text using compiled articles table
 */
export async function searchArticlesByText(query: string, limit: number = 10): Promise<SearchResult[]> {
  try {
    // Get all module-based articles for metadata
    const allArticles = await getAllArticles();
    const articleMap = new Map(allArticles.map(article => [article.slug, article]));

    // Search in compiled articles table using PostgreSQL full-text search
    const searchResults = await sql`
      SELECT 
        slug, 
        plain_text,
        ts_rank(to_tsvector('english', plain_text), plainto_tsquery('english', ${query})) as score,
        ts_headline('english', plain_text, plainto_tsquery('english', ${query}), 
          'MaxWords=20, MinWords=10, ShortWord=3, HighlightAll=false, MaxFragments=1') as snippet
      FROM compiled_articles 
      WHERE to_tsvector('english', plain_text) @@ plainto_tsquery('english', ${query})
      ORDER BY score DESC
      LIMIT ${limit}
    `;

    const results: SearchResult[] = [];
    
    for (const row of searchResults.rows || []) {
      const article = articleMap.get(row.slug);
      if (article) {
        results.push({
          article,
          snippet: row.snippet || row.plain_text?.slice(0, 200) + '...',
          score: parseFloat(row.score) || 0,
          matchType: 'text' as const,
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Text search error:', error);
    return [];
  }
}

/**
 * Search articles by vector similarity using compiled articles table
 */
export async function searchArticlesByVector(
  embedding: number[], 
  limit: number = 10, 
  threshold: number = 0.3
): Promise<SearchResult[]> {
  try {
    // Get all module-based articles for metadata
    const allArticles = await getAllArticles();
    const articleMap = new Map(allArticles.map(article => [article.slug, article]));

    // Search using vector similarity (cosine distance)
    const searchResults = await sql`
      SELECT 
        slug,
        plain_text,
        (1 - (embedding <=> ${`[${embedding.join(',')}]`}::vector)) as score,
        CASE 
          WHEN LENGTH(plain_text) > 200 THEN LEFT(plain_text, 200) || '...'
          ELSE plain_text
        END as snippet
      FROM compiled_articles 
      WHERE embedding IS NOT NULL 
        AND (1 - (embedding <=> ${`[${embedding.join(',')}]`}::vector)) >= ${threshold}
      ORDER BY embedding <=> ${`[${embedding.join(',')}]`}::vector
      LIMIT ${limit}
    `;

    const results: SearchResult[] = [];
    
    for (const row of searchResults.rows || []) {
      const article = articleMap.get(row.slug);
      if (article) {
        results.push({
          article,
          snippet: row.snippet || '',
          score: parseFloat(row.score) || 0,
          matchType: 'vector' as const,
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Vector search error:', error);
    return [];
  }
}

/**
 * Hybrid search combining text and vector search
 */
export async function searchArticlesHybrid(
  query: string, 
  embedding: number[] | null = null,
  limit: number = 10,
  textWeight: number = 0.5,
  vectorWeight: number = 0.5
): Promise<SearchResult[]> {
  try {
    const [textResults, vectorResults] = await Promise.all([
      searchArticlesByText(query, limit * 2), // Get more results to merge
      embedding ? searchArticlesByVector(embedding, limit * 2) : Promise.resolve([])
    ]);

    // Combine and deduplicate results
    const resultMap = new Map<string, SearchResult>();

    // Add text results
    for (const result of textResults) {
      resultMap.set(result.article.slug, {
        ...result,
        score: result.score * textWeight,
        matchType: 'hybrid' as const,
      });
    }

    // Add or merge vector results
    for (const result of vectorResults) {
      const existing = resultMap.get(result.article.slug);
      if (existing) {
        // Combine scores for articles found in both searches
        existing.score = existing.score + (result.score * vectorWeight);
        // Use vector snippet if it's better (longer/more relevant)
        if (result.snippet.length > existing.snippet.length) {
          existing.snippet = result.snippet;
        }
      } else {
        resultMap.set(result.article.slug, {
          ...result,
          score: result.score * vectorWeight,
          matchType: 'hybrid' as const,
        });
      }
    }

    // Sort by combined score and limit results
    return Array.from(resultMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  } catch (error) {
    console.error('Hybrid search error:', error);
    return [];
  }
}

/**
 * Generate embedding for a text query using OpenAI
 */
export async function generateEmbedding(text: string): Promise<number[] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('OPENAI_API_KEY not set, skipping embedding generation');
    return null;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: text.slice(0, 8000), // Limit to ~8000 chars for token limits
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.error('Failed to generate embedding:', error);
    return null;
  }
}
