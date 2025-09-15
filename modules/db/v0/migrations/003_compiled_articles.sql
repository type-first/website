-- Migration for compiled articles table
CREATE TABLE IF NOT EXISTS compiled_articles (
  slug VARCHAR(255) PRIMARY KEY,
  metadata JSONB NOT NULL,
  html TEXT NOT NULL,
  markdown TEXT NOT NULL,
  plain_text TEXT NOT NULL,
  outline JSONB NOT NULL,
  word_count INTEGER NOT NULL DEFAULT 0,
  reading_time INTEGER NOT NULL DEFAULT 0,
  embedding vector(1536), -- OpenAI ada-002 embedding dimension
  last_compiled TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for searching
CREATE INDEX IF NOT EXISTS idx_compiled_articles_tags ON compiled_articles USING GIN ((metadata -> 'tags'));
CREATE INDEX IF NOT EXISTS idx_compiled_articles_published_at ON compiled_articles ((metadata -> 'publishedAt'));
CREATE INDEX IF NOT EXISTS idx_compiled_articles_plain_text ON compiled_articles USING GIN (to_tsvector('english', plain_text));

-- Vector similarity search index
CREATE INDEX IF NOT EXISTS idx_compiled_articles_embedding ON compiled_articles USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Full text search index
CREATE INDEX IF NOT EXISTS idx_compiled_articles_search ON compiled_articles USING GIN (
  to_tsvector('english', 
    COALESCE(metadata ->> 'title', '') || ' ' ||
    COALESCE(metadata ->> 'description', '') || ' ' ||
    COALESCE(plain_text, '')
  )
);
