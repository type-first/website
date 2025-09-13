# TypeScript Architecture Enhancement

**Comprehensive strategy for improving TypeScript usage, type safety, and developer experience**

## Current TypeScript Assessment

### Strengths in Current Implementation

**Excellent Type Patterns Found:**
```typescript
// Advanced patterns already in use:
type ModalityRenderer<T> = (content: T, context: RenderContext) => ReactNode;
type MultimodalComponent<P = {}> = React.ComponentType<P & MultimodalProps>;

// Sophisticated generic patterns in Type Explorer:
interface ExplorerFile<T = any> {
  path: string;
  content: string;
  language: string;
  markers?: DiagnosticMarker[];
  metadata?: T;
}

// Well-structured API types:
interface SearchResult {
  article: Article;
  snippet: string; 
  score: number;
  matches: SearchMatch[];
}
```

**Current TypeScript Configuration Analysis:**
```json
// tsconfig.json strengths:
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true, // Excellent safety
    "exactOptionalPropertyTypes": true, // Strict optional handling
    "noImplicitReturns": true,
    "noImplicitOverride": true
  }
}
```

### Areas for Enhancement

**Type Safety Gaps Identified:**
1. **Runtime Type Validation** - No runtime validation for API boundaries
2. **Component Prop Validation** - Limited compile-time checking for complex props  
3. **Database Type Safety** - SQL queries lack type checking
4. **Configuration Type Safety** - Environment variables not type-checked
5. **Error Type Hierarchy** - Limited structured error types

## Enhanced Type System Architecture

### 1. Runtime Type Validation with Zod Integration

#### Comprehensive Schema System
```typescript
// lib/core/validation/schemas.ts
import { z } from 'zod';

// Base content schemas
export const ArticleMetadataSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  tags: z.array(z.string()).max(10),
  publishedAt: z.date().optional(),
  updatedAt: z.date(),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  status: z.enum(['draft', 'published', 'archived']),
  readingTime: z.number().positive(),
  author: z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string().url().optional()
  })
});

export const ArticleContentSchema = z.object({
  content: z.object({
    html: z.string(),
    markdown: z.string(),
    plainText: z.string(),
    wordCount: z.number().nonnegative()
  }),
  toc: z.array(z.object({
    id: z.string(),
    title: z.string(),
    level: z.number().min(1).max(6),
    anchor: z.string()
  })).optional(),
  embedding: z.array(z.number()).length(1536).optional(), // OpenAI embedding size
  metadata: ArticleMetadataSchema
});

// API schemas with detailed validation
export const SearchRequestSchema = z.object({
  query: z.string().max(500).optional(),
  tags: z.array(z.string()).max(5).default([]),
  limit: z.number().min(1).max(50).default(10),
  offset: z.number().nonnegative().default(0),
  sortBy: z.enum(['relevance', 'date', 'title']).default('relevance'),
  includeContent: z.boolean().default(false)
});

export const SearchResponseSchema = z.object({
  results: z.array(z.object({
    article: ArticleMetadataSchema,
    snippet: z.string().max(300),
    score: z.number().min(0).max(1),
    matches: z.array(z.object({
      field: z.enum(['title', 'content', 'description']),
      text: z.string(),
      highlights: z.array(z.tuple([z.number(), z.number()]))
    }))
  })),
  total: z.number().nonnegative(),
  hasMore: z.boolean(),
  facets: z.object({
    tags: z.record(z.string(), z.number())
  }).optional()
});

// Type Explorer schemas
export const TypeExplorerFileSchema = z.object({
  path: z.string().regex(/^[a-zA-Z0-9/_.-]+\.(ts|tsx|js|jsx)$/, 'Invalid file path'),
  content: z.string().max(50000), // 50KB limit per file
  language: z.enum(['typescript', 'javascript', 'tsx', 'jsx']),
  metadata: z.object({
    size: z.number().nonnegative(),
    lastModified: z.date(),
    dependencies: z.array(z.string()).optional()
  }).optional()
});

// Type extraction utilities
export type Article = z.infer<typeof ArticleContentSchema>;
export type SearchRequest = z.infer<typeof SearchRequestSchema>;
export type SearchResponse = z.infer<typeof SearchResponseSchema>;
export type ExplorerFile = z.infer<typeof TypeExplorerFileSchema>;
```

