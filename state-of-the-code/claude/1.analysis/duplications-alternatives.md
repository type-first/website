# Duplications and Alternatives

**Multiple implementations of similar functionality and competing approaches**

## Article Authoring Systems

### 1. Multimodal System (Current/Preferred)
**Location**: `lib/multimodal/v1/`
**Usage**: Advanced TypeScript Patterns article
**Features**:
- Dual-mode rendering (HTML + Markdown)
- Semantic component library
- JSON-LD integration
- Type-safe composition

### 2. Schema-Based Pipeline (Alternative)
**Location**: `lib/schemas/article.ts`, `components/ArticleRenderer.tsx`
**Usage**: Database-driven content, embedding scripts
**Features**:
- Structured section definitions
- Islands component integration
- Markdown/plaintext derivation
- Vector embedding support

### 3. Legacy Component System (Deprecated)
**Location**: `lib/article-components.tsx`, `lib/article-components.ts`
**Usage**: Only in `lib/content/example-article.tsx` (unused)
**Features**:
- Simple React component wrappers
- Basic HTML element mapping
- No modality support

**Recommendation**: Multimodal is the clear winner for new content

---

## Code Highlighting Systems

### 1. Multimodal Code Component (Current)
**Location**: `lib/multimodal/v1/code.mm.srv.tsx`
**Features**:
- Server-side rendering with Shiki
- Custom theme support
- Integrated with article system
- Markdown export capability

### 2. Client-Side CodeBlock (Alternative)
**Location**: `components/CodeBlock.tsx`, `lib/highlight.ts`
**Usage**: Not currently imported anywhere
**Features**:
- Client-side highlighting
- Loading states and error handling
- File name display support

**Status**: CodeBlock appears to be unused legacy code

---

## Search Implementations

### 1. Main Search Backend
**Location**: `lib/search.ts`
**Usage**: Search dialog, API routes
**Features**:
- PostgreSQL full-text search
- Vector similarity search
- Hybrid result ranking

### 2. Article-Aware Search
**Location**: `lib/search/index.ts`
**Usage**: No direct imports found
**Features**:
- Compiled articles table integration
- Article metadata enrichment
- Complex result formatting

### 3. Search Test Lab Implementation
**Location**: `app/labs/search-test/search-test-client.tsx`
**Features**:
- Parallel search method testing
- Different response format expectations
- A/B testing interface

**Issues**: 
- Different response formats between implementations
- Potential duplication of search logic
- Lab expects flat results, APIs return nested

---

## Search Test Interfaces

### 1. Labs Search Test
**Location**: `app/labs/search-test/`
**Features**:
- Integrated with labs system
- Professional UI design
- A/B testing capabilities

### 2. Standalone Search Test
**Location**: `app/search-test/page.tsx`
**Features**:
- Similar functionality to labs version
- Different implementation approach
- Appears to be duplicate effort

**Assessment**: Two implementations of essentially the same tool

---

## Authentication Menu Components

### 1. AuthMenu (Current)
**Location**: `components/AuthMenu.tsx`
**Usage**: MobileTopBar, layout integration
**Features**:
- Session state management
- Responsive design variants
- Sign in/out functionality

### 2. AuthMenuClient (Alternative)
**Location**: `components/AuthMenuClient.tsx`
**Usage**: No imports found
**Features**:
- Similar to AuthMenu
- Client-side focused implementation

**Status**: AuthMenuClient appears unused

---

## Database Access Patterns

### 1. Direct SQL with Fallbacks
**Location**: `lib/db/community.ts`, `lib/db/articles.ts`
**Pattern**:
```typescript
if (!canUseDb()) return demoData;
const result = await sql`SELECT ...`;
```

### 2. Schema-Based Models
**Location**: `lib/schemas/article.ts`
**Pattern**:
```typescript
interface Article {
  id: string;
  content: Section[];
  // ...
}
```

**Usage**: Both patterns coexist for different purposes

---

## Static vs Dynamic Auth Handling

### 1. React Components
**Location**: `app/auth/start/[provider]/page.tsx`
**Features**:
- Full React component lifecycle
- Client-side form submission
- CSRF token handling

### 2. Static HTML Files
**Location**: `public/auth/start-github.html`, `public/auth/complete.html`
**Features**:
- Zero JavaScript
- Direct form submission
- Simpler implementation

**Assessment**: Both approaches handle OAuth flow, may be intentional redundancy

---

## Islands vs Regular Components

### 1. Islands Architecture
**Location**: `components/islands/`, `lib/islands/registry.tsx`
**Components**: `Counter`, `InteractiveChart`, `CodePlayground`
**Features**:
- Dynamic component loading
- Client-side hydration control
- Registry-based discovery

### 2. Regular Interactive Components
**Location**: Standard component usage throughout app
**Examples**: `TypeExplorer`, `SearchDialog`, `ChatSidebar`
**Features**:
- Traditional Next.js component model
- Direct imports and usage

**Status**: Islands are registered but unused in content

---

## API Route Organization

### 1. Feature-Based Grouping
**Examples**:
- `app/api/search/` - All search-related endpoints
- `app/api/community/` - Community functionality
- `app/api/auth/` - Authentication

### 2. Single-Purpose Files
**Examples**:
- `app/api/chat/route.ts` - Standalone chat endpoint
- `app/api/covers/upload/route.ts` - Cover upload

**Assessment**: Mixed organization approach, generally consistent

---

## Development vs Production Features

### 1. Production Features
- Article browsing and display
- User authentication
- Community interaction (UI)

### 2. Development Tools Exposed as Features
- `/metadata-inspector` - SEO debugging
- `/seo-test` - Social media testing
- `/labs/search-test` - Search algorithm comparison

**Issue**: Development tools accessible in production

---

## Theme and Styling Systems

### 1. Design Constants
**Location**: `lib/design-constants.ts`
**Approach**: Centralized design tokens

### 2. Component-Level Styling
**Approach**: Tailwind classes directly in components

### 3. Custom Themes
**Location**: `lib/themes/shiki-typefirst-light.json`
**Usage**: Syntax highlighting customization

**Assessment**: Consistent Tailwind usage with centralized constants

---

## Migration and Data Management

### 1. SQL Migrations
**Location**: `lib/db/migrations/`
**Files**: Community tables, compiled articles, search indices

### 2. Demo Data Systems
**Location**: `lib/community/data.ts`, YAML fixtures
**Purpose**: Development and fallback content

### 3. Content Generation Scripts
**Location**: `scripts/generate-markdown.ts`, embedding scripts
**Purpose**: Build-time content processing

---

## Assessment Summary

### Clear Winners
- **Multimodal articles** over schema-based or legacy
- **Main search backend** over article-aware alternative  
- **AuthMenu** over AuthMenuClient

### Needs Consolidation
- **Search test implementations** - pick one approach
- **Static vs dynamic auth** - clarify when to use each
- **Development tools** - separate from production features

### Unknown/Investigate
- **Islands vs regular components** - determine intended usage
- **Multiple search backends** - understand purpose of each
- **Database patterns** - ensure consistency across features

### Removal Candidates
- `lib/article-components.*` - superseded by multimodal
- `components/CodeBlock.tsx` - not imported anywhere
- `components/AuthMenuClient.tsx` - appears unused
- `app/search-test/page.tsx` - duplicate of labs version
