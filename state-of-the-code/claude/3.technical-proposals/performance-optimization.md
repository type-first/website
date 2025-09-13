# Performance Optimization Strategy

**Comprehensive approach to improving application performance across all layers**

## Current Performance Analysis

### Baseline Measurements

**Frontend Performance (Current State)**
```
Bundle Analysis:
├── Initial Bundle: ~450KB (estimated)
├── Type Explorer: ~180KB (Monaco Editor)
├── Search Components: ~45KB  
├── Auth System: ~25KB
└── Multimodal System: ~35KB

Load Times (Development):
├── Cold Start: ~3-4 seconds
├── Hot Reload: ~800ms
├── Type Explorer Load: ~1.2 seconds
└── Search Response: ~300-800ms
```

**Backend Performance (Current State)**
```
Database Queries:
├── Article Retrieval: ~50-150ms
├── Search (Text): ~200-500ms  
├── Search (Vector): ~Not implemented
└── Community Queries: ~100-300ms

API Response Times:
├── /api/search/text: ~400-700ms
├── /api/chat: ~1-3 seconds (OpenAI dependent)
├── /api/auth/*: ~100-200ms
└── Static Content: ~50-100ms
```

### Performance Bottlenecks Identified

**Frontend Issues:**
1. **Monaco Editor Loading** - 180KB JavaScript bundle loaded synchronously
2. **Search Debouncing** - Inconsistent implementation across components  
3. **Component Re-renders** - Unnecessary re-renders in Type Explorer
4. **Image Optimization** - No responsive images or modern formats
5. **Code Splitting** - Limited route-based and component-based splitting

**Backend Issues:**
1. **Database N+1 Queries** - Article metadata fetched separately from content
2. **Missing Caching** - No caching layer for frequently accessed content
3. **Search Performance** - Text search not optimized, vector search incomplete
4. **Bundle Analysis** - No monitoring of bundle size growth

## Frontend Performance Optimization

### 1. Advanced Code Splitting Strategy

#### Route-Based Splitting with Preloading
```typescript
// lib/ui/routing/lazy-routes.ts
const TypeExplorerLazy = lazy(() => 
  import('../patterns/TypeExplorer').then(module => ({
    default: module.TypeExplorer
  }))
);

const SearchTestLazy = lazy(() =>
  import('../patterns/SearchTest').then(module => ({
    default: module.SearchTest  
  }))
);

// Intelligent preloading based on user behavior
export function useIntelligentPreloading() {
  const router = useRouter();
  
  useEffect(() => {
    // Preload Type Explorer when user visits labs page
    if (router.pathname === '/labs') {
      const preloadTimer = setTimeout(() => {
        import('../patterns/TypeExplorer');
      }, 2000); // Delay to avoid blocking initial load
      
      return () => clearTimeout(preloadTimer);
    }
  }, [router.pathname]);

  // Preload on link hover
  useEffect(() => {
    const handleLinkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (href?.includes('/labs/type-explorer')) {
        import('../patterns/TypeExplorer');
      }
    };

    document.addEventListener('mouseover', handleLinkHover);
    return () => document.removeEventListener('mouseover', handleLinkHover);
  }, []);
}
```

#### Component-Level Splitting
```typescript
// lib/ui/patterns/TypeExplorer/TypeExplorer.tsx - Split into smaller chunks
const MonacoEditor = lazy(() => 
  import('@monaco-editor/react').then(module => ({
    default: module.default
  }))
);

const TypeDiagnostics = lazy(() =>
  import('./components/TypeDiagnostics').then(module => ({
    default: module.TypeDiagnostics
  }))
);

const FileExplorer = lazy(() =>
  import('./components/FileExplorer').then(module => ({
    default: module.FileExplorer
  }))
);

export function TypeExplorer({ initialFiles }: TypeExplorerProps) {
  const [isEditorReady, setIsEditorReady] = useState(false);
  
  // Progressive loading - load core UI first, then heavy components
  return (
    <div className="type-explorer">
      <div className="grid grid-cols-4 gap-6">
        {/* File explorer loads immediately (lightweight) */}
        <Suspense fallback={<FileExplorerSkeleton />}>
          <FileExplorer files={files} onFileSelect={setActiveFile} />
        </Suspense>
        
        {/* Monaco editor loads after file explorer */}
        <div className="col-span-2">
          <Suspense fallback={<MonacoEditorSkeleton />}>
            <MonacoEditor
              onMount={() => setIsEditorReady(true)}
              {...editorProps}
            />
          </Suspense>
        </div>
        
        {/* Diagnostics only loads after editor is ready */}
        <div>
          {isEditorReady ? (
            <Suspense fallback={<DiagnosticsSkeleton />}>
              <TypeDiagnostics markers={markers} />
            </Suspense>
          ) : (
            <DiagnosticsSkeleton />
          )}
        </div>
      </div>
    </div>
  );
}
```

