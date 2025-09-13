# API Routes and Backend

**Server-side functionality, database layers, and external integrations**

## Authentication APIs

### NextAuth Integration
**Route**: `app/api/auth/[...nextauth]/route.ts`
**Configuration**: `auth.ts`
**Features**:
- GitHub OAuth provider
- JWT session strategy
- Custom pages for error handling
- Environment-based secrets management

**Status**: ✅ Complete and functional

**Integration Points**:
- `components/AuthProvider.tsx` - React context
- `components/AuthMenu.tsx` - UI components
- Database: Session management (if configured)

---

## Search APIs

### Hybrid Search
**Route**: `app/api/search/hybrid/route.ts`
**Features**:
- Combines text and vector search
- PostgreSQL full-text search
- OpenAI embeddings for semantic search
- Ranked result merging

**Dependencies**:
- `lib/search.ts` - Search implementation
- `compiled_articles` table - Content index
- OpenAI API - Vector embeddings

### Text Search
**Route**: `app/api/search/text/route.ts`
**Features**:
- PostgreSQL full-text search with ranking
- No external API dependencies
- Fast query response

**Status**: ✅ Functional but needs compiled content

### Vector Search
**Route**: `app/api/search/vector/route.ts`
**Features**:
- Pure semantic similarity search
- Requires pre-generated embeddings
- OpenAI embedding model integration

**Current Issues**:
- Depends on populated embeddings table
- No graceful fallback when embeddings missing

---

## Chat Assistant API

### Chat Endpoint
**Route**: `app/api/chat/route.ts`
**Features**:
- OpenAI GPT integration
- Context-aware article suggestions
- Message history management
- Combined search for relevant content

**Dependencies**:
- OpenAI API key
- Database search functions
- Article registry for suggestions

**Current Issues**:
- Returns 503 without OpenAI key (no fallback)
- Uses placeholder database functions
- Inconsistent article URL generation

**Required Changes**:
1. Add graceful degradation without OpenAI
2. Connect to unified search backend
3. Fix article link generation

---

## Community APIs

### Missing Implementations
The UI components call these endpoints, but they don't exist:

#### Create Post
**Expected Route**: `POST /api/community/posts`
**Called By**: `components/community/NewPostForm.tsx:21`
**Expected Functionality**:
- Create new community post
- Auth validation
- Database persistence
- Return post slug for redirect

#### Add Comment
**Expected Route**: `POST /api/community/posts/[slug]/comments`
**Called By**: `components/community/CommentForm.tsx:17`
**Expected Functionality**:
- Add comment to post
- Auth validation
- Database persistence
- Return updated comment list

#### Vote on Post
**Expected Route**: `POST /api/community/posts/[slug]/vote`
**Called By**: Voting buttons in community UI
**Expected Functionality**:
- Increment/decrement vote count
- Auth validation
- Prevent duplicate voting
- Return updated vote count

### Database Layer Available
**File**: `lib/db/community.ts`
**Functions Ready**:
- `createCommunityPost()` - Post creation
- `addComment()` - Comment addition
- Vote management functions (need implementation)

**Fallback System**: Demo data when database unavailable

---

## Content Management APIs

### Cover Upload
**Route**: `app/api/covers/upload/route.ts`
**Features**:
- Vercel Blob storage integration
- Image upload and processing
- Database URL persistence
- File type validation

**Status**: ✅ Appears complete

**Integration**: Article cover image management

---

## Database Backend

### Connection Management
**File**: `lib/db/index.ts`
**Features**:
- Vercel Postgres integration
- Connection pooling
- Environment-based configuration
- Error handling

### Migration System
**Location**: `lib/db/migrations/`
**Migrations**:
1. **Initial schema** (`001_initial.sql`)
2. **Community features** (`002_community.sql`)
   - Posts, comments, votes tables
   - User relationships
   - Indices for performance
3. **Search infrastructure** (`003_compiled_articles.sql`)
   - Full-text search indices
   - Vector embedding storage
   - Article compilation pipeline

### Content Pipeline
**File**: `lib/content/derivation.ts`
**Purpose**: Convert articles to searchable format
**Features**:
- Markdown generation from multimodal articles
- Plaintext extraction for full-text search
- Outline generation for navigation
- Vector embedding preparation