#### Type-Safe API Layer
```typescript
// lib/infrastructure/api/type-safe-api.ts
export class TypeSafeAPIClient {
  async post<TRequest, TResponse>(
    endpoint: string,
    requestSchema: z.ZodSchema<TRequest>,
    responseSchema: z.ZodSchema<TResponse>,
    data: unknown
  ): Promise<TResponse> {
    // Validate request at compile and runtime
    const validatedRequest = requestSchema.parse(data);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedRequest)
    });

    if (!response.ok) {
      throw new TypedAPIError(
        `API Error: ${response.status}`,
        response.status,
        endpoint
      );
    }

    const rawData = await response.json();
    
    // Validate response at runtime
    try {
      return responseSchema.parse(rawData);
    } catch (error) {
      console.error('API Response Validation Failed:', {
        endpoint,
        error: error.message,
        rawData
      });
      throw new TypedAPIError(
        'Invalid API response format',
        500,
        endpoint,
        error
      );
    }
  }

  // Type-safe search client
  async searchArticles(params: SearchRequest): Promise<SearchResponse> {
    return this.post(
      '/api/search',
      SearchRequestSchema,
      SearchResponseSchema,
      params
    );
  }

  // Type-safe content operations
  async updateArticle(slug: string, content: Partial<Article>): Promise<Article> {
    return this.post(
      `/api/articles/${slug}`,
      ArticleContentSchema.partial(),
      ArticleContentSchema,
      content
    );
  }
}

// Enhanced error types
export class TypedAPIError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly endpoint: string,
    public readonly validationError?: z.ZodError
  ) {
    super(message);
    this.name = 'TypedAPIError';
  }

  getValidationDetails(): ValidationErrorDetail[] | null {
    if (!this.validationError) return null;
    
    return this.validationError.errors.map(error => ({
      path: error.path.join('.'),
      message: error.message,
      code: error.code,
      received: 'received' in error ? error.received : undefined
    }));
  }
}
```

### 2. Advanced Component Type Safety

#### Strict Component Props with Variants
```typescript
// lib/ui/components/type-safe-components.ts
import { VariantProps, cva } from 'class-variance-authority';

// Button component with exhaustive variants
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
          VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  iconPosition?: 'left' | 'right';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, icon: Icon, iconPosition = 'left', children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <Spinner className="mr-2 h-4 w-4" />
        ) : Icon && iconPosition === 'left' ? (
          <Icon className="mr-2 h-4 w-4" />
        ) : null}
        {children}
        {Icon && iconPosition === 'right' && !loading ? (
          <Icon className="ml-2 h-4 w-4" />
        ) : null}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

// Type-safe component composition
interface SearchInputProps {
  onSearch: (query: string) => void;
  onFiltersChange: (filters: SearchFilters) => void;
  placeholder?: string;
  defaultValue?: string;
  filters?: SearchFilters;
  loading?: boolean;
}

export function SearchInput({
  onSearch,
  onFiltersChange,
  placeholder = 'Search articles...',
  defaultValue = '',
  filters = {},
  loading = false
}: SearchInputProps) {
  const [query, setQuery] = useState(defaultValue);
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  // Debounced search with proper typing
  const debouncedSearch = useDebouncedCallback(
    (searchQuery: string) => {
      const validatedQuery = SearchRequestSchema.shape.query.parse(searchQuery);
      onSearch(validatedQuery);
    },
    300
  );

  const handleFiltersChange = useCallback((newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...localFilters, ...newFilters };
    const validatedFilters = SearchFiltersSchema.parse(updatedFilters);
    setLocalFilters(validatedFilters);
    onFiltersChange(validatedFilters);
  }, [localFilters, onFiltersChange]);

  return (
    <div className="search-input-container">
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          debouncedSearch(e.target.value);
        }}
        className="search-input"
        disabled={loading}
      />
      <SearchFilters 
        filters={localFilters}
        onChange={handleFiltersChange}
        disabled={loading}
      />
    </div>
  );
}
```

