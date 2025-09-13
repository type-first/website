# Tier 2: Features That Need Work But Keep UI

**Features with good UI/UX but incomplete or problematic backend functionality**

## Community System (Backend Issues)

### Current Status
- **UI**: ✅ Complete, polished, production-ready
- **Backend**: ❌ Incomplete API implementations

### What Works
- **Database Layer**: `lib/db/community.ts` with graceful fallbacks
- **Demo Data**: `lib/community/data.ts` provides working content
- **Migrations**: SQL schema exists (`lib/db/migrations/002_community.sql`)
- **UI Components**: All forms and interactions are properly implemented

### What's Missing
- **API Routes**: Forms call endpoints that don't exist
  - `POST /api/community/posts` (called by `NewPostForm.tsx:21`)
  - `POST /api/community/posts/[slug]/comments` (called by `CommentForm.tsx:17`)
  - `POST /api/community/posts/[slug]/vote` (voting buttons are UI-only)
- **Database Persistence**: Write operations not implemented
- **Auth Enforcement**: API routes need authentication checks

### Required Changes
1. **Implement missing API routes** with proper auth validation
2. **Wire to existing database functions** in `lib/db/community.ts`
3. **Add voting functionality** (database writes + optimistic UI)
4. **Graceful degradation** when database unavailable (return 503 with friendly message)

## Search System

### Current Status
- **UI**: ✅ Beautiful modal dialog with live search
- **API**: 🟡 Implemented but inconsistent
- **Backend**: ❌ Database dependencies and format mismatches

### What Works
- **Search Dialog**: `components/SearchDialog.tsx` - excellent UX
- **API Structure**: Separate endpoints for different search types
- **Result Display**: Good visual hierarchy and result formatting

### Issues Identified
1. **Route Inconsistencies**: Mix of `/article/` vs `/articles/` in links
2. **Database Dependencies**: Search fails when compiled articles table missing
3. **Response Format Variations**: Different APIs return different result shapes
4. **Missing Graceful Fallbacks**: 500 errors instead of empty results

### Required Changes
1. **Normalize all links** to use `/article/[slug]` consistently
2. **Add parameter validation** and better error handling
3. **Implement graceful fallbacks** when database unavailable
4. **Standardize response formats** across search endpoints

## Search Test Lab

### Current Status
- **UI**: ✅ Excellent A/B testing interface
- **Integration**: ❌ Response format mismatches

### What Works
- **Comparison Interface**: Side-by-side search method testing
- **Toggle Controls**: Enable/disable different search approaches
- **Developer-focused**: Good debugging and analysis tools

### Issues Identified
1. **Response Format Mismatch**: Lab expects flat results, API returns nested
2. **Vector Search Blocking**: Client prevents vector-only mode
3. **Link Path Issues**: Same `/article/` vs `/articles/` problem

### Required Changes
1. **Normalize API responses** or add client-side mapping
2. **Enable vector search path** with proper embedding generation
3. **Fix link consistency** across all search implementations

## Chat Assistant

### Current Status
- **UI**: ✅ Excellent chat interface with article suggestions
- **Integration**: 🟡 Works but has dependencies
- **Backend**: ❌ Cost and reliability concerns

### What Works
- **Chat Interface**: `components/ChatSidebar.tsx` - smooth UX
- **Window Events**: Clean cross-component communication system
- **Article Suggestions**: Good integration with search results
- **Message History**: Proper conversation state management

### Issues Identified
1. **OpenAI Dependency**: Requires API key, costs money per interaction
2. **Search Integration**: Uses placeholder database functions
3. **Link Inconsistencies**: Suggestions use wrong article URLs
4. **No Fallback**: Returns 503 without API key instead of degraded experience

### Required Changes
1. **Add no-API fallback**: Return text-only suggestions when OpenAI unavailable
2. **Use unified search backend**: Connect to same search system as dialog
3. **Fix suggestion links** to use correct article routes
4. **Add rate limiting** and safety measures

## Content Compilation System

### Current Status
- **Infrastructure**: ✅ Well-designed pipeline architecture
- **Implementation**: ❌ Key functions are stubs

### What Works
- **Migration Schema**: `lib/db/migrations/003_compiled_articles.sql`
- **Derivation Pipeline**: `lib/content/derivation.ts` - good architecture
- **Embeddings Script**: `lib/db/scripts/generate-embeddings.ts`

### Issues Identified
1. **Stub Functions**: `saveDerivedContent` and `saveSectionEmbeddings` not implemented
2. **No Content Population**: Compiled articles table remains empty
3. **Search Depends On This**: Search results meaningless without compiled content

### Required Changes
1. **Implement persistence functions** with proper upserts
2. **Populate compiled articles table** from existing content
3. **Connect to multimodal articles** for unified content pipeline

## Cross-Cutting Issues

### Route Normalization Needed
**Affected Files**:
- `components/SearchDialog.tsx:88`
- `app/labs/search-test/search-test-client.tsx:148`
- `app/api/chat/route.ts:75`
- `app/seo-test/page.tsx:24`
- `app/metadata-inspector/page.tsx:68`

**Solution**: Standardize on `/article/[slug]` everywhere

### Type Explorer Path Mismatch
**Issue**: `app/labs/type-explorer/starter/page.tsx:11` looks for scenarios in wrong directory
**Current**: Falls back to default files (works but not tight)
**Fix**: Align path or intentionally use fallback

---

## Preservation Strategy

### Keep These UI Patterns
1. **Modal Dialog System** - Search dialog interaction model
2. **Form Handling** - Community form UX and error states
3. **Chat Interface** - Message bubbles and suggestion cards
4. **A/B Testing UI** - Search lab comparison interface
5. **Loading States** - Consistent async operation feedback

### Backend Refactoring Approach
1. **Start with missing API routes** - Low risk, high impact
2. **Add graceful degradation** - Better than broken functionality
3. **Unify search backends** - Eliminate duplicate implementations
4. **Implement stub functions** - Complete the existing architecture

### Success Criteria
- All UI functionality works (even if simplified)
- No 500 errors from missing endpoints
- Consistent link behavior across the app
- Graceful fallbacks when external services unavailable
