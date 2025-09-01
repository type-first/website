-- Migration: 001_initial_schema
-- Description: Create initial tables for articles, derived content, and section embeddings

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Articles table
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content JSONB NOT NULL,
    tags TEXT[] DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    author_id VARCHAR(255),
    cover_image TEXT,
    seo_title VARCHAR(60),
    seo_description VARCHAR(160),
    canonical_url TEXT
);

-- Derived content table
CREATE TABLE derived_content (
    article_id UUID PRIMARY KEY REFERENCES articles(id) ON DELETE CASCADE,
    markdown TEXT NOT NULL,
    plaintext TEXT NOT NULL,
    outline JSONB NOT NULL DEFAULT '[]',
    search_vector tsvector,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Section embeddings table
CREATE TABLE section_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    section_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536), -- OpenAI embedding dimension
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(article_id, section_index)
);

-- Indexes for performance
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published_at ON articles(published_at) WHERE status = 'published';
CREATE INDEX idx_articles_tags ON articles USING GIN(tags);
CREATE INDEX idx_articles_updated_at ON articles(updated_at);

CREATE INDEX idx_derived_content_search_vector ON derived_content USING GIN(search_vector);

CREATE INDEX idx_section_embeddings_article_id ON section_embeddings(article_id);
CREATE INDEX idx_section_embeddings_vector ON section_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update search vector
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector = to_tsvector('english', NEW.plaintext);
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_derived_content_search_vector BEFORE INSERT OR UPDATE ON derived_content
    FOR EACH ROW EXECUTE FUNCTION update_search_vector();
