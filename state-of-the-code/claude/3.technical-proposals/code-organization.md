# Code Organization & Architecture Patterns

**Detailed strategies for structuring the codebase and establishing sustainable architectural patterns**

## Current State Analysis

### What's Working Well

**Multimodal Component System** (`lib/multimodal/v1/`)
- **Elegant dual-mode rendering** - Components work in both HTML and Markdown contexts
- **Type-safe composition** - Proper TypeScript integration with generic constraints
- **Server-side optimization** - Code highlighting with Shiki, SEO-friendly output
- **Clean abstractions** - `multimodal()` factory provides consistent API

**Type Explorer Architecture**
- **Sophisticated Monaco integration** - Multi-file TypeScript support with real-time diagnostics
- **Performance considerations** - Debounced updates, virtual file system
- **User experience focus** - Hover tooltips, error navigation, file management
- **Modular design** - Clear separation of concerns within the component

### Architectural Issues to Address

**Fragmented Module Boundaries**
```
Current problematic patterns:
- UI components importing database utilities directly
- Business logic mixed with presentation layer  
- Infrastructure concerns scattered throughout
- Inconsistent dependency directions
```

**Competing Implementations**
```
Multiple solutions for same problems:
- lib/search.ts vs lib/search/index.ts
- AuthMenu.tsx vs AuthMenuClient.tsx
- Article rendering: multimodal vs legacy components
```

## Proposed Architecture

### Layer-Based Organization

```
Application Architecture (Strict Layer Boundaries)

┌─ Presentation Layer ─────────────────────────┐
│  app/                # Next.js App Router    │
│  components/         # React Components      │
│  lib/ui/            # UI Primitives         │
└─────────────────────────────────────────────┘
           ↓ (Props/Context only)
┌─ Application Layer ──────────────────────────┐
│  lib/core/          # Business Logic        │
│  ├─ auth/          # Authentication         │
│  ├─ content/       # Content Management     │
│  ├─ search/        # Search Engine          │
│  └─ community/     # Social Features        │
└─────────────────────────────────────────────┘
           ↓ (Dependency Injection)
┌─ Infrastructure Layer ───────────────────────┐
│  lib/infrastructure/                        │
│  ├─ database/      # Data Persistence       │
│  ├─ ai/           # External AI Services    │
│  ├─ storage/      # File & Asset Storage    │
│  └─ monitoring/   # Observability           │
└─────────────────────────────────────────────┘
```

### Dependency Rules

**Strict Import Hierarchy** (Enforced by ESLint)
```typescript
// ✅ Allowed: Lower layers can import from higher layers
import { UserRole } from '@/lib/types/auth';
import { formatDate } from '@/lib/utilities/formatting';

// ✅ Allowed: Same layer imports
import { SearchEngine } from '@/lib/core/search/types';

// ❌ Forbidden: Higher layers importing from lower layers  
import { DatabaseConnection } from '@/lib/infrastructure/database'; // In UI component

// ❌ Forbidden: Cross-layer dependencies without interfaces
import { PostgresAdapter } from '@/lib/infrastructure/database/postgres'; // In core logic
```

### Module Boundaries

#### Core Business Logic (`lib/core/`)
```typescript
// lib/core/content/types.ts - Domain models
export interface Article {
  readonly slug: string;
  readonly metadata: ArticleMetadata;
  readonly content: ContentBlock[];
  readonly publishedAt: Date;
  readonly version: number;
}

export interface ContentBlock {
  readonly type: 'text' | 'code' | 'image' | 'interactive';
  readonly content: string;
  readonly metadata?: Record<string, unknown>;
}

// lib/core/content/service.ts - Business logic
export class ContentService {
  constructor(
    private repository: ContentRepository, // Interface, not concrete implementation
    private searchEngine: SearchEngine,    // Interface, not concrete implementation
    private pipeline: ContentPipeline      // Interface, not concrete implementation
  ) {}

  async publishArticle(draft: ArticleDraft): Promise<Article> {
    // Validate content
    const validation = await this.pipeline.validate(draft);
    if (!validation.isValid) {
      throw new ContentValidationError(validation.errors);
    }

    // Process content
    const processed = await this.pipeline.process(draft);
    
    // Save to repository
    const article = await this.repository.save(processed);
    
    // Update search index
    await this.searchEngine.index(article);
    
    return article;
  }
}
```