### 2. React Performance Optimization

#### Memoization Strategy
```typescript
// lib/ui/patterns/TypeExplorer/optimized-components.tsx
export const OptimizedFileList = memo(function FileList({ 
  files, 
  activeFile, 
  onFileSelect 
}: FileListProps) {
  // Memoize expensive calculations
  const fileStats = useMemo(() => 
    files.map(file => ({
      ...file,
      errorCount: countErrors(file.markers),
      lineCount: file.content.split('\n').length
    })), 
    [files]
  );

  // Virtualization for large file lists
  const virtualizer = useVirtual({
    size: files.length,
    parentRef: scrollElementRef,
    estimateSize: useCallback(() => 40, []),
    overscan: 5
  });

  return (
    <div ref={scrollElementRef} className="file-list">
      <div style={{ height: virtualizer.totalSize }}>
        {virtualizer.virtualItems.map(virtualRow => {
          const file = fileStats[virtualRow.index];
          return (
            <div
              key={file.path}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: virtualRow.size,
                transform: `translateY(${virtualRow.start}px)`
              }}
            >
              <FileListItem 
                file={file}
                isActive={file.path === activeFile}
                onSelect={onFileSelect}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

// Memoized file item with shallow comparison
export const FileListItem = memo(function FileListItem({
  file,
  isActive,
  onSelect
}: FileListItemProps) {
  const handleClick = useCallback(() => {
    onSelect(file.path);
  }, [file.path, onSelect]);

  return (
    <button
      className={`file-item ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      <span className="file-name">{file.name}</span>
      {file.errorCount > 0 && (
        <span className="error-badge">{file.errorCount}</span>
      )}
    </button>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better memoization
  return (
    prevProps.file.path === nextProps.file.path &&
    prevProps.file.errorCount === nextProps.file.errorCount &&
    prevProps.isActive === nextProps.isActive
  );
});
```

#### Debouncing and Throttling
```typescript
// lib/utilities/performance/debouncing.ts
export function useOptimizedDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options: {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
  } = {}
): T {
  const { leading = false, trailing = true, maxWait } = options;
  
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const maxTimeoutRef = useRef<NodeJS.Timeout>();
  const lastCallTimeRef = useRef<number>();
  const lastInvokeTimeRef = useRef<number>(0);

  // Update callback ref when callback changes
  callbackRef.current = callback;

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const isInvoking = lastCallTimeRef.current === undefined;
      
      lastCallTimeRef.current = now;

      if (isInvoking && leading) {
        lastInvokeTimeRef.current = now;
        return callbackRef.current(...args);
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (maxWait !== undefined && !maxTimeoutRef.current) {
        maxTimeoutRef.current = setTimeout(() => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          lastInvokeTimeRef.current = Date.now();
          callbackRef.current(...args);
          maxTimeoutRef.current = undefined;
        }, maxWait);
      }

      timeoutRef.current = setTimeout(() => {
        if (trailing) {
          lastInvokeTimeRef.current = Date.now();
          callbackRef.current(...args);
        }
        if (maxTimeoutRef.current) {
          clearTimeout(maxTimeoutRef.current);
          maxTimeoutRef.current = undefined;
        }
      }, delay);
    },
    [delay, leading, trailing, maxWait]
  ) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (maxTimeoutRef.current) clearTimeout(maxTimeoutRef.current);
    };
  }, []);

  return debouncedCallback;
}

