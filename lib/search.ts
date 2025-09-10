import { sql } from './db';
import { getAllArticles, ArticleWithSlug } from './articles/registry';

export interface SearchResult {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  coverImage: string;
  author: string;
  publishedAt: string;
  readingTime: number;
  wordCount: number;
  score?: number;
  type: 'text' | 'vector';
}

export async function searchByText(query: string, limit: number = 10): Promise<SearchResult[]> {
  try {
    // Search in compiled articles using full-text search
    const result = await sql`
      SELECT 
        ca.slug,
        ca.metadata,
        ca.word_count,
        ca.reading_time,
        ts_rank(to_tsvector('english', ca.plain_text), plainto_tsquery('english', ${query})) as score
      FROM compiled_articles ca
      WHERE to_tsvector('english', ca.plain_text) @@ plainto_tsquery('english', ${query})
      ORDER BY score DESC
      LIMIT ${limit}
    `;

    const rows = result.rows || [];
    
    return rows.map((row: any) => {
      const metadata = row.metadata;
      return {
        slug: row.slug,
        title: metadata.title,
        description: metadata.description,
        tags: metadata.tags || [],
        coverImage: metadata.coverImage,
        author: metadata.author,
        publishedAt: metadata.publishedAt,
        readingTime: row.reading_time,
        wordCount: row.word_count,
        score: parseFloat(row.score),
        type: 'text' as const
      };
    });
  } catch (error) {
    console.error('Text search error:', error);
    return [];
  }
}

export async function searchByVector(embedding: number[], limit: number = 10): Promise<SearchResult[]> {
  try {
    // Search using vector similarity
    const result = await sql`
      SELECT 
        ca.slug,
        ca.metadata,
        ca.word_count,
        ca.reading_time,
        1 - (ca.embedding <=> ${`[${embedding.join(',')}]`}::vector) as similarity
      FROM compiled_articles ca
      WHERE ca.embedding IS NOT NULL
      ORDER BY ca.embedding <=> ${`[${embedding.join(',')}]`}::vector
      LIMIT ${limit}
    `;

    const rows = result.rows || [];
    
    return rows.map((row: any) => {
      const metadata = row.metadata;
      return {
        slug: row.slug,
        title: metadata.title,
        description: metadata.description,
        tags: metadata.tags || [],
        coverImage: metadata.coverImage,
        author: metadata.author,
        publishedAt: metadata.publishedAt,
        readingTime: row.reading_time,
        wordCount: row.word_count,
        score: parseFloat(row.similarity),
        type: 'vector' as const
      };
    });
  } catch (error) {
    console.error('Vector search error:', error);
    return [];
  }
}

export async function searchHybrid(query: string, limit: number = 10): Promise<SearchResult[]> {
  try {
    // Get both text and vector results
    const textResults = await searchByText(query, Math.ceil(limit / 2));
    
    // Generate embedding for vector search
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      console.warn('OpenAI API key not configured, falling back to text search only');
      return textResults;
    }

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: query.slice(0, 8000),
      }),
    });

    if (!response.ok) {
      console.warn('Failed to generate embedding, falling back to text search only');
      return textResults;
    }

    const data = await response.json();
    const embedding = data.data[0].embedding;
    
    const vectorResults = await searchByVector(embedding, Math.ceil(limit / 2));
    
    // Combine and deduplicate results
    const combined = [...textResults, ...vectorResults];
    const seen = new Set<string>();
    const unique = combined.filter(result => {
      if (seen.has(result.slug)) {
        return false;
      }
      seen.add(result.slug);
      return true;
    });
    
    // Sort by score and limit
    return unique
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, limit);
      
  } catch (error) {
    console.error('Hybrid search error:', error);
    // Fallback to text search
    return searchByText(query, limit);
  }
}