#### Infrastructure Adapters (`lib/infrastructure/`)
```typescript
// lib/infrastructure/database/content-repository.ts
export class PostgresContentRepository implements ContentRepository {
  constructor(private db: DatabaseConnection) {}

  async save(article: ProcessedArticle): Promise<Article> {
    const result = await this.db.query(`
      INSERT INTO articles (slug, metadata, content, version)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [article.slug, article.metadata, article.content, article.version]);
    
    return this.mapToArticle(result.rows[0]);
  }

  async findBySlug(slug: string): Promise<Article | null> {
    // Implementation details
  }
}

// lib/infrastructure/ai/openai-service.ts  
export class OpenAIContentPipeline implements ContentPipeline {
  constructor(private apiKey: string) {}

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: text.slice(0, 8000)
      })
    });

    const data = await response.json();
    return data.data[0].embedding;
  }
}
```

#### UI Components (`lib/ui/`)
```typescript
// lib/ui/content/ArticleRenderer.tsx
export interface ArticleRendererProps {
  article: Article;
  mode: 'standard' | 'markdown';
  onInteraction?: (interaction: ArticleInteraction) => void;
}

export function ArticleRenderer({ article, mode, onInteraction }: ArticleRendererProps) {
  // Pure presentation logic - no business logic
  return (
    <Article modality={mode === 'markdown' ? 'markdown' : null}>
      <ArticleHeader modality={mode === 'markdown' ? 'markdown' : null}>
        <Heading level={1} modality={mode === 'markdown' ? 'markdown' : null}>
          {article.metadata.title}
        </Heading>
      </ArticleHeader>
      
      {article.content.map((block, index) => (
        <ContentBlockRenderer 
          key={index}
          block={block}
          mode={mode}
          onInteraction={onInteraction}
        />
      ))}
    </Article>
  );
}
```

## Advanced Patterns

### 1. Dependency Injection Container

```typescript
// lib/core/container/types.ts
export interface Container {
  register<T>(token: symbol, implementation: T): void;
  resolve<T>(token: symbol): T;
  createScope(): Container;
}

// lib/core/container/tokens.ts - Service tokens
export const TOKENS = {
  // Repositories
  CONTENT_REPOSITORY: Symbol('ContentRepository'),
  USER_REPOSITORY: Symbol('UserRepository'),
  
  // Services  
  SEARCH_ENGINE: Symbol('SearchEngine'),
  AUTH_SERVICE: Symbol('AuthService'),
  
  // Infrastructure
  DATABASE_CONNECTION: Symbol('DatabaseConnection'),
  AI_SERVICE: Symbol('AIService'),
} as const;

// lib/core/container/container.ts
export class DIContainer implements Container {
  private services = new Map<symbol, unknown>();
  private singletons = new Set<symbol>();

  register<T>(token: symbol, implementation: T, singleton = false): void {
    this.services.set(token, implementation);
    if (singleton) {
      this.singletons.add(token);
    }
  }

  resolve<T>(token: symbol): T {
    const service = this.services.get(token);
    if (!service) {
      throw new Error(`Service not registered: ${token.toString()}`);
    }
    return service as T;
  }
}

// Usage in application setup
export function createProductionContainer(): Container {
  const container = new DIContainer();
  
  // Register infrastructure
  container.register(TOKENS.DATABASE_CONNECTION, createDatabaseConnection(), true);
  container.register(TOKENS.AI_SERVICE, new OpenAIService(process.env.OPENAI_API_KEY!), true);
  
  // Register repositories
  container.register(TOKENS.CONTENT_REPOSITORY, 
    new PostgresContentRepository(container.resolve(TOKENS.DATABASE_CONNECTION))
  );
  
  // Register services
  container.register(TOKENS.SEARCH_ENGINE,
    new ProductionSearchEngine(
      container.resolve(TOKENS.CONTENT_REPOSITORY),
      container.resolve(TOKENS.AI_SERVICE)
    )
  );
  
  return container;
}
```

### 2. Event-Driven Architecture

```typescript
// lib/core/events/types.ts
export interface DomainEvent {
  readonly eventId: string;
  readonly eventType: string;
  readonly aggregateId: string;
  readonly timestamp: Date;
  readonly payload: Record<string, unknown>;
}

export interface EventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;
}

export interface EventBus {
  publish<T extends DomainEvent>(event: T): Promise<void>;
  subscribe<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): void;
}

// lib/core/events/content-events.ts
export class ArticlePublishedEvent implements DomainEvent {
  readonly eventType = 'article.published';
  