#### Multimodal Component Type Safety Enhancement
```typescript
// lib/multimodal/v1/enhanced-types.ts

// Enhanced multimodal types with better inference
type MultimodalElementType = 
  | 'heading' 
  | 'paragraph' 
  | 'code-block' 
  | 'list' 
  | 'quote' 
  | 'callout'
  | 'image'
  | 'video'
  | 'interactive';

interface MultimodalBaseProps {
  id?: string;
  className?: string;
  'data-testid'?: string;
}

// Discriminated union for different element types
type MultimodalElementProps<T extends MultimodalElementType> = 
  T extends 'heading' ? {
    type: 'heading';
    level: 1 | 2 | 3 | 4 | 5 | 6;
    children: React.ReactNode;
    anchor?: string;
  } & MultimodalBaseProps :
  T extends 'code-block' ? {
    type: 'code-block';
    language: string;
    code: string;
    filename?: string;
    highlights?: number[];
    showLineNumbers?: boolean;
  } & MultimodalBaseProps :
  T extends 'interactive' ? {
    type: 'interactive';
    component: React.ComponentType<any>;
    props: Record<string, any>;
    fallback?: React.ReactNode;
  } & MultimodalBaseProps :
  // ... other types
  never;

// Type-safe multimodal component factory
export function createMultimodalComponent<T extends MultimodalElementType>(
  type: T
): React.ComponentType<MultimodalElementProps<T>> {
  return function MultimodalComponent(props: MultimodalElementProps<T>) {
    switch (props.type) {
      case 'heading':
        return <MultimodalHeading {...props as any} />;
      case 'code-block':
        return <MultimodalCodeBlock {...props as any} />;
      case 'interactive':
        return <MultimodalInteractive {...props as any} />;
      default:
        const _exhaustiveCheck: never = props;
        throw new Error(`Unhandled multimodal type: ${(_exhaustiveCheck as any).type}`);
    }
  };
}

// Usage with full type safety
const SafeHeading = createMultimodalComponent('heading');
const SafeCodeBlock = createMultimodalComponent('code-block');

// Type-safe content renderer
export function renderMultimodalContent(
  content: MultimodalContent,
  context: RenderContext
): React.ReactNode {
  return content.elements.map((element, index) => {
    const Component = getMultimodalComponent(element.type);
    
    // TypeScript ensures props match the element type
    return <Component key={index} {...element} />;
  });
}
```

### 3. Database Type Safety

#### Type-Safe Database Queries
```typescript
// lib/infrastructure/database/type-safe-db.ts
import { Generated, Kysely, PostgresDialect } from 'kysely';

// Database schema types
interface ArticlesTable {
  id: Generated<string>;
  slug: string;
  title: string;
  description: string | null;
  content: {
    html: string;
    markdown: string;
    plainText: string;
    wordCount: number;
  };
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  created_at: Generated<Date>;
  updated_at: Date;
  published_at: Date | null;
  content_embedding: number[] | null;
}

interface CommentsTable {
  id: Generated<string>;
  article_id: string;
  author_id: string;
  content: string;
  created_at: Generated<Date>;
  updated_at: Date;
  parent_id: string | null;
  status: 'published' | 'hidden' | 'deleted';
}

interface Database {
  articles_v2: ArticlesTable;
  comments: CommentsTable;
  users: UsersTable;
  sessions: SessionsTable;
}

// Type-safe repository
export class TypeSafeArticleRepository {
  constructor(private db: Kysely<Database>) {}

  async findBySlug(slug: string): Promise<Article | null> {
    const row = await this.db
      .selectFrom('articles_v2')
      .selectAll()
      .where('slug', '=', slug)
      .where('status', '=', 'published')
      .executeTakeFirst();

    if (!row) return null;

    // Runtime validation ensures type safety
    return ArticleContentSchema.parse({
      metadata: {
        title: row.title,
        description: row.description,
        tags: row.tags,
        publishedAt: row.published_at,
        updatedAt: row.updated_at,
        slug: row.slug,
        status: row.status,
        readingTime: Math.ceil(row.content.wordCount / 200)
      },
      content: row.content,
      embedding: row.content_embedding
    });
  }

  async searchByFullText(
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    const { limit = 10, offset = 0, tags = [] } = options;

    let dbQuery = this.db
      .selectFrom('articles_v2')
      .selectAll()
      .select(
        sql<number>`ts_rank(
          setweight(to_tsvector('english', title), 'A') ||
          setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
          setweight(to_tsvector('english', content->>'plainText'), 'C'),
          plainto_tsquery('english', ${query})
        )`.as('rank')
      )
      .select(
        sql<string>`ts_headline(
          'english',
          content->>'plainText',
          plainto_tsquery('english', ${query}),
          'MaxWords=50, MinWords=20'
        )`.as('snippet')
      )
      .where('status', '=', 'published')
      .where(sql`
        setweight(to_tsvector('english', title), 'A') ||
        setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
        setweight(to_tsvector('english', content->>'plainText'), 'C')
        @@ plainto_tsquery('english', ${query})
      `);

    if (tags.length > 0) {
      dbQuery = dbQuery.where('tags', '&&', tags);
    }

    const rows = await dbQuery
      .orderBy('rank', 'desc')
      .limit(limit)
      .offset(offset)
      .execute();

    // Transform and validate results
    return rows.map(row => SearchResultSchema.parse({
      article: {
        title: row.title,
        description: row.description,
        tags: row.tags,
        publishedAt: row.published_at,
        slug: row.slug,
        status: row.status,
        readingTime: Math.ceil(row.content.wordCount / 200)
      },
      snippet: row.snippet,
      score: row.rank,
      matches: [] // Would be populated by highlighting logic
    }));
  }
}
```