// Usage in Type Explorer
export function useTypeExplorerOptimizations() {
  // Optimized diagnostics update - max 2 updates per second
  const updateDiagnostics = useOptimizedDebounce(
    async (files: ExplorerFile[]) => {
      const diagnostics = await generateDiagnostics(files);
      setMarkers(diagnostics);
    },
    300,
    { trailing: true, maxWait: 500 }
  );

  // Optimized content change - immediate feedback with debounced save
  const handleContentChange = useOptimizedDebounce(
    (content: string, path: string) => {
      saveFileContent(path, content);
      updateDiagnostics(files);
    },
    150,
    { leading: true, trailing: true }
  );

  return { updateDiagnostics, handleContentChange };
}
```

### 3. Asset Optimization

#### Image Optimization Pipeline
```typescript
// scripts/optimize-assets.ts
export class AssetOptimizer {
  async optimizeImages(): Promise<void> {
    const images = await glob('public/images/**/*.{jpg,jpeg,png}');
    
    for (const imagePath of images) {
      await this.generateResponsiveImages(imagePath);
      await this.generateModernFormats(imagePath);
    }
  }

  private async generateResponsiveImages(imagePath: string): Promise<void> {
    const sizes = [400, 800, 1200, 1600, 2400];
    const basePath = imagePath.replace(/\.[^.]+$/, '');
    const ext = path.extname(imagePath);

    for (const width of sizes) {
      // Generate responsive variants
      await sharp(imagePath)
        .resize(width, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({ quality: 85, progressive: true })
        .toFile(`${basePath}-${width}w${ext}`);
    }
  }

  private async generateModernFormats(imagePath: string): Promise<void> {
    const basePath = imagePath.replace(/\.[^.]+$/, '');
    
    // Generate AVIF (best compression)
    await sharp(imagePath)
      .avif({ quality: 70 })
      .toFile(`${basePath}.avif`);
    
    // Generate WebP (good compatibility)
    await sharp(imagePath)
      .webp({ quality: 80 })
      .toFile(`${basePath}.webp`);
  }
}

// Enhanced Next.js Image component
export function OptimizedImage({
  src,
  alt,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  
  if (imageError) {
    return <ImagePlaceholder alt={alt} className={className} />;
  }

  return (
    <NextImage
      src={src}
      alt={alt}
      className={className}
      priority={priority}
      sizes={sizes}
      quality={85}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..." // Low-quality placeholder
      onError={() => setImageError(true)}
      style={{
        objectFit: 'cover',
        objectPosition: 'center'
      }}
    />
  );
}
```

#### Bundle Size Monitoring
```typescript
// scripts/bundle-analysis.ts
export class BundleAnalyzer {
  async analyzeBundle(): Promise<BundleReport> {
    // Use webpack-bundle-analyzer programmatically
    const stats = await this.getWebpackStats();
    const analysis = this.analyzeStats(stats);
    
    return {
      totalSize: analysis.totalSize,
      chunkSizes: analysis.chunkSizes,
      duplicates: this.findDuplicates(stats),
      recommendations: this.generateRecommendations(analysis)
    };
  }

  private generateRecommendations(analysis: BundleAnalysis): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Check for oversized chunks
    for (const [chunkName, size] of Object.entries(analysis.chunkSizes)) {
      if (size > 250 * 1024) { // 250KB threshold
        recommendations.push({
          type: 'large-chunk',
          message: `Chunk ${chunkName} is ${formatBytes(size)}. Consider code splitting.`,
          severity: 'warning'
        });
      }
    }

    // Check for unused dependencies
    const unusedDeps = this.findUnusedDependencies();
    if (unusedDeps.length > 0) {
      recommendations.push({
        type: 'unused-dependencies',
        message: `Unused dependencies found: ${unusedDeps.join(', ')}`,
        severity: 'info'
      });
    }

    return recommendations;
  }

  async monitorBundleSize(): Promise<void> {
    const currentAnalysis = await this.analyzeBundle();
    const previousAnalysis = await this.loadPreviousAnalysis();

    if (previousAnalysis) {
      const sizeDiff = currentAnalysis.totalSize - previousAnalysis.totalSize;
      const percentChange = (sizeDiff / previousAnalysis.totalSize) * 100;

      if (percentChange > 5) { // 5% increase threshold
        console.warn(`⚠️ Bundle size increased by ${formatBytes(sizeDiff)} (${percentChange.toFixed(1)}%)`);
        
        if (process.env.CI) {
          // Fail CI if bundle size increased significantly
          process.exit(1);
        }
      }
    }

    await this.saveAnalysis(currentAnalysis);
  }
}
```

## Backend Performance Optimization

### 1. Database Performance

#### Query Optimization
```sql
-- Enhanced indexes for common query patterns
CREATE INDEX CONCURRENTLY idx_articles_search_optimized 
ON articles_v2 USING GIN(
  (setweight(to_tsvector('english', title), 'A') || 
   setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
   setweight(to_tsvector('english', content->>'plainText'), 'C'))
);

-- Partial indexes for performance
CREATE INDEX CONCURRENTLY idx_articles_published_recent 
ON articles_v2 (created_at DESC) 
WHERE status = 'published' AND created_at > NOW() - INTERVAL '1 year';

-- Composite indexes for common filters
CREATE INDEX CONCURRENTLY idx_articles_tags_status_date
ON articles_v2 USING GIN(tags) 
WHERE status = 'published';

-- Vector search optimization
CREATE INDEX CONCURRENTLY idx_articles_embedding_cosine
ON articles_v2 USING ivfflat (content_embedding vector_cosine_ops)
WITH (lists = 100);
```

#### Query Optimization Implementation
```typescript
// lib/infrastructure/database/optimized-queries.ts
export class OptimizedArticleRepository implements ContentRepository {
  // Optimized article search with proper indexing
  async searchArticles(params: SearchParams): Promise<SearchResult[]> {
    const {
      query,
      tags = [],
      limit = 10,
      offset = 0,
      sortBy = 'relevance'
    } = params;

    // Use different strategies based on query type
    if (query && query.length > 2) {
      return this.searchByFullText(query, tags, limit, offset, sortBy);
    } else if (tags.length > 0) {
      return this.searchByTags(tags, limit, offset, sortBy);
    } else {
      return this.getRecentArticles(limit, offset);
    }
  }

