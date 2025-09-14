# Content Directory Architecture & Migration Strategy

**Detailed implementation plan for the canonical content/ directory structure**

## Current State Analysis

### Existing Content Distribution

**Articles (Currently in articles/):**
```
articles/
└── advanced-typescript-patterns-react/
    ├── article.tsx              # Main content component
    ├── footer.tsx              # Article footer
    ├── meta.tsx                # Metadata component
    ├── section.*.tsx           # Content sections (4 files)
    └── snippet.*.tsx           # Code snippets (4 files)
```

**Missing Content Types:**
- No centralized contributor profiles
- No branded terminology/philosophy documentation
- No structured lab catalog descriptions
- No content registry or type-safe access patterns

**App-Level Mixing:**
- Article content mixed with app routing in `app/article/`
- No clear separation between content and presentation
- Content discovery through filesystem rather than registry

## Proposed Content Directory Architecture

### Complete Content Structure
```
content/
├── index.ts                    # Main content registry export
├── types.ts                    # Content type definitions
├── registry.ts                 # Content registry implementation
├── derivation/                 # Content derivation utilities
│   ├── markdown-renderer.ts   # Multimodal → Markdown
│   ├── embedding-generator.ts # Content → Embeddings
│   └── search-indexer.ts      # Content → Search index
├── articles/                   # Authored articles
│   ├── index.ts               # Article registry
│   ├── types.ts               # Article-specific types
│   ├── typescript-patterns/   # Article directory
│   │   ├── article.tsx        # Main multimodal article
│   │   ├── metadata.ts        # Article metadata
│   │   ├── sections/          # Modular content sections
│   │   │   ├── introduction.tsx
│   │   │   ├── conditional-types.tsx
│   │   │   ├── mapped-types.tsx
│   │   │   └── best-practices.tsx
│   │   └── snippets/          # Interactive code examples
│   │       ├── api-client.tsx
│   │       ├── conditional-button.tsx
│   │       └── generic-list.tsx
│   └── react-fundamentals/    # Additional articles...
├── contributors/               # Author profiles and bios
│   ├── index.ts               # Contributor registry
│   ├── types.ts               # Contributor types
│   ├── santi.tsx              # Individual contributor profile
│   └── templates/             # Contributor profile templates
├── terminology/                # Branded concepts and philosophy
│   ├── index.ts               # Terminology registry
│   ├── types.ts               # Terminology types
│   ├── multimodal-architecture.tsx  # Core architectural concepts
│   ├── type-safety-first.tsx        # Development philosophy
│   ├── content-as-source.tsx        # Content strategy
│   └── developer-experience.tsx     # DX principles
└── labs/                       # Lab catalog and metadata
    ├── index.ts               # Lab registry
    ├── types.ts               # Lab types
    ├── type-explorer.tsx      # Type Explorer lab description
    ├── search-test.tsx        # Search test lab description
    └── metadata-inspector.tsx # Metadata inspector lab description
```

## Content Type System

### Core Content Types
```typescript
// content/types.ts
export interface ContentMetadata {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  author: string;
  status: 'draft' | 'published' | 'archived';
}

export interface ArticleMetadata extends ContentMetadata {
  slug: string;
  readingTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  learningObjectives: string[];
  category: string;
  publishedAt?: Date;
}

export interface ContributorMetadata extends ContentMetadata {
  username: string;
  name: string;
  bio: string;
  avatar?: string;
  website?: string;
  social: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  expertise: string[];
  articlesAuthored: string[];
}

export interface TerminologyMetadata extends ContentMetadata {
  concept: string;
  category: 'architecture' | 'philosophy' | 'methodology' | 'pattern';
  relatedTerms: string[];
  importance: 'core' | 'important' | 'supplementary';
}

export interface LabMetadata extends ContentMetadata {
  labId: string;
  route: string;
  category: 'tools' | 'playground' | 'demo' | 'experiment';
  complexity: 'simple' | 'moderate' | 'complex';
  interactivity: 'static' | 'interactive' | 'collaborative';
  technologies: string[];
  learningOutcomes: string[];
}

// Content section types for modular articles
export interface ContentSection {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  tags?: string[];
  learningOutcomes?: string[];
  prerequisites?: string[];
  estimatedReadTime?: number;
}

// Multimodal content interface
export interface MultimodalContent<T extends ContentMetadata = ContentMetadata> {
  metadata: T;
  sections: ContentSection[];
  derivation: {
    enableMarkdown: boolean;
    enablePlainText: boolean;
    enableEmbeddings: boolean;
    embeddingStrategy: 'full-article' | 'per-section' | 'hybrid';
    seoMetadata: boolean;
    openGraphData: boolean;
  };
}

export type ContentType = 'article' | 'contributor' | 'terminology' | 'lab';
export type ContentItem = MultimodalContent<ArticleMetadata | ContributorMetadata | TerminologyMetadata | LabMetadata>;
```

