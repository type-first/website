# Embeddings System

This module provides a comprehensive system for generating and managing embeddings for article content.

## Overview

The embeddings system chunks content by sections and generates vector embeddings that can be used for semantic search, content similarity, and other AI-powered features.

## Architecture

```
lib/embeddings/
├── types.ts                    # Type definitions
├── content-chunker.ts          # Content chunking logic
├── embedding-generator.ts      # Main orchestrator
├── providers/
│   └── openai.ts              # OpenAI embedding provider
└── index.ts                   # Module exports
```

## Features

- **Section-based chunking**: Preserves semantic boundaries by chunking content along section lines
- **Multiple chunk types**: Handles different content types (metadata, sections, code, practices)
- **Provider abstraction**: Pluggable embedding providers (currently OpenAI)
- **YAML output**: Human-readable embedding storage format
- **Incremental updates**: Only regenerates when content changes
- **Token estimation**: Tracks token usage for cost management

## Usage

### Generate embeddings for an article

```bash
# Using npm script
npm run embeddings:article advanced-typescript-patterns-react

# Using tsx directly
npx tsx scripts/generate-embedding-for-article.ts advanced-typescript-patterns-react
```

### Environment Setup

Add your OpenAI API key to `.env.local`:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### Programmatic Usage

```typescript
import { EmbeddingGenerator } from '@/lib/embeddings';

const generator = new EmbeddingGenerator();

// Generate embeddings for an article
const result = await generator.generateForArticle(
  contentData,
  articlePath,
  articleSlug
);

console.log(`Generated ${result.chunks.length} embeddings`);
```

## Content Chunking Strategy

The system creates the following types of chunks:

1. **Metadata chunk**: Article title, description, tags, author
2. **Introduction chunk**: Article introduction text
3. **Section chunks**: Each article section becomes a chunk
4. **Code chunks**: Code examples get separate chunks
5. **Practice chunks**: Best practices get individual chunks
6. **Footer chunk**: Conclusion/footer content

## Output Format

Embeddings are saved as `data.embedding.generated.yml` files alongside the content:

```yaml
articleId: advanced-typescript-patterns-react
title: Advanced TypeScript Patterns for React Applications
generatedAt: '2025-09-15T10:30:00.000Z'
model:
  name: text-embedding-3-small
  provider: openai
  dimension: 1536
chunks:
  - chunk:
      id: section-genericComponents
      content: |
        Generic Components
        Basic Generic Component Pattern
        Generic components are one of the most powerful patterns...
      type: section
      sectionId: genericComponents
      sectionTitle: Generic Components
      order: 0
      tokenCount: 156
    embedding:
      values: [0.1234, -0.5678, 0.9012, ...]
      dimension: 1536
      model: text-embedding-3-small
      createdAt: '2025-09-15T10:30:00.000Z'
metadata:
  totalChunks: 8
  totalTokens: 1024
  processingTimeMs: 2340
```

## Models Supported

- `text-embedding-3-small` (1536 dimensions) - Default
- `text-embedding-3-large` (3072 dimensions)
- `text-embedding-ada-002` (1536 dimensions) - Legacy

## Cost Optimization

- Token estimation helps predict costs
- Incremental generation (only when content changes)
- Efficient chunking to minimize redundancy
- Batch API calls for multiple chunks

## Integration

The generated embeddings can be used for:

- Semantic search in articles
- Content recommendation systems
- Similarity scoring between articles
- AI-powered content analysis
- Vector database integration

## Dependencies

- `yaml`: For human-readable output format
- OpenAI API: For embedding generation
- Node.js built-ins: `fs/promises`, `path`