  constructor(
    public readonly eventId: string,
    public readonly aggregateId: string, // article slug
    public readonly timestamp: Date,
    public readonly payload: {
      slug: string;
      title: string;
      author: string;
      tags: string[];
    }
  ) {}
}

// Event handlers for cross-cutting concerns
export class SearchIndexEventHandler implements EventHandler<ArticlePublishedEvent> {
  constructor(private searchEngine: SearchEngine) {}

  async handle(event: ArticlePublishedEvent): Promise<void> {
    const article = await this.contentRepository.findBySlug(event.payload.slug);
    if (article) {
      await this.searchEngine.index(article);
    }
  }
}

export class NotificationEventHandler implements EventHandler<ArticlePublishedEvent> {
  async handle(event: ArticlePublishedEvent): Promise<void> {
    // Send notifications to subscribers
    await this.notificationService.notifySubscribers({
      type: 'new-article',
      article: event.payload
    });
  }
}
```

### 3. Repository Pattern with Specifications

```typescript
// lib/core/shared/specification.ts
export abstract class Specification<T> {
  abstract isSatisfiedBy(entity: T): boolean;
  
  and(other: Specification<T>): Specification<T> {
    return new AndSpecification(this, other);
  }
  
  or(other: Specification<T>): Specification<T> {
    return new OrSpecification(this, other);
  }
  
  not(): Specification<T> {
    return new NotSpecification(this);
  }
}

// lib/core/content/specifications.ts
export class PublishedArticleSpecification extends Specification<Article> {
  isSatisfiedBy(article: Article): boolean {
    return article.status === 'published' && article.publishedAt <= new Date();
  }
}

export class ArticleByTagSpecification extends Specification<Article> {
  constructor(private tag: string) {
    super();
  }
  
  isSatisfiedBy(article: Article): boolean {
    return article.metadata.tags.includes(this.tag);
  }
}

// Enhanced repository with specifications
export interface ContentRepository {
  findBySpecification(spec: Specification<Article>): Promise<Article[]>;
  findOneBySpecification(spec: Specification<Article>): Promise<Article | null>;
}

// Usage
const publishedTypeScriptArticles = await contentRepository.findBySpecification(
  new PublishedArticleSpecification()
    .and(new ArticleByTagSpecification('typescript'))
);
```

### 4. Type-Safe Configuration

```typescript
// lib/core/config/types.ts
export interface AppConfig {
  readonly database: DatabaseConfig;
  readonly auth: AuthConfig;
  readonly ai: AIConfig;
  readonly features: FeatureFlags;
}

export interface DatabaseConfig {
  readonly connectionString: string;
  readonly poolSize: number;
  readonly ssl: boolean;
}

export interface FeatureFlags {
  readonly enableVectorSearch: boolean;
  readonly enableCollaboration: boolean;
  readonly enableAnalytics: boolean;
}

// lib/core/config/validation.ts
const ConfigSchema = z.object({
  database: z.object({
    connectionString: z.string().min(1),
    poolSize: z.number().min(1).max(100),
    ssl: z.boolean()
  }),
  auth: z.object({
    secret: z.string().min(32),
    providers: z.object({
      github: z.object({
        clientId: z.string().min(1),
        clientSecret: z.string().min(1)
      })
    })
  }),
  features: z.object({
    enableVectorSearch: z.boolean(),
    enableCollaboration: z.boolean(),
    enableAnalytics: z.boolean()
  })
});

export function validateConfig(config: unknown): AppConfig {
  return ConfigSchema.parse(config);
}

// lib/core/config/factory.ts
export function createConfig(): AppConfig {
  const rawConfig = {
    database: {
      connectionString: process.env.DATABASE_URL!,
      poolSize: parseInt(process.env.DB_POOL_SIZE || '10'),
      ssl: process.env.NODE_ENV === 'production'
    },
    auth: {
      secret: process.env.AUTH_SECRET!,
      providers: {
        github: {
          clientId: process.env.GITHUB_ID!,
          clientSecret: process.env.GITHUB_SECRET!
        }
      }
    },
    features: {
      enableVectorSearch: process.env.ENABLE_VECTOR_SEARCH === 'true',
      enableCollaboration: process.env.ENABLE_COLLABORATION === 'true', 
      enableAnalytics: process.env.ENABLE_ANALYTICS === 'true'
    }
  };

  return validateConfig(rawConfig);
}
```

## File Organization Standards

### Naming Conventions

```typescript
// File naming patterns
interfaces/      → *.interface.ts
types/          → *.types.ts  
services/       → *.service.ts
repositories/   → *.repository.ts
adapters/       → *.adapter.ts
factories/      → *.factory.ts
utilities/      → *.util.ts
constants/      → *.constants.ts