### Content Registry System
```typescript
// content/registry.ts
import { ContentType, ContentItem, ContentMetadata } from './types';

export abstract class BaseContentRegistry<T extends ContentMetadata> {
  protected items: Map<string, MultimodalContent<T>> = new Map();
  protected tags: Map<string, Set<string>> = new Map();
  protected searchIndex: Map<string, string[]> = new Map();

  abstract getContentType(): ContentType;

  register(item: MultimodalContent<T>): void {
    this.items.set(item.metadata.id, item);
    this.indexTags(item);
    this.indexSearchTerms(item);
  }

  get(id: string): MultimodalContent<T> | null {
    return this.items.get(id) || null;
  }

  getAll(): MultimodalContent<T>[] {
    return Array.from(this.items.values())
      .filter(item => item.metadata.status === 'published')
      .sort((a, b) => b.metadata.updatedAt.getTime() - a.metadata.updatedAt.getTime());
  }

  getByTag(tag: string): MultimodalContent<T>[] {
    const itemIds = this.tags.get(tag) || new Set();
    return Array.from(itemIds)
      .map(id => this.items.get(id))
      .filter((item): item is MultimodalContent<T> => item !== undefined);
  }

  search(query: string): MultimodalContent<T>[] {
    const queryTerms = query.toLowerCase().split(' ');
    const matchingItems = new Set<string>();

    queryTerms.forEach(term => {
      const itemIds = this.searchIndex.get(term) || [];
      itemIds.forEach(id => matchingItems.add(id));
    });

    return Array.from(matchingItems)
      .map(id => this.items.get(id))
      .filter((item): item is MultimodalContent<T> => item !== undefined)
      .sort((a, b) => this.calculateRelevance(b, queryTerms) - this.calculateRelevance(a, queryTerms));
  }

  private indexTags(item: MultimodalContent<T>): void {
    item.metadata.tags.forEach(tag => {
      if (!this.tags.has(tag)) {
        this.tags.set(tag, new Set());
      }
      this.tags.get(tag)!.add(item.metadata.id);
    });
  }

  private indexSearchTerms(item: MultimodalContent<T>): void {
    const searchableText = [
      item.metadata.title,
      item.metadata.description,
      ...item.metadata.tags
    ].join(' ').toLowerCase();

    const terms = searchableText.split(/\s+/);
    terms.forEach(term => {
      if (!this.searchIndex.has(term)) {
        this.searchIndex.set(term, []);
      }
      this.searchIndex.get(term)!.push(item.metadata.id);
    });
  }

  private calculateRelevance(item: MultimodalContent<T>, queryTerms: string[]): number {
    let score = 0;
    const text = [item.metadata.title, item.metadata.description].join(' ').toLowerCase();
    
    queryTerms.forEach(term => {
      if (item.metadata.title.toLowerCase().includes(term)) score += 3;
      if (item.metadata.description.toLowerCase().includes(term)) score += 2;
      if (item.metadata.tags.some(tag => tag.toLowerCase().includes(term))) score += 1;
    });

    return score;
  }
}

// Specific registry implementations
export class ArticleRegistry extends BaseContentRegistry<ArticleMetadata> {
  getContentType(): ContentType {
    return 'article';
  }

  getBySlug(slug: string): MultimodalContent<ArticleMetadata> | null {
    return Array.from(this.items.values())
      .find(item => item.metadata.slug === slug) || null;
  }

  getByCategory(category: string): MultimodalContent<ArticleMetadata>[] {
    return Array.from(this.items.values())
      .filter(item => item.metadata.category === category);
  }

  getByDifficulty(difficulty: ArticleMetadata['difficulty']): MultimodalContent<ArticleMetadata>[] {
    return Array.from(this.items.values())
      .filter(item => item.metadata.difficulty === difficulty);
  }
}

export class ContributorRegistry extends BaseContentRegistry<ContributorMetadata> {
  getContentType(): ContentType {
    return 'contributor';
  }

  getByUsername(username: string): MultimodalContent<ContributorMetadata> | null {
    return Array.from(this.items.values())
      .find(item => item.metadata.username === username) || null;
  }

  getByExpertise(expertise: string): MultimodalContent<ContributorMetadata>[] {
    return Array.from(this.items.values())
      .filter(item => item.metadata.expertise.includes(expertise));
  }
}

export class TerminologyRegistry extends BaseContentRegistry<TerminologyMetadata> {
  getContentType(): ContentType {
    return 'terminology';
  }

  getByConcept(concept: string): MultimodalContent<TerminologyMetadata> | null {
    return Array.from(this.items.values())
      .find(item => item.metadata.concept === concept) || null;
  }

  getByCategory(category: TerminologyMetadata['category']): MultimodalContent<TerminologyMetadata>[] {
    return Array.from(this.items.values())
      .filter(item => item.metadata.category === category);
  }

  getCoreTerms(): MultimodalContent<TerminologyMetadata>[] {
    return Array.from(this.items.values())
      .filter(item => item.metadata.importance === 'core');
  }
}

export class LabRegistry extends BaseContentRegistry<LabMetadata> {
  getContentType(): ContentType {
    return 'lab';
  }

  getByRoute(route: string): MultimodalContent<LabMetadata> | null {
    return Array.from(this.items.values())
      .find(item => item.metadata.route === route) || null;
  }

  getByCategory(category: LabMetadata['category']): MultimodalContent<LabMetadata>[] {
    return Array.from(this.items.values())
      .filter(item => item.metadata.category === category);
  }

  getInteractiveLabs(): MultimodalContent<LabMetadata>[] {
    return Array.from(this.items.values())
      .filter(item => item.metadata.interactivity !== 'static');
  }
}

// Main content registry
export class ContentRegistry {
  public readonly articles = new ArticleRegistry();
  public readonly contributors = new ContributorRegistry();
  public readonly terminology = new TerminologyRegistry();
  public readonly labs = new LabRegistry();

  searchAll(query: string, contentTypes?: ContentType[]): ContentItem[] {
    const types = contentTypes || ['article', 'contributor', 'terminology', 'lab'];
    const results: ContentItem[] = [];

    if (types.includes('article')) {
      results.push(...this.articles.search(query));
    }
    if (types.includes('contributor')) {
      results.push(...this.contributors.search(query));
    }
    if (types.includes('terminology')) {
      results.push(...this.terminology.search(query));
    }
    if (types.includes('lab')) {
      results.push(...this.labs.search(query));
    }

    return results.sort((a, b) => {
      // Sort by relevance, then by update date
      const aRelevance = this.calculateOverallRelevance(a, query);
      const bRelevance = this.calculateOverallRelevance(b, query);
      
      if (aRelevance !== bRelevance) {
        return bRelevance - aRelevance;
      }
      
      return b.metadata.updatedAt.getTime() - a.metadata.updatedAt.getTime();
    });
  }

  private calculateOverallRelevance(item: ContentItem, query: string): number {
    const queryTerms = query.toLowerCase().split(' ');
    let score = 0;
    
    queryTerms.forEach(term => {
      if (item.metadata.title.toLowerCase().includes(term)) score += 3;
      if (item.metadata.description.toLowerCase().includes(term)) score += 2;
      if (item.metadata.tags.some(tag => tag.toLowerCase().includes(term))) score += 1;
    });

    return score;
  }
}

// Global content registry instance
export const contentRegistry = new ContentRegistry();
```

