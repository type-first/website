import { sql } from './index';
import { Article, ArticleMetadata, DerivedContent, SectionEmbedding, ArticleStatus } from '../schemas/article';

export class DatabaseError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class ArticleNotFoundError extends DatabaseError {
  constructor(identifier: string) {
    super(`Article not found: ${identifier}`);
    this.name = 'ArticleNotFoundError';
  }
}

// Database utilities
export async function executeTransaction<T>(
  callback: () => Promise<T>
): Promise<T> {
  try {
    await sql`BEGIN`;
    const result = await callback();
    await sql`COMMIT`;
    return result;
  } catch (error) {
    await sql`ROLLBACK`;
    throw error;
  }
}

// Article CRUD operations
export async function createArticle(article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<Article> {
  try {
    const query = `
      INSERT INTO articles (
        title, slug, description, content, tags, status,
        published_at, author_id, cover_image, seo_title, seo_description, canonical_url
      ) VALUES (
        $1, $2, $3, $4::jsonb, $5::text[], $6,
        $7, $8, $9, $10, $11, $12
      ) RETURNING *
    `;

    const values = [
      article.title,
      article.slug,
      article.description || null,
      JSON.stringify(article.content),
      article.tags || [],
      article.status,
      article.publishedAt?.toISOString() || null,
      article.authorId || null,
      article.coverImage || null,
      article.seoTitle || null,
      article.seoDescription || null,
      article.canonicalUrl || null,
    ];

    const result = await sql.query(query, values);
    return mapRowToArticle(result.rows[0]);
  } catch (error) {
    throw new DatabaseError('Failed to create article', error as Error);
  }
}

export async function getArticleById(id: string): Promise<Article> {
  try {
    const result = await sql`SELECT * FROM articles WHERE id = ${id}`;
    
    if (result.rows.length === 0) {
      throw new ArticleNotFoundError(id);
    }
    
    return mapRowToArticle(result.rows[0]);
  } catch (error) {
    if (error instanceof ArticleNotFoundError) throw error;
    throw new DatabaseError('Failed to get article by id', error as Error);
  }
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  try {
    const result = await sql`SELECT * FROM articles WHERE slug = ${slug}`;
    
    if (result.rows.length === 0) {
      throw new ArticleNotFoundError(slug);
    }
    
    return mapRowToArticle(result.rows[0]);
  } catch (error) {
    if (error instanceof ArticleNotFoundError) throw error;
    throw new DatabaseError('Failed to get article by slug', error as Error);
  }
}

export async function updateArticle(id: string, updates: Partial<Omit<Article, 'id' | 'createdAt'>>): Promise<Article> {
  try {
    const setParts: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.title !== undefined) {
      setParts.push(`title = $${paramIndex++}`);
      values.push(updates.title);
    }
    if (updates.slug !== undefined) {
      setParts.push(`slug = $${paramIndex++}`);
      values.push(updates.slug);
    }
    if (updates.description !== undefined) {
      setParts.push(`description = $${paramIndex++}`);
      values.push(updates.description);
    }
    if (updates.content !== undefined) {
      setParts.push(`content = $${paramIndex++}::jsonb`);
      values.push(JSON.stringify(updates.content));
    }
    if (updates.tags !== undefined) {
      setParts.push(`tags = $${paramIndex++}::text[]`);
      values.push(updates.tags);
    }
    if (updates.status !== undefined) {
      setParts.push(`status = $${paramIndex++}`);
      values.push(updates.status);
    }
    if (updates.publishedAt !== undefined) {
      setParts.push(`published_at = $${paramIndex++}`);
      values.push(updates.publishedAt?.toISOString() || null);
    }
    if (updates.authorId !== undefined) {
      setParts.push(`author_id = $${paramIndex++}`);
      values.push(updates.authorId);
    }
    if (updates.coverImage !== undefined) {
      setParts.push(`cover_image = $${paramIndex++}`);
      values.push(updates.coverImage);
    }
    if (updates.seoTitle !== undefined) {
      setParts.push(`seo_title = $${paramIndex++}`);
      values.push(updates.seoTitle);
    }
    if (updates.seoDescription !== undefined) {
      setParts.push(`seo_description = $${paramIndex++}`);
      values.push(updates.seoDescription);
    }
    if (updates.canonicalUrl !== undefined) {
      setParts.push(`canonical_url = $${paramIndex++}`);
      values.push(updates.canonicalUrl);
    }

    if (setParts.length === 0) {
      return getArticleById(id);
    }

    values.push(id);
    const query = `UPDATE articles SET ${setParts.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    
    const result = await sql.query(query, values);
    
    if (result.rows.length === 0) {
      throw new ArticleNotFoundError(id);
    }
    
    return mapRowToArticle(result.rows[0]);
  } catch (error) {
    if (error instanceof ArticleNotFoundError) throw error;
    throw new DatabaseError('Failed to update article', error as Error);
  }
}

export async function deleteArticle(id: string): Promise<void> {
  try {
    const result = await sql`DELETE FROM articles WHERE id = ${id}`;
    
    if (result.rowCount === 0) {
      throw new ArticleNotFoundError(id);
    }
  } catch (error) {
    if (error instanceof ArticleNotFoundError) throw error;
    throw new DatabaseError('Failed to delete article', error as Error);
  }
}

export async function listArticles(
  options: {
    status?: ArticleStatus;
    limit?: number;
    offset?: number;
    tags?: string[];
  } = {}
): Promise<{ articles: ArticleMetadata[]; total: number }> {
  try {
    const { status, limit = 20, offset = 0, tags } = options;

    // Basic listing with optional status filter; tag filtering can be added later
    const articlesResult = status
      ? await sql`
          SELECT id, title, slug, description, tags, status, created_at, updated_at, published_at, cover_image
          FROM articles
          WHERE status = ${status}
          ORDER BY created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `
      : await sql`
          SELECT id, title, slug, description, tags, status, created_at, updated_at, published_at, cover_image
          FROM articles
          ORDER BY created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `;
    
    const countResult = status
      ? await sql`SELECT COUNT(*) as count FROM articles WHERE status = ${status}`
      : await sql`SELECT COUNT(*) as count FROM articles`;

    const articles = articlesResult.rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description || '',
      tags: Array.isArray(row.tags) ? row.tags : [],
      status: row.status as ArticleStatus,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      publishedAt: row.published_at,
      coverImage: row.cover_image,
    }));
    
    const total = parseInt(countResult.rows[0].count);

    return { articles, total };
  } catch (error) {
    throw new DatabaseError('Failed to list articles', error as Error);
  }
}

// Derived content operations
export async function saveDerivedContent(derivedContent: DerivedContent): Promise<void> {
  try {
    await sql`
      INSERT INTO derived_content (article_id, markdown, plaintext, outline, updated_at)
      VALUES (${derivedContent.articleId}, ${derivedContent.markdown}, ${derivedContent.plaintext}, 
              ${JSON.stringify(derivedContent.outline)}, ${derivedContent.updatedAt.toISOString()})
      ON CONFLICT (article_id) 
      DO UPDATE SET 
        markdown = EXCLUDED.markdown,
        plaintext = EXCLUDED.plaintext,
        outline = EXCLUDED.outline,
        updated_at = EXCLUDED.updated_at
    `;
  } catch (error) {
    throw new DatabaseError('Failed to save derived content', error as Error);
  }
}

export async function getDerivedContent(articleId: string): Promise<DerivedContent | null> {
  try {
    const result = await sql`SELECT * FROM derived_content WHERE article_id = ${articleId}`;
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    return {
      articleId: row.article_id,
      markdown: row.markdown,
      plaintext: row.plaintext,
      outline: row.outline,
      searchVector: row.search_vector,
      updatedAt: new Date(row.updated_at),
    };
  } catch (error) {
    throw new DatabaseError('Failed to get derived content', error as Error);
  }
}

// Section embeddings operations
export async function saveSectionEmbeddings(embeddings: SectionEmbedding[]): Promise<void> {
  try {
    await executeTransaction(async () => {
      // Delete existing embeddings for the article
      if (embeddings.length > 0) {
        await sql`DELETE FROM section_embeddings WHERE article_id = ${embeddings[0].articleId}`;
      }

      // Insert new embeddings
      for (const embedding of embeddings) {
        await sql`
          INSERT INTO section_embeddings (article_id, section_index, content, embedding, created_at)
          VALUES (${embedding.articleId}, ${embedding.sectionIndex}, ${embedding.content}, 
                  ${JSON.stringify(embedding.embedding)}::vector, ${embedding.createdAt.toISOString()})
        `;
      }
    });
  } catch (error) {
    throw new DatabaseError('Failed to save section embeddings', error as Error);
  }
}

export async function searchByVector(
  queryEmbedding: number[],
  limit: number = 10,
  threshold: number = 0.8
): Promise<Array<{ articleId: string; content: string; score: number; sectionIndex: number }>> {
  try {
    const result = await sql`
      SELECT se.article_id, se.content, se.section_index,
             1 - (se.embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity
      FROM section_embeddings se
      JOIN articles a ON se.article_id = a.id
      WHERE a.status = 'published'
        AND 1 - (se.embedding <=> ${JSON.stringify(queryEmbedding)}::vector) > ${threshold}
      ORDER BY similarity DESC
      LIMIT ${limit}
    `;

    return result.rows.map((row: any) => ({
      articleId: row.article_id,
      content: row.content,
      score: parseFloat(row.similarity),
      sectionIndex: row.section_index,
    }));
  } catch (error) {
    throw new DatabaseError('Failed to perform vector search', error as Error);
  }
}

export async function searchByText(
  query: string,
  limit: number = 10
): Promise<Array<{ articleId: string; snippet: string; score: number }>> {
  try {
    const result = await sql`
      SELECT dc.article_id, 
             ts_headline('english', dc.plaintext, plainto_tsquery('english', ${query}), 
                        'StartSel=<mark>, StopSel=</mark>, MaxWords=50, MinWords=20') as snippet,
             ts_rank(dc.search_vector, plainto_tsquery('english', ${query})) as score
      FROM derived_content dc
      JOIN articles a ON dc.article_id = a.id
      WHERE a.status = 'published'
        AND dc.search_vector @@ plainto_tsquery('english', ${query})
      ORDER BY score DESC
      LIMIT ${limit}
    `;

    return result.rows.map((row: any) => ({
      articleId: row.article_id,
      snippet: row.snippet,
      score: parseFloat(row.score),
    }));
  } catch (error) {
    throw new DatabaseError('Failed to perform text search', error as Error);
  }
}

// String contains search prioritizing exact substring matches in title/description first,
// then body (derived_content.plaintext). Returns HTML snippets with <mark> highlights.
export async function searchByString(
  query: string,
  limit: number = 10
): Promise<Array<{ articleId: string; snippet: string; score: number }>> {
  const q = query.trim();
  if (!q) return [];

  const like = `%${q}%`;

  // Fetch potential matches
  const titleDesc = await sql`
    SELECT id as article_id, title, description
    FROM articles
    WHERE status = 'published'
      AND (title ILIKE ${like} OR description ILIKE ${like})
    LIMIT ${limit}
  `;

  // Remaining slots for body matches
  const remaining = Math.max(0, limit - titleDesc.rows.length);

  const body = remaining > 0 ? await sql`
    SELECT dc.article_id, dc.plaintext
    FROM derived_content dc
    JOIN articles a ON a.id = dc.article_id
    WHERE a.status = 'published'
      AND dc.plaintext ILIKE ${like}
    LIMIT ${remaining}
  ` : { rows: [] as any[] };

  // Helper to escape regex
  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(${escapeRegExp(q)})`, 'gi');

  const makeSnippet = (text: string) => {
    const lower = text.toLowerCase();
    const idx = lower.indexOf(q.toLowerCase());
    const start = Math.max(0, idx - 60);
    const end = Math.min(text.length, idx + q.length + 120);
    const slice = text.slice(start, end);
    const escaped = slice
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return escaped.replace(re, '<mark>$1</mark>');
  };

  const results: Array<{ articleId: string; snippet: string; score: number }> = [];

  // Title/description matches first
  for (const row of titleDesc.rows as any[]) {
    const base = row.title?.includes(q) ? row.title : (row.description || row.title || '');
    const snippet = makeSnippet(base);
    results.push({ articleId: row.article_id, snippet, score: 1.0 });
  }

  // Body matches next
  for (const row of body.rows as any[]) {
    const snippet = makeSnippet(row.plaintext || '');
    results.push({ articleId: row.article_id, snippet, score: 0.8 });
  }

  return results;
}

// Helper functions
function mapRowToArticle(row: any): Article {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description || '',
    content: row.content || [],
    tags: Array.isArray(row.tags) ? row.tags : [],
    status: row.status as ArticleStatus,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    publishedAt: row.published_at ? new Date(row.published_at) : undefined,
    authorId: row.author_id || undefined,
    coverImage: row.cover_image || undefined,
    seoTitle: row.seo_title || undefined,
    seoDescription: row.seo_description || undefined,
    canonicalUrl: row.canonical_url || undefined,
  };
}

function mapRowToArticleMetadata(row: any): ArticleMetadata {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    tags: Array.isArray(row.tags) ? row.tags : (typeof row.tags === 'string' ? JSON.parse(row.tags) : []),
    status: row.status,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    publishedAt: row.published_at ? new Date(row.published_at) : undefined,
    coverImage: row.cover_image,
  };
}
