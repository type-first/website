# Architecture Patterns

**Common patterns, approaches, and design systems identified across the codebase**

## Component Architecture Patterns

### Multimodal Component Pattern
**Location**: `lib/multimodal/v1/`

**Pattern**:
```typescript
export const ComponentName: MultiModalComponent<Props> = multimodal<Props>()(({ modality, ...props }) => (
  <element modality={modality}>
    {/* Content that renders to both HTML and Markdown */}
  </element>
));
```

**Usage**: 
- Articles use this for dual-mode rendering (web + markdown export)
- Enables content reuse across different output formats
- Type-safe with proper TypeScript integration

**Strengths**:
- Consistent API across all content components
- Future-proof for additional modalities
- Clean separation of concerns

### Client/Server Component Split
**Examples**: 
- `MobileTopBar.tsx` (server) + `MobileTopBarClient.tsx` (client)
- Search functionality split between server and client concerns

**Pattern Benefits**:
- Optimizes bundle size and performance
- Clear separation of static vs interactive content
- Follows Next.js 13+ best practices

### Registry Pattern
**Locations**: `registry.articles.ts`, `registry.labs.tsx`

**Pattern**:
```typescript
export const registry: RegistryEntry[] = [
  {
    slug: 'identifier',
    title: 'Display Name', 
    // ... metadata
  }
];

export function getBySlug(slug: string): RegistryEntry | undefined {
  return registry.find(item => item.slug === slug);
}
```

**Usage**:
- Central metadata management
- Type-safe content discovery
- Supports pagination and filtering

## Error Handling Patterns

### Graceful Degradation Pattern
**Locations**: Throughout database and API layers

**Pattern**:
```typescript
function canUseService() {
  return !!process.env.SERVICE_URL;
}

export async function getData() {
  if (!canUseService()) {
    return demoData; // Fallback to demo content
  }
  
  try {
    return await fetchFromService();
  } catch {
    return demoData; // Graceful fallback
  }
}
```

**Benefits**:
- Development works without complex setup
- Production gracefully handles service outages
- Demo content provides realistic user experience

### API Error Handling Pattern
**Locations**: All client-side fetch operations

**Pattern**:
```typescript
try {
  const res = await fetch('/api/endpoint');
  if (!res.ok) throw new Error(data?.error || 'Operation failed');
  // Handle success
} catch (e) {
  setError(e.message || 'Something went wrong');
} finally {
  setLoading(false);
}
```

**Consistency**: Used across community forms, search, chat, etc.

## State Management Patterns

### React State with Loading/Error Pattern
**Locations**: All interactive components

**Pattern**:
```typescript
const [data, setData] = useState(initialValue);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

**UI Integration**:
- Loading states with skeletons/spinners
- Error boundaries with user-friendly messages
- Optimistic updates where appropriate

### Window Event Communication
**Location**: `components/chatControls.ts`

**Pattern**:
```typescript
// Dispatch
window.dispatchEvent(new CustomEvent('chat:open'));

// Listen
window.addEventListener('chat:open', handler);
```

**Usage**: Cross-component communication without prop drilling

## Styling and Design Patterns

### Design Constants Pattern
**Location**: `lib/design-constants.ts`

**Pattern**:
```typescript
export const SPACING = {
  CARD_GAP: 'gap-6',
  SECTION_GAP: 'gap-8',
} as const;

export const GRID = {
  ARTICLES: {
    FULL: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }
} as const;
```

**Benefits**:
- Consistent spacing and layout
- Easy to maintain and update
- Type-safe design tokens

### Responsive Design Pattern
**Approach**: Mobile-first with Tailwind breakpoints

**Pattern**:
- Base styles for mobile
- `md:` prefix for tablet adjustments
- `lg:` prefix for desktop enhancements

**Examples**:
- Navigation (sidebar on desktop, top bar on mobile)
- Grid layouts (1 column → 2 columns → 3 columns)
- Typography scaling

## Authentication Patterns

### Auth State Management
**Location**: `components/AuthProvider.tsx`

**Pattern**:
```typescript
export function useSessionSafe() {
  return useSession(); // NextAuth hook with fallbacks
}
```

### Conditional Rendering Based on Auth
**Component**: `RequireAuthButton.tsx`

**Pattern**:
```typescript
{isAuthed ? (
  <button>{children}</button>
) : (
  <Link href="/auth/signin">{children}</Link>
)}
```

**Usage**: Consistently applied across community features

## Database and API Patterns

### Database Abstraction Pattern
**Locations**: `lib/db/community.ts`, `lib/db/articles.ts`

**Pattern**:
```typescript
async function operation() {
  if (!canUseDb()) {
    return fallbackData;
  }
  
  try {
    const result = await sql`SELECT ...`;
    return processResult(result);
  } catch {
    return fallbackData;
  }
}
```

### API Route Structure Pattern
**Locations**: All `/app/api/` routes

**Pattern**:
```typescript
export async function GET/POST(request: NextRequest) {
  try {
    // Validate input
    // Process request
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: 'User-friendly message' },
      { status: 500 }
    );
  }
}
```

## Content Management Patterns

### Module-Based Article Structure
**Location**: `articles/[article-name]/`

**Structure**:
```
article.tsx          # Main composition
meta.tsx            # Metadata and SEO
section.*.tsx       # Individual sections
snippet.*.tsx       # Code examples
footer.tsx          # Article footer
index.ts            # Public exports
```

**Benefits**:
- Modular and maintainable
- Reusable components
- Clear separation of concerns

### JSON-LD Structured Data Pattern
**Location**: `lib/multimodal/v1/json-dl.mm.srv.tsx`

**Pattern**:
```typescript
<JsonLd 
  modality={modality}
  data={{
    '@type': 'Article',
    headline: metadata.title,
    // ... schema.org properties
  }}
/>
```

**SEO Benefits**:
- Search engine optimization
- Rich snippets in search results
- Structured data validation

## Testing Patterns

### Playwright Test Structure
**Location**: `plays/`

**Pattern**:
```typescript
test.describe('Feature', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/path');
    await expect(page.getByRole('button')).toBeVisible();
  });
});
```

**Coverage**:
- Basic user flows
- Interactive component testing
- Cross-browser compatibility

## Build and Development Patterns

### Script Organization
**Location**: `scripts/`

**Types**:
- **Generation**: `generate-markdown.ts` - Content export
- **Testing**: `test-seo.sh` - SEO validation
- **Database**: Migration and seeding scripts

### Configuration Management
**Pattern**: Multiple environment configurations
- `.env.example` - Template with documentation
- `.env.local.example` - Local development template
- Environment-specific overrides

---

## Pattern Quality Assessment

### Strengths
1. **Consistency**: Similar patterns used across similar features
2. **Type Safety**: Strong TypeScript integration throughout
3. **Performance**: Server/client split optimizations
4. **Maintainability**: Modular architecture with clear boundaries
5. **Accessibility**: Semantic HTML and ARIA considerations

### Areas for Improvement
1. **Error Handling**: Some inconsistencies in error message formatting
2. **State Management**: Could benefit from more centralized state for complex features
3. **Testing**: Limited test coverage for edge cases
4. **Documentation**: Patterns not formally documented

### Recommended Standards
1. **Establish pattern library** documentation
2. **Create component templates** for new features
3. **Standardize error handling** across all API routes
4. **Implement design system** documentation
