# Dead Code Candidates

**Components and systems that appear unused or superseded**

## Definitely Unused Components

### Legacy Article Components
**Files**:
- `lib/article-components.tsx` - React component wrappers
- `lib/article-components.ts` - Type definitions

**Evidence of Non-Usage**:
- No imports found across the codebase
- Only usage is in `lib/content/example-article.tsx` (also unused)
- Superseded by multimodal component system

**Safe to Remove**: ✅ Yes

### Unused UI Components

#### CodeBlock Component
**File**: `components/CodeBlock.tsx`
**Evidence**: 
- No imports found in any file
- Functionality superseded by `lib/multimodal/v1/code.mm.srv.tsx`
- Uses different highlighting approach (client-side vs server-side)

**Safe to Remove**: ✅ Yes

#### ComparisonCounter Component  
**File**: `components/ComparisonCounter.tsx`
**Evidence**:
- No imports found across codebase
- Appears to be demo/example component
- Not referenced in any content

**Safe to Remove**: ✅ Yes

#### AuthMenuClient Component
**File**: `components/AuthMenuClient.tsx`
**Evidence**:
- No imports found
- Duplicate functionality of `AuthMenu.tsx`
- May have been experimental alternative

**Safe to Remove**: ✅ Yes

### Example/Demo Content

#### Example Article
**File**: `lib/content/example-article.tsx`
**Evidence**:
- Uses deprecated `lib/article-components.tsx`
- No routes pointing to this content
- Appears to be documentation/example only

**Safe to Remove**: ✅ Yes

---

## Probably Unused Systems

### ArticleRenderer System
**Files**:
- `components/ArticleRenderer.tsx`
- Associated schema-based rendering pipeline

**Evidence of Limited Usage**:
- No imports found in app routes
- Not used by the advanced TypeScript article
- May still be used by database/embedding scripts

**Investigation Needed**: Check if embedding generation depends on this

**Likely Status**: Can be removed after verifying embedding script usage

### Islands System Components
**Files**:
- `components/islands/Counter.tsx`
- `components/islands/InteractiveChart.tsx` 
- `components/islands/CodePlayground.tsx`

**Evidence**:
- Components are registered in islands system
- No content currently uses these islands
- Test files reference them (suggesting they were intended to be used)
- Registry infrastructure is solid

**Assessment**: Infrastructure is good, but content usage is missing

**Recommendation**: Keep infrastructure, investigate why content doesn't use islands

---

## Duplicate Implementations

### Search Test Pages
**Files**:
- `app/search-test/page.tsx` (standalone)
- `app/labs/search-test/` (labs version)

**Assessment**:
- Very similar functionality
- Labs version is better integrated
- Standalone version may be legacy

**Recommendation**: Remove standalone version, keep labs version

### Alternate Search Backend
**File**: `lib/search/index.ts`
**Evidence**:
- No direct imports found
- Different approach than main search system
- May have been experimental

**Status**: Investigate if this is intended as future replacement

---

## Configuration and Build Files

### Disabled Configs
**File**: `.eslintrc.json.disabled`
**Evidence**: Filename suggests it's intentionally disabled
**Safe to Remove**: ✅ Yes (or clarify why disabled)

### Temporary Files
**Files**:
- `tmp/advanced-typescript-patterns-react.md`
- `test-output.md`

**Evidence**: Appear to be build artifacts or temporary outputs
**Safe to Remove**: ✅ Yes (should be in .gitignore)

### Unused Package Scripts
**Issue**: `package.json` references `scripts/articles.ts` which doesn't exist
**Evidence**: File not found in repository
**Action**: Remove script reference or create missing file

---

## Development Tools in Production

### Metadata Inspector
**File**: `app/metadata-inspector/page.tsx`
**Assessment**:
- Developer tool for SEO debugging
- Exposed as production route
- May be intentional for content team use

**Recommendation**: Move to development-only or protect with auth

### SEO Test Page
**File**: `app/seo-test/page.tsx`
**Assessment**:
- Links to external social media debugging tools
- Primarily for developers
- Accessible to all users

**Recommendation**: Move to development environment

---

## Static Assets

### Auth Flow HTML Files
**Files**:
- `public/auth/start-github.html`
- `public/auth/complete.html`

**Assessment**:
- May be fallbacks for React auth components
- Could be legacy from previous auth implementation
- Still referenced in some configurations

**Status**: Verify if these are still needed for OAuth flow

### Generic SVG Icons
**Files**: Various SVG files in `public/`
**Assessment**:
- Standard Next.js template icons (file.svg, globe.svg, etc.)
- May not be used in actual UI
- Check if referenced in components

---

## Database and Migration Files

### Old Migration Approaches
**Investigation Needed**: 
- Check if all migration files in `lib/db/migrations/` are current
- Verify no duplicate migration approaches

### Fixture Data
**Files**: YAML files in `lib/db/fixtures/`
**Assessment**:
- Used for demo content when database unavailable
- Probably should be kept for development

---

## Experimental Code

### TypeScript Experiments
**File**: `notes/power-set.ts`
**Assessment**:
- Advanced TypeScript type experiments
- Not imported or used in application
- May be research/learning code

**Recommendation**: Keep in notes but ensure it doesn't build with app

---

## API Routes

### Missing Route Implementations
**Issue**: Components call API routes that don't exist
**Files affected**: Community forms
**Assessment**: These are missing implementations, not dead code

### Placeholder Routes
**Investigation needed**: Check if any routes are placeholder implementations

---

## Summary by Confidence Level

### High Confidence - Remove Immediately
- `lib/article-components.tsx` and `lib/article-components.ts`
- `lib/content/example-article.tsx`
- `components/CodeBlock.tsx`
- `components/ComparisonCounter.tsx`
- `components/AuthMenuClient.tsx`
- `tmp/` directory contents
- `.eslintrc.json.disabled`

### Medium Confidence - Investigate First
- `components/ArticleRenderer.tsx` (check embedding script usage)
- `app/search-test/page.tsx` (vs labs version)
- `lib/search/index.ts` (alternate search backend)
- `public/auth/*.html` (OAuth fallbacks)

### Low Confidence - Keep for Now
- Islands system components (infrastructure is good)
- Development tool pages (may be intentional)
- Notes and experimental code (learning/research value)

### Requires Product Decision
- Whether to expose dev tools in production
- Whether islands system should be used in content
- Whether to maintain multiple auth flow approaches

---

## Removal Strategy

1. **Phase 1**: Remove high-confidence dead code
2. **Phase 2**: Investigate medium-confidence items
3. **Phase 3**: Make product decisions about questionable items
4. **Phase 4**: Clean up build processes and configurations

**Risk Mitigation**: 
- Create feature branch for removals
- Test thoroughly after each removal
- Keep git history for easy reversal