// Component naming
components/     → PascalCase.tsx
hooks/          → use-kebab-case.ts
contexts/       → kebab-case.context.tsx
providers/      → PascalCase.provider.tsx
```

### Import/Export Patterns

```typescript
// lib/core/content/index.ts - Barrel exports with clear structure
export * from './types';
export * from './service';
export * from './specifications';
export { ContentService as DefaultContentService } from './service';

// Explicit re-exports for better tree-shaking
export {
  type Article,
  type ArticleMetadata,
  type ContentBlock
} from './types';

// Default service factory
export function createContentService(container: Container): ContentService {
  return new ContentService(
    container.resolve(TOKENS.CONTENT_REPOSITORY),
    container.resolve(TOKENS.SEARCH_ENGINE),
    container.resolve(TOKENS.CONTENT_PIPELINE)
  );
}
```

### Directory Structure

```
lib/
├── core/                           # Business logic (no external dependencies)
│   ├── content/
│   │   ├── index.ts               # Barrel exports
│   │   ├── types.ts               # Domain models
│   │   ├── service.ts             # Business logic
│   │   ├── specifications.ts      # Query specifications
│   │   └── events.ts              # Domain events
│   ├── search/
│   │   ├── index.ts
│   │   ├── types.ts
│   │   ├── engine.ts              # Search engine interface
│   │   └── indexer.ts             # Content indexing logic
│   └── auth/
│       ├── index.ts
│       ├── types.ts
│       ├── service.ts
│       └── rbac.ts                # Role-based access control
├── infrastructure/                 # External service adapters
│   ├── database/
│   │   ├── index.ts
│   │   ├── connection.ts
│   │   ├── repositories/
│   │   │   ├── content.repository.ts
│   │   │   └── user.repository.ts
│   │   └── migrations/
│   ├── ai/
│   │   ├── index.ts
│   │   ├── openai.adapter.ts
│   │   └── types.ts
│   └── storage/
│       ├── index.ts
│       ├── local.adapter.ts
│       └── s3.adapter.ts
├── ui/                             # React components (presentation only)
│   ├── primitives/                 # Basic UI components
│   │   ├── Button/
│   │   │   ├── index.ts
│   │   │   ├── Button.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── Button.test.tsx
│   │   └── Input/
│   ├── patterns/                   # Composite UI patterns
│   │   ├── SearchInterface/
│   │   ├── ArticleRenderer/
│   │   └── TypeExplorer/
│   └── layouts/                    # Page layout components
│       ├── AppLayout/
│       ├── ArticleLayout/
│       └── AdminLayout/
├── utilities/                      # Pure utility functions
│   ├── validation/
│   │   ├── index.ts
│   │   ├── schemas.ts
│   │   └── sanitization.ts
│   ├── formatting/
│   │   ├── index.ts
│   │   ├── dates.ts
│   │   ├── text.ts
│   │   └── numbers.ts
│   └── constants/
│       ├── index.ts
│       ├── api.constants.ts
│       └── ui.constants.ts
└── types/                          # TypeScript definitions
    ├── api/
    │   ├── index.ts
    │   ├── requests.ts
    │   └── responses.ts
    ├── content/
    │   ├── index.ts
    │   ├── article.ts
    │   └── metadata.ts
    └── database/
        ├── index.ts
        ├── tables.ts
        └── relations.ts
```

## Migration Strategy

### Phase 1: Establish Boundaries
1. **Create new directory structure** alongside existing code
2. **Move utilities and types** first (no dependencies)
3. **Establish import rules** with ESLint configuration
4. **Create interfaces** for existing services

### Phase 2: Extract Core Logic
1. **Extract business logic** from existing components
2. **Create service classes** with dependency injection
3. **Implement repository interfaces** for existing database code
4. **Add event system** for cross-cutting concerns

### Phase 3: Refactor Infrastructure
1. **Move database code** to infrastructure layer
2. **Extract external API calls** to adapters
3. **Implement dependency injection** container
4. **Add configuration management**

### Phase 4: Clean Up
1. **Remove old duplicate code**
2. **Update all imports** to use new structure
3. **Add comprehensive tests** for new architecture
4. **Document patterns** and conventions

This organization strategy provides clear separation of concerns, enables better testing, and creates a scalable foundation for future development while building on the existing strengths of the multimodal system and Type Explorer.