## Content Creation Utilities

### Multimodal Content Factory
```typescript
// content/factory.ts
import { MultimodalContent, ContentSection, ArticleMetadata, ContributorMetadata, TerminologyMetadata, LabMetadata } from './types';

export function createMultimodalArticle(config: {
  metadata: ArticleMetadata;
  sections: ContentSection[];
  derivation?: Partial<MultimodalContent['derivation']>;
}): MultimodalContent<ArticleMetadata> {
  return {
    metadata: config.metadata,
    sections: config.sections,
    derivation: {
      enableMarkdown: true,
      enablePlainText: true,
      enableEmbeddings: true,
      embeddingStrategy: 'per-section',
      seoMetadata: true,
      openGraphData: true,
      ...config.derivation
    }
  };
}

export function createContributorProfile(config: {
  metadata: ContributorMetadata;
  sections: ContentSection[];
}): MultimodalContent<ContributorMetadata> {
  return {
    metadata: config.metadata,
    sections: config.sections,
    derivation: {
      enableMarkdown: true,
      enablePlainText: true,
      enableEmbeddings: false, // Profiles don't need embeddings
      embeddingStrategy: 'full-article',
      seoMetadata: true,
      openGraphData: true
    }
  };
}

export function createTerminologyEntry(config: {
  metadata: TerminologyMetadata;
  sections: ContentSection[];
}): MultimodalContent<TerminologyMetadata> {
  return {
    metadata: config.metadata,
    sections: config.sections,
    derivation: {
      enableMarkdown: true,
      enablePlainText: true,
      enableEmbeddings: true,
      embeddingStrategy: 'full-article',
      seoMetadata: true,
      openGraphData: false // Terminology entries don't need OG data
    }
  };
}

export function createLabEntry(config: {
  metadata: LabMetadata;
  sections: ContentSection[];
}): MultimodalContent<LabMetadata> {
  return {
    metadata: config.metadata,
    sections: config.sections,
    derivation: {
      enableMarkdown: true,
      enablePlainText: true,
      enableEmbeddings: false, // Lab descriptions don't need embeddings
      embeddingStrategy: 'full-article',
      seoMetadata: true,
      openGraphData: true
    }
  };
}

// Content validation utilities
export function validateContentMetadata<T extends ContentMetadata>(metadata: T): boolean {
  const required = ['id', 'title', 'description', 'tags', 'createdAt', 'updatedAt', 'author', 'status'];
  
  for (const field of required) {
    if (!metadata[field as keyof T]) {
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }

  if (!Array.isArray(metadata.tags) || metadata.tags.length === 0) {
    console.error('Tags must be a non-empty array');
    return false;
  }

  if (!['draft', 'published', 'archived'].includes(metadata.status)) {
    console.error('Invalid status. Must be draft, published, or archived');
    return false;
  }

  return true;
}

export function validateContentSections(sections: ContentSection[]): boolean {
  if (!Array.isArray(sections) || sections.length === 0) {
    console.error('Sections must be a non-empty array');
    return false;
  }

  for (const section of sections) {
    if (!section.id || !section.title || !section.component) {
      console.error(`Section missing required fields: ${JSON.stringify(section)}`);
      return false;
    }
  }

  // Check for duplicate section IDs
  const sectionIds = sections.map(s => s.id);
  const uniqueIds = new Set(sectionIds);
  if (sectionIds.length !== uniqueIds.size) {
    console.error('Duplicate section IDs found');
    return false;
  }

  return true;
}
```