  private async searchByFullText(
    query: string,
    tags: string[],
    limit: number,
    offset: number,
    sortBy: string
  ): Promise<SearchResult[]> {
    const tagFilter = tags.length > 0 ? 'AND tags && $3' : '';
    const orderClause = this.buildOrderClause(sortBy);
    
    const result = await this.db.query(`
      SELECT 
        a.*,
        ts_rank(
          setweight(to_tsvector('english', a.title), 'A') ||
          setweight(to_tsvector('english', coalesce(a.description, '')), 'B') ||
          setweight(to_tsvector('english', a.content->>'plainText'), 'C'),
          plainto_tsquery('english', $1)
        ) as rank,
        ts_headline(
          'english',
          a.content->>'plainText',
          plainto_tsquery('english', $1),
          'MaxWords=50, MinWords=20'
        ) as snippet
      FROM articles_v2 a
      WHERE 
        a.status = 'published'
        AND (
          setweight(to_tsvector('english', a.title), 'A') ||
          setweight(to_tsvector('english', coalesce(a.description, '')), 'B') ||
          setweight(to_tsvector('english', a.content->>'plainText'), 'C')
        ) @@ plainto_tsquery('english', $1)
        ${tagFilter}
      ${orderClause}
      LIMIT $${tags.length > 0 ? 4 : 3} OFFSET $${tags.length > 0 ? 5 : 4}
    `, tags.length > 0 ? [query, limit, tags, offset] : [query, limit, offset]);

    return result.rows.map(row => this.mapToSearchResult(row));
  }
}
```

### 2. Caching Strategy

#### Multi-Layer Caching Implementation
```typescript
// lib/infrastructure/cache/multi-layer-cache.ts
export class MultiLayerCache implements CacheAdapter {
  private l1Cache: LRUCache<string, any>; // Memory cache
  private l2Cache: Redis; // Redis cache
  private l3Cache: DatabaseCache; // Database cache for expensive queries

  constructor(config: CacheConfig) {
    this.l1Cache = new LRUCache({
      max: config.memoryMaxItems,
      maxAge: config.memoryTTL
    });
    this.l2Cache = new Redis(config.redisUrl);
    this.l3Cache = new DatabaseCache(config.db);
  }

  async get<T>(key: string): Promise<T | null> {
    // L1: Memory cache (fastest, ~1-5ms)
    const l1Result = this.l1Cache.get(key);
    if (l1Result !== undefined) {
      return l1Result;
    }

    // L2: Redis cache (fast, ~5-20ms)
    const l2Result = await this.l2Cache.get(key);
    if (l2Result) {
      const parsed = JSON.parse(l2Result);
      this.l1Cache.set(key, parsed); // Populate L1
      return parsed;
    }

    // L3: Database cache for expensive computed results
    const l3Result = await this.l3Cache.get(key);
    if (l3Result) {
      await this.l2Cache.setex(key, 1800, JSON.stringify(l3Result)); // 30min Redis
      this.l1Cache.set(key, l3Result); // Populate L1
      return l3Result;
    }

    return null;
  }