### 4. Configuration Type Safety

#### Environment Variable Validation
```typescript
// lib/core/config/environment.ts
const EnvironmentSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  DATABASE_POOL_MAX: z.coerce.number().min(1).max(50).default(10),
  
  // Authentication
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  
  // External APIs
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.enum(['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo']).default('gpt-4-turbo'),
  
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().min(1).max(65535).default(3000),
  
  // Features
  ENABLE_VECTOR_SEARCH: z.coerce.boolean().default(false),
  ENABLE_ANALYTICS: z.coerce.boolean().default(true),
  MAX_UPLOAD_SIZE: z.coerce.number().positive().default(5 * 1024 * 1024), // 5MB
  
  // Cache
  REDIS_URL: z.string().url().optional(),
  CACHE_TTL_DEFAULT: z.coerce.number().positive().default(300), // 5 minutes
});

export type Environment = z.infer<typeof EnvironmentSchema>;

// Validated environment singleton
class ConfigManager {
  private static instance: ConfigManager;
  private _env: Environment;

  private constructor() {
    try {
      this._env = EnvironmentSchema.parse(process.env);
    } catch (error) {
      console.error('❌ Environment validation failed:');
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          console.error(`  ${err.path.join('.')}: ${err.message}`);
        });
      }
      process.exit(1);
    }
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  get env(): Environment {
    return this._env;
  }

  // Type-safe configuration access
  get database() {
    return {
      url: this._env.DATABASE_URL,
      poolMax: this._env.DATABASE_POOL_MAX
    };
  }

  get auth() {
    return {
      secret: this._env.NEXTAUTH_SECRET,
      url: this._env.NEXTAUTH_URL,
      github: {
        clientId: this._env.GITHUB_CLIENT_ID,
        clientSecret: this._env.GITHUB_CLIENT_SECRET
      }
    };
  }

  get openai() {
    return {
      apiKey: this._env.OPENAI_API_KEY,
      model: this._env.OPENAI_MODEL
    };
  }

  get features() {
    return {
      vectorSearch: this._env.ENABLE_VECTOR_SEARCH,
      analytics: this._env.ENABLE_ANALYTICS,
      maxUploadSize: this._env.MAX_UPLOAD_SIZE
    };
  }
}

export const config = ConfigManager.getInstance();

// Usage throughout the application
export function createDatabaseClient(): Kysely<Database> {
  return new Kysely<Database>({
    dialect: new PostgresDialect({
      connectionString: config.database.url,
      pool: {
        max: config.database.poolMax
      }
    })
  });
}
```

### 5. Enhanced Error Handling

#### Structured Error Hierarchy
```typescript
// lib/core/errors/typed-errors.ts
export abstract class BaseError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  
  constructor(
    message: string,
    public readonly context?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      context: this.context,
      stack: process.env.NODE_ENV === 'development' ? this.stack : undefined
    };
  }
}

export class ValidationError extends BaseError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;

  constructor(
    public readonly field: string,
    public readonly value: any,
    public readonly constraint: string,
    context?: Record<string, any>
  ) {
    super(`Validation failed for field '${field}': ${constraint}`, context);
  }
}

export class NotFoundError extends BaseError {
  readonly code = 'NOT_FOUND';
  readonly statusCode = 404;

  constructor(resource: string, identifier: string, context?: Record<string, any>) {
    super(`${resource} not found: ${identifier}`, context);
  }
}

export class DatabaseError extends BaseError {
  readonly code = 'DATABASE_ERROR';
  readonly statusCode = 500;

  constructor(operation: string, cause: Error, context?: Record<string, any>) {
    super(`Database operation failed: ${operation}`, { ...context, cause: cause.message });
  }
}

// Result type for operations that may fail
export type Result<T, E extends BaseError = BaseError> = 
  | { success: true; data: T }
  | { success: false; error: E };

export function success<T>(data: T): Result<T, never> {
  return { success: true, data };
}

export function failure<E extends BaseError>(error: E): Result<never, E> {
  return { success: false, error };
}

// Type-safe error handling utilities
export async function tryCatch<T, E extends BaseError>(
  operation: () => Promise<T>,
  errorFactory: (error: Error) => E
): Promise<Result<T, E>> {
  try {
    const data = await operation();
    return success(data);
  } catch (error) {
    const typedError = errorFactory(error as Error);
    return failure(typedError);
  }
}
```

This comprehensive TypeScript enhancement strategy builds upon the existing strong foundation while addressing gaps in runtime validation, component type safety, database operations, configuration management, and error handling. The approach maintains compatibility with current patterns while significantly improving type safety and developer experience.