**Current Issues**:
- Stub implementations for database persistence
- `saveDerivedContent()` and `saveSectionEmbeddings()` not implemented

---

## Search Backend Implementation

### Main Search System
**File**: `lib/search.ts`
**Features**:
- PostgreSQL full-text search with ranking
- Vector similarity search using OpenAI embeddings
- Hybrid result combination and scoring
- Article metadata enrichment

**Dependencies**:
- `compiled_articles` table with content
- OpenAI API for embedding generation
- Proper database indices

### Alternative Search System
**File**: `lib/search/index.ts`
**Status**: No imports found, may be experimental
**Features**: Article-aware search with different approach

---

## External API Integrations

### OpenAI Integration
**Usage**:
- Chat completions (GPT models)
- Text embeddings for semantic search
- API key management through environment variables

**Cost Considerations**:
- Chat API: Pay per token
- Embeddings: Pay per usage
- Rate limiting and error handling needed

### GitHub OAuth
**Integration**: NextAuth provider configuration
**Features**:
- User authentication
- Profile information access
- Secure token management

---

## Database Schemas

### Community Schema
```sql
-- Posts table
CREATE TABLE community_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  author TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments table  
CREATE TABLE community_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT REFERENCES community_posts(id),
  author TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Search Schema
```sql
-- Compiled articles for search
CREATE TABLE compiled_articles (
  slug TEXT PRIMARY KEY,
  metadata JSONB NOT NULL,
  markdown TEXT NOT NULL,
  plain_text TEXT NOT NULL,
  outline JSONB NOT NULL,
  word_count INTEGER NOT NULL,
  reading_time TEXT NOT NULL,
  embedding VECTOR(1536), -- OpenAI embedding dimension
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Full-text search index
CREATE INDEX compiled_articles_fts ON compiled_articles 
USING GIN (to_tsvector('english', plain_text));

-- Vector similarity index
CREATE INDEX compiled_articles_embedding ON compiled_articles 
USING ivfflat (embedding vector_cosine_ops);
```

---

## API Response Patterns

### Standard Success Response
```typescript
{
  success: true,
  data: any,
  meta?: {
    total?: number,
    page?: number,
    limit?: number
  }
}
```

### Standard Error Response
```typescript
{
  error: string,
  code?: string,
  details?: any
}
```

### Search Response Format
```typescript
{
  results: SearchResult[],
  total: number,
  query: string,
  type: 'text' | 'vector' | 'hybrid'
}
```

---

## Performance Considerations

### Database Optimization
- **Indices**: Full-text and vector search indices
- **Connection pooling**: Vercel Postgres handles automatically
- **Query optimization**: Proper LIMIT and pagination

### Caching Strategy
- **Static content**: Next.js automatic caching
- **API responses**: No explicit caching implemented
- **Search results**: Could benefit from Redis cache

### Rate Limiting
- **OpenAI API**: No rate limiting implemented
- **Chat endpoint**: No protection against abuse
- **Search APIs**: No request throttling

---

## Security Implementation

### Authentication
- **NextAuth**: Secure session management
- **OAuth**: Secure GitHub integration
- **API protection**: Auth checks where needed

### Data Validation
- **Input sanitization**: Basic validation in place
- **SQL injection**: Using parameterized queries
- **XSS protection**: React automatic escaping

### Environment Security
- **Secrets management**: Environment variables
- **API key protection**: Not exposed to client
- **Database credentials**: Encrypted connection strings

---

## Current Backend Status

### ✅ Working APIs
- Authentication (NextAuth)
- Search (text, vector, hybrid)
- Chat assistant
- Cover upload

### ❌ Missing APIs
- Community post creation
- Community commenting
- Community voting
- Content compilation persistence

### 🟡 Incomplete APIs
- Search (needs compiled content)
- Chat (needs fallback without OpenAI)
- Community (database layer exists, routes missing)

---

## Priority Fixes

1. **Implement missing community API routes**
2. **Complete database persistence functions**
3. **Add graceful fallbacks for external services**
4. **Implement rate limiting for expensive operations**
5. **Add caching layer for search results**