  async set<T>(key: string, value: T, ttl: number = 300): Promise<void> {
    // Set in all layers with appropriate TTLs
    this.l1Cache.set(key, value, Math.min(ttl * 1000, 60000)); // Max 1min in memory
    await this.l2Cache.setex(key, ttl, JSON.stringify(value));
    
    // Store expensive computations in database cache
    if (this.isExpensiveComputation(key)) {
      await this.l3Cache.set(key, value, ttl * 6); // Longer TTL for expensive operations
    }
  }

  private isExpensiveComputation(key: string): boolean {
    return key.startsWith('search:') || 
           key.startsWith('embedding:') ||
           key.startsWith('compilation:');
  }
}

// Smart cache invalidation
export class CacheInvalidationManager {
  constructor(private cache: MultiLayerCache) {}

  async invalidateByPattern(pattern: string): Promise<void> {
    // Tag-based invalidation
    const tags = this.extractTags(pattern);
    
    for (const tag of tags) {
      await this.cache.invalidateByTag(tag);
    }
  }

  async invalidateArticle(slug: string): Promise<void> {
    // Invalidate all article-related caches
    const patterns = [
      `article:${slug}:*`,
      `search:*`, // Search results might include this article
      `recent:articles:*`,
      `compilation:${slug}:*`
    ];

    await Promise.all(
      patterns.map(pattern => this.cache.invalidateByPattern(pattern))
    );
  }
}
```

#### Cache-Aware Service Layer
```typescript
// lib/core/content/cached-content-service.ts
export class CachedContentService implements ContentService {
  constructor(
    private baseService: ContentService,
    private cache: MultiLayerCache
  ) {}

  async getArticle(slug: string): Promise<Article | null> {
    const cacheKey = `article:${slug}:full`;
    
    // Try cache first
    const cached = await this.cache.get<Article>(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch from base service
    const article = await this.baseService.getArticle(slug);
    if (article) {
      // Cache with appropriate TTL based on article status
      const ttl = article.status === 'published' ? 3600 : 300; // 1hr vs 5min
      await this.cache.set(cacheKey, article, ttl);
    }

    return article;
  }

  async searchArticles(params: SearchParams): Promise<SearchResult[]> {
    // Create cache key from search parameters
    const cacheKey = `search:${this.hashSearchParams(params)}`;
    
    const cached = await this.cache.get<SearchResult[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const results = await this.baseService.searchArticles(params);
    
    // Cache search results for 5 minutes
    await this.cache.set(cacheKey, results, 300);
    
    return results;
  }

  private hashSearchParams(params: SearchParams): string {
    // Create deterministic hash of search parameters
    const normalized = {
      query: params.query?.toLowerCase().trim(),
      tags: params.tags?.sort(),
      limit: params.limit,
      offset: params.offset,
      sortBy: params.sortBy
    };
    
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(normalized))
      .digest('hex')
      .substring(0, 16);
  }
}
```

### 3. API Performance Optimization

#### Response Compression and Optimization
```typescript
// lib/infrastructure/api/performance-middleware.ts
export function createPerformanceMiddleware(): NextMiddleware {
  return async (request: NextRequest) => {
    const start = Date.now();
    
    // Add performance headers
    const response = NextResponse.next();
    
    // Enable compression for large responses
    if (request.headers.get('accept-encoding')?.includes('gzip')) {
      response.headers.set('content-encoding', 'gzip');
    }

    // Add caching headers based on route
    const cacheHeaders = this.getCacheHeaders(request.pathname);
    Object.entries(cacheHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    // Add performance timing
    const duration = Date.now() - start;
    response.headers.set('x-response-time', `${duration}ms`);
    
    // Log slow requests
    if (duration > 1000) {
      console.warn(`Slow API request: ${request.pathname} took ${duration}ms`);
    }

    return response;
  };
}

// Optimized API route structure
export class OptimizedSearchAPI {
  constructor(
    private searchService: SearchService,
    private cache: CacheAdapter
  ) {}

  async handleSearchRequest(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url);
      const query = searchParams.get('q');
      const limit = parseInt(searchParams.get('limit') || '10');
      
      // Validate and sanitize input
      const validatedParams = this.validateSearchParams({ query, limit });
      
      // Check cache first
      const cacheKey = `api:search:${this.hashParams(validatedParams)}`;
      const cached = await this.cache.get(cacheKey);
      
      if (cached) {
        return NextResponse.json(cached, {
          headers: {
            'x-cache': 'HIT',
            'cache-control': 'public, max-age=300'
          }
        });
      }

      // Perform search
      const results = await this.searchService.search(validatedParams);
      
      // Optimize response payload
      const optimizedResponse = this.optimizeSearchResponse(results);
      
      // Cache the response
      await this.cache.set(cacheKey, optimizedResponse, 300);
      
      return NextResponse.json(optimizedResponse, {
        headers: {
          'x-cache': 'MISS',
          'cache-control': 'public, max-age=300'
        }
      });
      
    } catch (error) {
      return this.handleAPIError(error);
    }
  }

