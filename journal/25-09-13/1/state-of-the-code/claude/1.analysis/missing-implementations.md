# Missing Implementations

**UI components that reference non-existent backend endpoints or functionality**

## Community API Endpoints

### POST /api/community/posts
**Called By**: `components/community/NewPostForm.tsx:21`
**Expected Request**:
```typescript
{
  title: string;
  body: string;
}
```

**Expected Response**:
```typescript
{
  success: true;
  slug: string; // For redirect to new post
}
```

**Current Status**: ❌ Route does not exist
**Frontend Behavior**: Shows generic error message
**Database Function Available**: ✅ `createCommunityPost()` in `lib/db/community.ts`

### POST /api/community/posts/[slug]/comments
**Called By**: `components/community/CommentForm.tsx:17`
**Expected Request**:
```typescript
{
  body: string;
}
```

**Expected Response**:
```typescript
{
  success: true;
  comment: {
    id: string;
    author: string;
    body: string;
    createdAt: string;
  };
}
```

**Current Status**: ❌ Route does not exist
**Frontend Behavior**: Shows error when trying to submit comments
**Database Function Available**: ✅ `addComment()` in `lib/db/community.ts`

### POST /api/community/posts/[slug]/vote
**Called By**: Vote buttons in community post listings and detail pages
**Expected Request**:
```typescript
{
  direction: 'up' | 'down';
}
```

**Expected Response**:
```typescript
{
  success: true;
  newVoteCount: number;
  userVote?: 'up' | 'down' | null;
}
```

**Current Status**: ❌ Route does not exist
**Frontend Behavior**: Buttons exist but do nothing
**Database Function**: ❌ Needs implementation in community database layer

---

## Package.json Script References

### Missing Script File
**Reference**: `package.json:20` references `scripts/articles.ts`
**Current Status**: ❌ File does not exist in repository
**Impact**: npm script fails if executed
**Solutions**:
1. Create the missing script file
2. Remove the script reference from package.json
3. Update reference to point to existing file

---

## Database Persistence Functions

### Content Compilation Stubs
**File**: `lib/db/articles.ts`

#### saveDerivedContent()
**Line**: `lib/db/articles.ts:53`
**Current Implementation**: Stub/placeholder
**Expected Functionality**:
- Save compiled article content to `compiled_articles` table
- Include markdown, plaintext, outline, and metadata
- Update existing entries or create new ones

**Usage**: 
- Content derivation pipeline
- Search index population
- Article compilation workflow

#### saveSectionEmbeddings()
**Line**: `lib/db/articles.ts:58`
**Current Implementation**: Stub/placeholder
**Expected Functionality**:
- Save vector embeddings for article sections
- Store embedding vectors for semantic search
- Associate embeddings with article content

**Usage**:
- Vector search functionality
- Semantic similarity matching
- AI-powered content recommendations

---

## Auth Integration Gaps

### API Route Protection
**Issue**: Some API routes may lack proper authentication checks
**Examples**:
- Community post creation should require authentication
- Voting should require user identification
- Comment creation should validate user session

**Current State**: Auth infrastructure exists but not applied to all routes
**Required**: Add auth checks to protected endpoints

---

## Search System Completeness

### Compiled Content Population
**Issue**: Search APIs depend on `compiled_articles` table
**Current State**: Table schema exists but likely empty
**Impact**: Search returns no results even with good queries
**Required**: 
1. Implement `saveDerivedContent()` function
2. Run content compilation for existing articles
3. Set up automatic compilation for new articles

### Vector Embeddings Generation
**Issue**: Vector search requires pre-generated embeddings
**Current State**: Embedding generation script exists but persistence is stubbed
**Impact**: Semantic search functionality unavailable
**Required**:
1. Complete `saveSectionEmbeddings()` implementation
2. Generate embeddings for existing content
3. Integrate embedding generation into content workflow

---

## Error Handling Gaps

### Missing Graceful Fallbacks
**Chat API**: Returns 503 without OpenAI key instead of degraded functionality
**Search APIs**: May return 500 instead of empty results when database unavailable
**Community**: No fallback behavior when write operations fail

**Required**: Implement graceful degradation patterns throughout

---

## Test Coverage Gaps

### Missing Test Scenarios
**Playwright Tests**: Reference non-existent article slugs
**Examples**:
- `plays/basic.test.ts:5` - References articles that may not exist
- `plays/islands.test.ts:6` - Tests islands in content that doesn't use them

**Impact**: Tests may fail or provide false results
**Required**: Update tests to match actual content or create referenced content

---

## Development vs Production Separation

### Exposed Development Tools
**Issues**:
- `/metadata-inspector` accessible in production
- `/seo-test` page available to all users
- Development utilities exposed as user features

**Security/UX Impact**: 
- Confusing for end users
- Potential information disclosure
- Cluttered user experience

**Required**: 
1. Move development tools to development-only routes
2. Add authentication for admin tools
3. Separate development and production builds

---

## Configuration Completeness

### Disabled ESLint
**File**: `.eslintrc.json.disabled`
**Issue**: Code quality tooling disabled
**Impact**: No linting during development
**Required**: Re-enable with appropriate configuration

### Missing CI/CD
**Issue**: No automated testing or deployment validation
**Impact**: Potential for broken deployments
**Required**: Set up GitHub Actions or similar CI pipeline

---

## Asset Management Gaps

### Cover Image Processing
**Issue**: While upload API exists, no image optimization or validation
**Missing**:
- Image resizing for different display sizes
- Format optimization (WebP conversion)
- Alt text management
- Broken image fallbacks

---

## Type Explorer Integration

### Scenario Path Mismatch
**File**: `app/labs/type-explorer/starter/page.tsx:11`
**Issue**: Looks for files in `/scenarios/starter/src` but repo has `/starter/src`
**Current Behavior**: Falls back to default files (works but not ideal)
**Impact**: Custom scenarios not loaded
**Required**: Align file paths or clarify intended structure

---

## Islands System Usage

### Content Integration Gap
**Issue**: Islands system is implemented but no content uses it
**Evidence**: 
- Islands are registered and tested
- No articles or pages actually embed islands
- Infrastructure exists but goes unused

**Questions**:
- Are islands intended for future content?
- Should existing content be migrated to use islands?
- Is the system experimental and should be removed?

**Required**: Clarify intended usage and either implement or remove

---

## Implementation Priority

### High Priority (Breaking User Experience)
1. **Community API routes** - Users can't create posts or comments
2. **Search content compilation** - Search returns no results
3. **Route path normalization** - Broken links throughout app

### Medium Priority (Limiting Functionality)
1. **Database persistence stubs** - Features partially work
2. **Graceful error handling** - Better than crashes
3. **Auth protection** - Security concern

### Low Priority (Quality of Life)
1. **Test coverage gaps** - Development quality
2. **Development tool separation** - UX improvement
3. **Configuration cleanup** - Maintenance

### Investigation Required
1. **Islands system usage** - Product decision needed
2. **Alternative implementations** - Architecture decision
3. **Package script references** - Cleanup vs implementation