## Migration Implementation

### Step 1: Create Content Directory Structure
```bash
#!/bin/bash
# scripts/migrate-to-content-directory.sh

echo "Creating content directory structure..."

# Create main content directories
mkdir -p content/{articles,contributors,terminology,labs}
mkdir -p content/derivation

# Create index files
touch content/index.ts
touch content/types.ts
touch content/registry.ts
touch content/factory.ts

# Create specific registry files
touch content/articles/{index.ts,types.ts}
touch content/contributors/{index.ts,types.ts,templates}
touch content/terminology/{index.ts,types.ts}
touch content/labs/{index.ts,types.ts}

# Create derivation utilities
touch content/derivation/{markdown-renderer.ts,embedding-generator.ts,search-indexer.ts}

echo "Content directory structure created successfully!"
```

### Step 2: Migrate Existing Articles
```typescript
// scripts/migrate-articles.ts
import { promises as fs } from 'fs';
import path from 'path';

interface ArticleMigrationConfig {
  sourceDir: string;
  targetDir: string;
  articleSlug: string;
}

async function migrateArticle(config: ArticleMigrationConfig) {
  const { sourceDir, targetDir, articleSlug } = config;
  
  // Create target directory
  const targetPath = path.join(targetDir, articleSlug);
  await fs.mkdir(targetPath, { recursive: true });
  await fs.mkdir(path.join(targetPath, 'sections'), { recursive: true });
  await fs.mkdir(path.join(targetPath, 'snippets'), { recursive: true });

  // Read source files
  const sourceFiles = await fs.readdir(sourceDir);
  
  for (const file of sourceFiles) {
    const sourcePath = path.join(sourceDir, file);
    const stat = await fs.stat(sourcePath);
    
    if (stat.isFile() && file.endsWith('.tsx')) {
      let targetSubdir = '';
      let newFileName = file;
      
      // Categorize files
      if (file.startsWith('section.')) {
        targetSubdir = 'sections';
        newFileName = file.replace('section.', '');
      } else if (file.startsWith('snippet.')) {
        targetSubdir = 'snippets';
        newFileName = file.replace('snippet.', '');
      }
      
      const targetFilePath = path.join(targetPath, targetSubdir, newFileName);
      
      // Read and potentially transform file content
      const content = await fs.readFile(sourcePath, 'utf-8');
      const transformedContent = await transformFileContent(content, file);
      
      await fs.writeFile(targetFilePath, transformedContent);
      console.log(`Migrated: ${sourcePath} → ${targetFilePath}`);
    }
  }
  
  // Create article metadata file
  await createArticleMetadata(targetPath, articleSlug);
  
  // Create main article file
  await createMainArticleFile(targetPath, articleSlug);
}

async function transformFileContent(content: string, fileName: string): Promise<string> {
  // Add multimodal imports if not present
  if (!content.includes('from \'@/lib/multimodal/v1\'')) {
    const imports = `import { MultimodalSection, MultimodalHeading, MultimodalParagraph, MultimodalCodeBlock } from '@/lib/multimodal/v1';\n`;
    content = imports + content;
  }
  
  // Transform component exports to be more explicit
  content = content.replace(/export default function/, 'export function');
  
  return content;
}

async function createArticleMetadata(targetPath: string, articleSlug: string): Promise<void> {
  const metadataContent = `