  private optimizeSearchResponse(results: SearchResult[]): OptimizedSearchResponse {
    // Remove unnecessary fields for API response
    return {
      results: results.map(result => ({
        slug: result.article.slug,
        title: result.article.title,
        description: result.article.description,
        tags: result.article.tags,
        publishedAt: result.article.publishedAt,
        readingTime: result.article.readingTime,
        snippet: result.snippet.substring(0, 200), // Limit snippet length
        score: Math.round(result.score * 100) / 100 // Round score
      })),
      total: results.length,
      timestamp: Date.now()
    };
  }
}
```

## Performance Monitoring

### 1. Real-Time Performance Tracking

```typescript
// lib/infrastructure/monitoring/performance-monitor.ts
export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  
  async trackAPICall(
    endpoint: string,
    operation: () => Promise<any>
  ): Promise<any> {
    const start = performance.now();
    const memoryBefore = process.memoryUsage();
    
    try {
      const result = await operation();
      
      this.recordMetric(endpoint, {
        duration: performance.now() - start,
        success: true,
        memoryDelta: process.memoryUsage().heapUsed - memoryBefore.heapUsed,
        timestamp: Date.now()
      });
      
      return result;
    } catch (error) {
      this.recordMetric(endpoint, {
        duration: performance.now() - start,
        success: false,
        error: error.message,
        timestamp: Date.now()
      });
      
      throw error;
    }
  }

  getPerformanceReport(): PerformanceReport {
    const report: PerformanceReport = {
      endpoints: {},
      summary: {
        totalRequests: 0,
        averageResponseTime: 0,
        errorRate: 0
      }
    };

    for (const [endpoint, metrics] of this.metrics) {
      const successfulMetrics = metrics.filter(m => m.success);
      const totalRequests = metrics.length;
      const successRate = successfulMetrics.length / totalRequests;
      
      report.endpoints[endpoint] = {
        totalRequests,
        averageResponseTime: this.calculateAverage(successfulMetrics.map(m => m.duration)),
        p95ResponseTime: this.calculatePercentile(successfulMetrics.map(m => m.duration), 95),
        successRate,
        errorRate: 1 - successRate
      };
      
      report.summary.totalRequests += totalRequests;
    }

    return report;
  }
}
```

### 2. Bundle Size Monitoring

```typescript
// scripts/performance-ci.ts
export class PerformanceCI {
  async checkPerformanceBudgets(): Promise<void> {
    const budgets = {
      initialBundle: 500 * 1024, // 500KB
      totalBundle: 2 * 1024 * 1024, // 2MB
      typeExplorer: 250 * 1024, // 250KB
      searchComponents: 100 * 1024 // 100KB
    };

    const analysis = await this.analyzeBundles();
    
    const violations: string[] = [];
    
    if (analysis.initialBundle > budgets.initialBundle) {
      violations.push(`Initial bundle exceeds budget: ${formatBytes(analysis.initialBundle)} > ${formatBytes(budgets.initialBundle)}`);
    }

    if (violations.length > 0) {
      console.error('❌ Performance budget violations:');
      violations.forEach(violation => console.error(`  ${violation}`));
      
      if (process.env.CI) {
        process.exit(1);
      }
    } else {
      console.log('✅ All performance budgets met');
    }
  }
}
```

This comprehensive performance optimization strategy addresses both frontend and backend performance issues while providing monitoring capabilities to maintain performance over time. The approach builds on existing strengths while eliminating bottlenecks and establishing sustainable performance practices.
