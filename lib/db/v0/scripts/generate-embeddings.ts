import dotenv from 'dotenv';
import path from 'path';
import { sql } from '@vercel/postgres';
import { Article, ArticleStatus } from '@/lib/schemas/v0/article';
import { ContentDerivationPipeline, MockEmbeddingService, EmbeddingService } from '@/lib/content/v0/derivation';

// Load env from project root .env.local
dotenv.config({ path: path.join(__dirname, '../../../.env.local') });

class OpenAIEmbeddingService implements EmbeddingService {
  constructor(private apiKey: string) {}

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    // OpenAI embeddings endpoint accepts an array of strings in one request
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        input: texts,
        model: 'text-embedding-3-small',
      }),
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      throw new Error(`OpenAI embeddings failed: ${res.status} ${res.statusText} ${msg}`);
    }

    const data: any = await res.json();
    const vectors = (data?.data || []).map((d: any) => d.embedding as number[]);
    if (!Array.isArray(vectors) || vectors.length !== texts.length) {
      throw new Error('Unexpected embeddings response shape');
    }
    return vectors;
  }
}

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

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  const useOpenAI = Boolean(apiKey);
  const service: EmbeddingService = useOpenAI
    ? new OpenAIEmbeddingService(apiKey as string)
    : new MockEmbeddingService();

  if (!useOpenAI) {
    console.warn('\n⚠️ OPENAI_API_KEY not set. Using MockEmbeddingService (random vectors).');
    console.warn('   Hybrid search will work but results will be random-ish.\n');
  } else {
    console.log('✅ Using OpenAI for embeddings');
  }

  // Fetch published articles with content
  const { rows } = await sql`
    SELECT id, title, slug, description, content, tags, status, created_at, updated_at,
           published_at, author_id, cover_image, seo_title, seo_description, canonical_url
    FROM articles
    WHERE status = 'published'
    ORDER BY created_at DESC
  `;

  if (rows.length === 0) {
    console.log('No published articles found. Nothing to embed.');
    return;
  }

  const pipeline = new ContentDerivationPipeline();

  let processed = 0;
  for (const row of rows) {
    const article = mapRowToArticle(row);
    // Derive content (markdown/plaintext/outline) and generate section embeddings
    await pipeline.deriveContent(article, { generateEmbeddings: true, embeddingService: service });
    processed += 1;
    console.log(`Embedded: ${article.title} (${processed}/${rows.length})`);
  }

  console.log('\n✅ Embedding generation complete');
}

// Run if invoked directly
if (require.main === module) {
  main().catch((err) => {
    console.error('Embedding generation failed:', err);
    process.exit(1);
  });
}