// content/articles/${articleSlug}/metadata.ts
import { ArticleMetadata } from '@/content/types';

export const metadata: ArticleMetadata = {
  id: '${articleSlug}',
  slug: '${articleSlug}',
  title: '${articleSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}',
  description: 'TODO: Add article description',
  tags: ['TODO'], // TODO: Add relevant tags
  createdAt: new Date(),
  updatedAt: new Date(),
  author: 'santi', // TODO: Update with actual author
  status: 'published',
  readingTime: 10, // TODO: Calculate actual reading time
  difficulty: 'intermediate', // TODO: Set appropriate difficulty
  prerequisites: [], // TODO: Add prerequisites
  learningObjectives: [], // TODO: Add learning objectives
  category: 'general' // TODO: Set appropriate category
};
`;
  
  await fs.writeFile(path.join(targetPath, 'metadata.ts'), metadataContent.trim());
}

async function createMainArticleFile(targetPath: string, articleSlug: string): Promise<void> {
  const articleContent = `
// content/articles/${articleSlug}/article.tsx
import { createMultimodalArticle } from '@/content/factory';
import { metadata } from './metadata';

// Import sections
// TODO: Import actual section components

export const ${articleSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}Article = createMultimodalArticle({
  metadata,
  sections: [
    // TODO: Add sections
  ]
});

export default ${articleSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}Article;
`;
  
  await fs.writeFile(path.join(targetPath, 'article.tsx'), articleContent.trim());
}

// Run migration
async function main() {
  const articlesToMigrate = [
    {
      sourceDir: './articles/advanced-typescript-patterns-react',
      targetDir: './content/articles',
      articleSlug: 'typescript-patterns'
    }
  ];
  
  for (const article of articlesToMigrate) {
    await migrateArticle(article);
  }
  
  console.log('Article migration completed!');
}

if (require.main === module) {
  main().catch(console.error);
}
```

### Step 3: Update App Routes
```typescript
// app/article/[slug]/page.tsx - Updated to use content registry
import { contentRegistry } from '@/content';
import { notFound } from 'next/navigation';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const articles = contentRegistry.articles.getAll();
  return articles.map((article) => ({
    slug: article.metadata.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const article = contentRegistry.articles.getBySlug(params.slug);
  
  if (!article) {
    return {};
  }

  return {
    title: article.metadata.title,
    description: article.metadata.description,
    keywords: article.metadata.tags.join(', '),
    authors: [{ name: article.metadata.author }],
    openGraph: {
      title: article.metadata.title,
      description: article.metadata.description,
      type: 'article',
      publishedTime: article.metadata.publishedAt?.toISOString(),
      authors: [article.metadata.author],
      tags: article.metadata.tags,
    },
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = contentRegistry.articles.getBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="article-page">
      <header className="article-header">
        <h1>{article.metadata.title}</h1>
        <p className="article-description">{article.metadata.description}</p>
        <div className="article-meta">
          <span>By {article.metadata.author}</span>
          <span>{article.metadata.readingTime} min read</span>
          <span>Difficulty: {article.metadata.difficulty}</span>
        </div>
        <div className="article-tags">
          {article.metadata.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </header>
      
      <main className="article-content">
        {article.sections.map((section, index) => (
          <section key={section.id} className="article-section">
            <section.component />
          </section>
        ))}
      </main>
    </div>
  );
}
```

This comprehensive content directory architecture provides a solid foundation for implementing your content-as-source vision with full type safety, discoverability, and maintainability.
