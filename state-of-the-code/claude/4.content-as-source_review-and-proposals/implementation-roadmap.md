# Implementation Roadmap for Content-as-Source

**Phased implementation strategy for transitioning to content-as-source architecture**

## Implementation Overview

This roadmap provides a systematic approach to implementing your content-as-source vision while maintaining existing functionality and ensuring smooth transitions. The strategy emphasizes incremental improvements, testing at each phase, and maintaining backward compatibility.

### Implementation Principles

**Core Implementation Values:**
1. **Incremental Migration** - Gradual transition without disrupting existing content
2. **Parallel Systems** - Run old and new systems side-by-side during transition
3. **Content Preservation** - Zero content loss during migration
4. **Performance First** - Ensure new system performs better than current
5. **Developer Experience** - Improve authoring experience at each phase
6. **Automated Validation** - Comprehensive testing of content integrity

## Phase 1: Foundation & Directory Structure (Weeks 1-2)

### Week 1: Content Directory Setup

#### Day 1-2: Core Infrastructure
```bash
# Create content directory structure
mkdir -p content/{articles,contributors,terminology,labs,derivation}

# Set up type definitions
touch content/{types.ts,registry.ts,factory.ts,index.ts}

# Create specific registries
touch content/articles/{index.ts,types.ts}
touch content/contributors/{index.ts,types.ts}
touch content/terminology/{index.ts,types.ts}
touch content/labs/{index.ts,types.ts}

# Create derivation utilities
touch content/derivation/{markdown-renderer.ts,embedding-generator.ts,search-indexer.ts}
```

**Deliverables:**
- Complete content directory structure
- Base type definitions for all content types
- Registry system architecture
- Content factory functions

**Success Criteria:**
- All files created without TypeScript errors
- Basic content registry can be imported
- Type definitions are comprehensive and extensible

#### Day 3-5: Content Migration Scripts
```typescript
// scripts/content-migration/migrate-articles.ts
import { promises as fs } from 'fs';
import path from 'path';

interface MigrationPlan {
  articles: ArticleMigrationConfig[];
  validation: ValidationConfig;
  rollback: RollbackConfig;
}

export class ContentMigrationService {
  async executeMigrationPlan(plan: MigrationPlan): Promise<MigrationReport> {
    console.log('Starting content migration...');
    
    const report: MigrationReport = {
      articlesProcessed: 0,
      errors: [],
      warnings: [],
      timeElapsed: 0
    };

    const startTime = Date.now();

    try {
      // Validate source content
      await this.validateSourceContent(plan.articles);
      
      // Create backup
      await this.createContentBackup();
      
      // Migrate articles
      for (const articleConfig of plan.articles) {
        try {
          await this.migrateArticle(articleConfig);
          report.articlesProcessed++;
        } catch (error) {
          report.errors.push({
            article: articleConfig.slug,
            error: error.message,
            timestamp: new Date()
          });
        }
      }
      
      // Validate migrated content
      await this.validateMigratedContent();
      
      report.timeElapsed = Date.now() - startTime;
      console.log('Migration completed successfully!', report);
      
    } catch (error) {
      console.error('Migration failed:', error);
      await this.rollbackMigration(plan.rollback);
      throw error;
    }

    return report;
  }

  private async migrateArticle(config: ArticleMigrationConfig): Promise<void> {
    const { sourceDir, targetSlug, metadata } = config;
    
    // Create target directory
    const targetDir = path.join('content/articles', targetSlug);
    await fs.mkdir(targetDir, { recursive: true });
    await fs.mkdir(path.join(targetDir, 'sections'), { recursive: true });
    await fs.mkdir(path.join(targetDir, 'snippets'), { recursive: true });

    // Read source files
    const sourceFiles = await fs.readdir(sourceDir);
    
    // Process each file
    for (const file of sourceFiles) {
      if (file.endsWith('.tsx')) {
        await this.migrateComponentFile(
          path.join(sourceDir, file),
          targetDir,
          file
        );
      }
    }

    // Create metadata file
    await this.createMetadataFile(targetDir, metadata);
    
    // Create main article file
    await this.createMainArticleFile(targetDir, targetSlug, metadata);
    
    // Validate article structure
    await this.validateArticleStructure(targetDir);
  }

  private async migrateComponentFile(
    sourcePath: string,
    targetDir: string,
    fileName: string
  ): Promise<void> {
    const content = await fs.readFile(sourcePath, 'utf-8');
    
    // Transform content for multimodal compatibility
    const transformedContent = await this.transformComponentContent(content, fileName);
    
    // Determine target location
    const targetPath = this.determineTargetPath(targetDir, fileName);
    
    await fs.writeFile(targetPath, transformedContent);
    console.log(`Migrated: ${sourcePath} → ${targetPath}`);
  }

  private async transformComponentContent(content: string, fileName: string): Promise<string> {
    let transformed = content;

    // Add multimodal imports
    if (!content.includes('@/lib/multimodal/v1')) {
      const imports = `import { 
  MultimodalSection, 
  MultimodalHeading, 
  MultimodalParagraph, 
  MultimodalCodeBlock,
  MultimodalList,
  MultimodalCallout
} from '@/lib/multimodal/v1';\n`;
      transformed = imports + transformed;
    }

    // Transform section components to use multimodal wrappers
    transformed = transformed.replace(
      /export default function (\w+Section)/g,
      'export function $1'
    );

    // Wrap content in MultimodalSection if not already wrapped
    if (!transformed.includes('MultimodalSection')) {
      transformed = transformed.replace(
        /(export function \w+Section[^{]*{)/,
        '$1\n  return (\n    <MultimodalSection>'
      );
      transformed = transformed.replace(/}$/, '    </MultimodalSection>\n  );\n}');
    }

    return transformed;
  }

  private determineTargetPath(targetDir: string, fileName: string): string {
    if (fileName.startsWith('section.')) {
      const sectionName = fileName.replace('section.', '').replace('.tsx', '.tsx');
      return path.join(targetDir, 'sections', sectionName);
    }
    
    if (fileName.startsWith('snippet.')) {
      const snippetName = fileName.replace('snippet.', '').replace('.tsx', '.tsx');
      return path.join(targetDir, 'snippets', snippetName);
    }
    
    return path.join(targetDir, fileName);
  }

  private async createMetadataFile(targetDir: string, metadata: ArticleMetadata): Promise<void> {
    const metadataContent = `
// Generated metadata for migrated article
import { ArticleMetadata } from '@/content/types';

export const metadata: ArticleMetadata = {
  id: '${metadata.id}',
  slug: '${metadata.slug}',
  title: '${metadata.title}',
  description: '${metadata.description}',
  tags: ${JSON.stringify(metadata.tags, null, 2)},
  createdAt: new Date('${metadata.createdAt.toISOString()}'),
  updatedAt: new Date('${metadata.updatedAt.toISOString()}'),
  author: '${metadata.author}',
  status: '${metadata.status}',
  readingTime: ${metadata.readingTime},
  difficulty: '${metadata.difficulty}',
  prerequisites: ${JSON.stringify(metadata.prerequisites, null, 2)},
  learningObjectives: ${JSON.stringify(metadata.learningObjectives, null, 2)},
  category: '${metadata.category}'
};
    `.trim();

    await fs.writeFile(path.join(targetDir, 'metadata.ts'), metadataContent);
  }

  private async createMainArticleFile(
    targetDir: string, 
    slug: string, 
    metadata: ArticleMetadata
  ): Promise<void> {
    // Scan for section files
    const sectionsDir = path.join(targetDir, 'sections');
    let sectionImports = '';
    let sectionArray = '';

    try {
      const sectionFiles = await fs.readdir(sectionsDir);
      const sections = sectionFiles
        .filter(file => file.endsWith('.tsx'))
        .map(file => {
          const name = file.replace('.tsx', '');
          const componentName = name.charAt(0).toUpperCase() + name.slice(1) + 'Section';
          return { name, componentName, file };
        });

      sectionImports = sections
        .map(section => `import { ${section.componentName} } from './sections/${section.name}';`)
        .join('\n');

      sectionArray = sections
        .map(section => `{
      id: '${section.name}',
      title: '${section.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}',
      component: ${section.componentName}
    }`)
        .join(',\n    ');
    } catch (error) {
      // No sections directory or files
    }

    const articleContent = `
import { createMultimodalArticle } from '@/content/factory';
import { metadata } from './metadata';
${sectionImports}

export const ${slug.replace(/-/g, '')}Article = createMultimodalArticle({
  metadata,
  sections: [
    ${sectionArray}
  ]
});

export default ${slug.replace(/-/g, '')}Article;
    `.trim();

    await fs.writeFile(path.join(targetDir, 'article.tsx'), articleContent);
  }
}

interface ArticleMigrationConfig {
  sourceDir: string;
  targetSlug: string;
  metadata: ArticleMetadata;
}

interface MigrationReport {
  articlesProcessed: number;
  errors: Array<{
    article: string;
    error: string;
    timestamp: Date;
  }>;
  warnings: string[];
  timeElapsed: number;
}

// Migration execution script
async function executeMigration() {
  const migrationService = new ContentMigrationService();
  
  const plan: MigrationPlan = {
    articles: [
      {
        sourceDir: './articles/advanced-typescript-patterns-react',
        targetSlug: 'typescript-patterns',
        metadata: {
          id: 'typescript-patterns',
          slug: 'typescript-patterns',
          title: 'Advanced TypeScript Patterns for React',
          description: 'Master advanced TypeScript patterns in React applications',
          tags: ['typescript', 'react', 'patterns', 'advanced'],
          createdAt: new Date('2025-09-01'),
          updatedAt: new Date(),
          author: 'santi',
          status: 'published',
          readingTime: 15,
          difficulty: 'advanced',
          prerequisites: ['typescript-basics', 'react-fundamentals'],
          learningObjectives: [
            'Understand advanced TypeScript patterns',
            'Implement type-safe React components',
            'Master conditional and mapped types'
          ],
          category: 'typescript'
        }
      }
    ],
    validation: {
      checkTypeScript: true,
      validateMetadata: true,
      verifyComponents: true
    },
    rollback: {
      enabled: true,
      backupLocation: './backups/content-migration'
    }
  };

  try {
    const report = await migrationService.executeMigrationPlan(plan);
    console.log('Migration completed successfully:', report);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  executeMigration();
}
```

### Week 2: Registry System Implementation

#### Content Registry and Factory Setup
```typescript
// content/registry.ts - Complete implementation
import { ArticleRegistry, ContributorRegistry, TerminologyRegistry, LabRegistry } from './registries';

export class ContentRegistry {
  private _articles = new ArticleRegistry();
  private _contributors = new ContributorRegistry();
  private _terminology = new TerminologyRegistry();
  private _labs = new LabRegistry();

  get articles() { return this._articles; }
  get contributors() { return this._contributors; }
  get terminology() { return this._terminology; }
  get labs() { return this._labs; }

  async initialize(): Promise<void> {
    console.log('Initializing content registry...');
    
    // Load all content from filesystem
    await this.loadArticles();
    await this.loadContributors();
    await this.loadTerminology();
    await this.loadLabs();
    
    console.log('Content registry initialized successfully!');
  }

  private async loadArticles(): Promise<void> {
    // Dynamically import all articles from content/articles/
    const articleModules = await this.importArticleModules();
    
    for (const [slug, module] of Object.entries(articleModules)) {
      if (module.default) {
        this._articles.register(module.default);
      }
    }
  }

  private async importArticleModules(): Promise<Record<string, any>> {
    // This would use dynamic imports to load all article modules
    // Implementation depends on your build system
    return {};
  }

  // Statistics and health checks
  getStats(): RegistryStats {
    return {
      articles: this._articles.getAll().length,
      contributors: this._contributors.getAll().length,
      terminology: this._terminology.getAll().length,
      labs: this._labs.getAll().length,
      lastUpdated: new Date()
    };
  }

  async validateIntegrity(): Promise<ValidationReport> {
    const report: ValidationReport = {
      valid: true,
      errors: [],
      warnings: []
    };

    // Validate cross-references
    const articles = this._articles.getAll();
    for (const article of articles) {
      // Check if author exists
      const author = this._contributors.getByUsername(article.metadata.author);
      if (!author) {
        report.warnings.push(`Article ${article.metadata.slug} references unknown author: ${article.metadata.author}`);
      }

      // Check prerequisites
      for (const prereq of article.metadata.prerequisites) {
        const prereqArticle = this._articles.getBySlug(prereq);
        if (!prereqArticle) {
          report.warnings.push(`Article ${article.metadata.slug} references unknown prerequisite: ${prereq}`);
        }
      }
    }

    if (report.errors.length > 0) {
      report.valid = false;
    }

    return report;
  }
}

// Global content registry instance
export const contentRegistry = new ContentRegistry();

interface RegistryStats {
  articles: number;
  contributors: number;
  terminology: number;
  labs: number;
  lastUpdated: Date;
}

interface ValidationReport {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
```

**Week 2 Deliverables:**
- Fully functional content registry system
- Article migration scripts with validation
- Content validation and integrity checking
- Basic content factory functions

## Phase 2: Content Enhancement & Derivation (Weeks 3-4)

### Week 3: Multimodal Component Enhancement

#### Enhanced Multimodal System
```typescript
// lib/multimodal/v1/enhanced-components.tsx
import React from 'react';
import { BaseMultimodalComponent, RenderContext } from './base-component';

export class EnhancedMultimodalSection extends BaseMultimodalComponent {
  render(): React.ReactElement {
    const { id, children, className, ...props } = this.props;
    
    return (
      <section id={id} className={`multimodal-section ${className || ''}`} {...props}>
        {children}
      </section>
    );
  }

  async renderToMarkdown(context: RenderContext): Promise<string> {
    const childrenMarkdown = await this.renderChildrenToMarkdown(context);
    return `${childrenMarkdown}\n\n`;
  }

  async renderToJSONLD(context: RenderContext): Promise<object> {
    return {
      '@type': 'Section',
      'identifier': this.props.id,
      'hasPart': await this.renderChildrenToJSONLD(context)
    };
  }

  private async renderChildrenToMarkdown(context: RenderContext): Promise<string> {
    const { children } = this.props;
    
    if (typeof children === 'string') {
      return children;
    }
    
    if (React.isValidElement(children)) {
      return await this.renderElementToMarkdown(children, context);
    }
    
    if (Array.isArray(children)) {
      const rendered = await Promise.all(
        children.map(child => 
          React.isValidElement(child) 
            ? this.renderElementToMarkdown(child, context)
            : String(child)
        )
      );
      return rendered.join('');
    }
    
    return '';
  }

  private async renderElementToMarkdown(element: React.ReactElement, context: RenderContext): Promise<string> {
    // If the element has a renderToMarkdown method, use it
    if (element.type && typeof element.type === 'function') {
      try {
        const component = new (element.type as any)(element.props);
        if (component.renderToMarkdown) {
          return await component.renderToMarkdown(context);
        }
      } catch (error) {
        console.warn('Failed to render element to markdown:', error);
      }
    }
    
    // Fallback to basic element rendering
    return this.fallbackElementRender(element);
  }

  private fallbackElementRender(element: React.ReactElement): string {
    const { type, props } = element;
    
    if (typeof type === 'string') {
      switch (type) {
        case 'p':
          return `${props.children}\n\n`;
        case 'h1':
          return `# ${props.children}\n\n`;
        case 'h2':
          return `## ${props.children}\n\n`;
        case 'h3':
          return `### ${props.children}\n\n`;
        case 'strong':
          return `**${props.children}**`;
        case 'em':
          return `*${props.children}*`;
        case 'code':
          return `\`${props.children}\``;
        default:
          return String(props.children || '');
      }
    }
    
    return '';
  }
}

export class EnhancedMultimodalCodeBlock extends BaseMultimodalComponent {
  render(): React.ReactElement {
    const { language, code, title, filename, highlights, showLineNumbers = true } = this.props;
    
    return (
      <div className="multimodal-code-block">
        {(title || filename) && (
          <div className="code-header">
            {title && <span className="code-title">{title}</span>}
            {filename && <span className="code-filename">{filename}</span>}
          </div>
        )}
        <pre className={`language-${language}`} data-line-numbers={showLineNumbers}>
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  async renderToMarkdown(context: RenderContext): Promise<string> {
    const { language, code, title, filename } = this.props;
    
    let markdown = '';
    
    if (title || filename) {
      markdown += `**${title || filename}**\n\n`;
    }
    
    markdown += `\`\`\`${language}\n${code}\n\`\`\`\n\n`;
    
    return markdown;
  }

  async renderToJSONLD(context: RenderContext): Promise<object> {
    const { language, code, title, filename } = this.props;
    
    return {
      '@type': 'SoftwareSourceCode',
      'programmingLanguage': language,
      'codeValue': code,
      'name': title || filename,
      'encodingFormat': `text/x-${language}`
    };
  }

  // Special method for extracting code for embeddings
  extractCodeSnippet(): { language: string; code: string; description?: string } {
    return {
      language: this.props.language,
      code: this.props.code,
      description: this.props.title || this.props.filename
    };
  }
}

// Interactive component with fallback rendering
export class EnhancedMultimodalInteractive extends BaseMultimodalComponent {
  render(): React.ReactElement {
    const { component: Component, props: componentProps, fallback, id } = this.props;
    
    return (
      <div className="multimodal-interactive" id={id}>
        <React.Suspense fallback={<div>Loading interactive content...</div>}>
          {Component ? (
            <Component {...componentProps} />
          ) : (
            <div className="interactive-fallback">
              {fallback || 'Interactive content not available'}
            </div>
          )}
        </React.Suspense>
      </div>
    );
  }

  async renderToMarkdown(context: RenderContext): Promise<string> {
    const { fallback, description, id } = this.props;
    
    if (fallback) {
      return `${fallback}\n\n`;
    }
    
    return `*[Interactive Component${description ? `: ${description}` : ''}${id ? ` (${id})` : ''}]*\n\n`;
  }

  async renderToJSONLD(context: RenderContext): Promise<object> {
    const { description, id, component } = this.props;
    
    return {
      '@type': 'MediaObject',
      'identifier': id,
      'name': description || 'Interactive Component',
      'encodingFormat': 'application/javascript',
      'interactionStatistic': {
        '@type': 'InteractionCounter',
        'interactionType': 'UserInteraction'
      }
    };
  }
}
```

### Week 4: Content Derivation Pipeline

#### Complete Derivation System
```typescript
// content/derivation/complete-pipeline.ts
import { MultimodalContent, ContentSection } from '@/content/types';
import { EnhancedEmbeddingService } from '@/lib/ai/enhanced-embedding-service';
import { VectorStore } from '@/lib/ai/vector-store';

export class CompleteContentDerivationPipeline {
  constructor(
    private embeddingService: EnhancedEmbeddingService,
    private vectorStore: VectorStore
  ) {}

  async processContentItem<T>(content: MultimodalContent<T>): Promise<ProcessingResult> {
    console.log(`Processing content: ${content.metadata.title}`);
    
    const result: ProcessingResult = {
      contentId: content.metadata.id,
      artifacts: [],
      embeddings: [],
      searchIndex: null,
      metadata: {
        processedAt: new Date(),
        processingTime: 0,
        errors: [],
        warnings: []
      }
    };

    const startTime = Date.now();

    try {
      // Generate all derivation artifacts
      if (content.derivation.enableMarkdown) {
        const markdown = await this.generateMarkdown(content);
        result.artifacts.push({
          type: 'markdown',
          content: markdown,
          metadata: { generatedAt: new Date() }
        });
      }

      if (content.derivation.enablePlainText) {
        const plainText = await this.generatePlainText(content);
        result.artifacts.push({
          type: 'plaintext',
          content: plainText,
          metadata: { generatedAt: new Date() }
        });
      }

      // Generate embeddings based on strategy
      if (content.derivation.enableEmbeddings) {
        const embeddings = await this.generateEmbeddings(content);
        result.embeddings = embeddings;
        
        // Store embeddings in vector store
        await this.vectorStore.storeEmbeddings(embeddings);
      }

      // Generate search index data
      result.searchIndex = await this.generateSearchIndex(content, result.artifacts);

      // Generate SEO and OpenGraph metadata
      if (content.derivation.seoMetadata) {
        const seoData = await this.generateSEOMetadata(content);
        result.artifacts.push({
          type: 'seo',
          content: JSON.stringify(seoData),
          metadata: { generatedAt: new Date() }
        });
      }

      if (content.derivation.openGraphData) {
        const ogData = await this.generateOpenGraphData(content);
        result.artifacts.push({
          type: 'opengraph',
          content: JSON.stringify(ogData),
          metadata: { generatedAt: new Date() }
        });
      }

      result.metadata.processingTime = Date.now() - startTime;
      console.log(`✅ Processed ${content.metadata.title} in ${result.metadata.processingTime}ms`);

    } catch (error) {
      result.metadata.errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date()
      });
      console.error(`❌ Error processing ${content.metadata.title}:`, error);
    }

    return result;
  }

  async batchProcessContent(contentItems: MultimodalContent<any>[]): Promise<BatchProcessingResult> {
    console.log(`Starting batch processing of ${contentItems.length} content items...`);
    
    const batchResult: BatchProcessingResult = {
      totalItems: contentItems.length,
      processedItems: 0,
      errors: 0,
      warnings: 0,
      results: [],
      startTime: new Date(),
      endTime: null,
      totalProcessingTime: 0
    };

    const startTime = Date.now();

    // Process in parallel with concurrency limit
    const concurrencyLimit = 3;
    const chunks = this.chunkArray(contentItems, concurrencyLimit);

    for (const chunk of chunks) {
      const chunkResults = await Promise.allSettled(
        chunk.map(content => this.processContentItem(content))
      );

      for (const result of chunkResults) {
        if (result.status === 'fulfilled') {
          batchResult.results.push(result.value);
          batchResult.processedItems++;
          batchResult.errors += result.value.metadata.errors.length;
          batchResult.warnings += result.value.metadata.warnings.length;
        } else {
          batchResult.errors++;
          console.error('Batch processing error:', result.reason);
        }
      }
    }

    batchResult.endTime = new Date();
    batchResult.totalProcessingTime = Date.now() - startTime;

    console.log(`✅ Batch processing completed:`, {
      processed: batchResult.processedItems,
      errors: batchResult.errors,
      warnings: batchResult.warnings,
      timeElapsed: `${batchResult.totalProcessingTime}ms`
    });

    return batchResult;
  }

  private async generateMarkdown<T>(content: MultimodalContent<T>): Promise<string> {
    const context = {
      target: 'markdown' as const,
      options: { includeMetadata: true }
    };

    const sections = await Promise.all(
      content.sections.map(section => this.renderSectionToMarkdown(section, context))
    );

    return [
      `# ${content.metadata.title}`,
      '',
      content.metadata.description,
      '',
      `**Tags:** ${content.metadata.tags.join(', ')}`,
      `**Author:** ${content.metadata.author}`,
      `**Updated:** ${content.metadata.updatedAt.toDateString()}`,
      '',
      ...sections
    ].join('\n');
  }

  private async generatePlainText<T>(content: MultimodalContent<T>): Promise<string> {
    const markdown = await this.generateMarkdown(content);
    
    // Convert markdown to plain text
    return markdown
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '[CODE BLOCK]') // Replace code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with text
      .replace(/\n{3,}/g, '\n\n') // Normalize line breaks
      .trim();
  }

  private async generateEmbeddings<T>(content: MultimodalContent<T>): Promise<any[]> {
    return await this.embeddingService.generateContentEmbeddings(content);
  }

  private async generateSearchIndex<T>(content: MultimodalContent<T>, artifacts: any[]): Promise<any> {
    const plaintextArtifact = artifacts.find(a => a.type === 'plaintext');
    
    if (!plaintextArtifact) {
      return null;
    }

    return {
      id: content.metadata.id,
      title: content.metadata.title,
      description: content.metadata.description,
      content: plaintextArtifact.content,
      tags: content.metadata.tags,
      author: content.metadata.author,
      updatedAt: content.metadata.updatedAt,
      searchableText: [
        content.metadata.title,
        content.metadata.description,
        plaintextArtifact.content
      ].join(' ')
    };
  }

  private async renderSectionToMarkdown(section: ContentSection, context: any): Promise<string> {
    try {
      const component = new section.component({});
      if (component.renderToMarkdown) {
        return await component.renderToMarkdown(context);
      }
      
      return `## ${section.title}\n\n*[Section content not available]*\n\n`;
    } catch (error) {
      console.error(`Error rendering section ${section.id}:`, error);
      return `## ${section.title}\n\n*[Error rendering section]*\n\n`;
    }
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
}

interface ProcessingResult {
  contentId: string;
  artifacts: Array<{
    type: string;
    content: string;
    metadata: any;
  }>;
  embeddings: any[];
  searchIndex: any;
  metadata: {
    processedAt: Date;
    processingTime: number;
    errors: Array<{
      message: string;
      stack?: string;
      timestamp: Date;
    }>;
    warnings: string[];
  };
}

interface BatchProcessingResult {
  totalItems: number;
  processedItems: number;
  errors: number;
  warnings: number;
  results: ProcessingResult[];
  startTime: Date;
  endTime: Date | null;
  totalProcessingTime: number;
}
```

## Phase 3: Integration & RAG Enhancement (Weeks 5-6)

### Week 5: Vector Store and RAG Integration

#### Production-Ready RAG System
```typescript
// lib/ai/production-rag-system.ts
import { VectorStore } from './vector-store';
import { EnhancedEmbeddingService } from './enhanced-embedding-service';
import { contentRegistry } from '@/content/registry';

export class ProductionRAGSystem {
  constructor(
    private vectorStore: VectorStore,
    private embeddingService: EnhancedEmbeddingService,
    private openaiClient: any
  ) {}

  async initializeKnowledgeBase(): Promise<void> {
    console.log('Initializing RAG knowledge base...');
    
    // Ensure content registry is loaded
    await contentRegistry.initialize();
    
    // Process all content for RAG
    await this.processAllContentForRAG();
    
    console.log('RAG knowledge base initialized successfully!');
  }

  private async processAllContentForRAG(): Promise<void> {
    const allContent = [
      ...contentRegistry.articles.getAll(),
      ...contentRegistry.terminology.getAll(),
      ...contentRegistry.labs.getAll()
    ];

    console.log(`Processing ${allContent.length} content items for RAG...`);

    for (const content of allContent) {
      try {
        const embeddings = await this.embeddingService.generateContentEmbeddings(content);
        await this.vectorStore.storeEmbeddings(embeddings);
        console.log(`✅ Processed ${content.metadata.title}`);
      } catch (error) {
        console.error(`❌ Error processing ${content.metadata.title}:`, error);
      }
    }
  }

  async answerQuestion(
    question: string,
    context: {
      conversationHistory?: any[];
      userPreferences?: {
        difficulty?: string;
        technologies?: string[];
      };
    } = {}
  ): Promise<RAGResponse> {
    // Retrieve relevant context
    const relevantContext = await this.retrieveContext(question, context.userPreferences);
    
    // Build prompt with context
    const prompt = this.buildRAGPrompt(question, relevantContext, context);
    
    // Generate response
    const response = await this.generateResponse(prompt, context.conversationHistory);
    
    return {
      answer: response.content,
      sources: this.formatSources(relevantContext),
      confidence: this.calculateConfidence(relevantContext),
      relatedTopics: await this.findRelatedTopics(question, relevantContext)
    };
  }

  private async retrieveContext(
    question: string, 
    preferences?: { difficulty?: string; technologies?: string[] }
  ): Promise<any[]> {
    const vectorQuery = {
      query: question,
      filters: {
        ...(preferences?.difficulty && { difficulty: [preferences.difficulty] }),
        ...(preferences?.technologies && { technologies: preferences.technologies }),
        minSimilarity: 0.7
      },
      limit: 5
    };

    return await this.vectorStore.hybridSearch(vectorQuery);
  }

  private buildRAGPrompt(question: string, context: any[], conversationContext: any): string {
    const contextText = context
      .map(item => {
        const content = item.embedding.content;
        return `
## ${content.title}
${content.text}
${content.code ? '\n```\n' + content.code.join('\n') + '\n```' : ''}
        `.trim();
      })
      .join('\n\n---\n\n');

    return `
You are a helpful TypeScript and React programming assistant. Use the following context from our knowledge base to answer the user's question.

Context from knowledge base:
${contextText}

Instructions:
- Provide accurate, helpful answers based on the context
- Include relevant code examples when appropriate
- If the context doesn't fully answer the question, clearly state what you can and cannot help with
- Reference specific sources when helpful
- Be concise but thorough

Question: ${question}
    `.trim();
  }

  private async generateResponse(prompt: string, history?: any[]): Promise<any> {
    const messages = [
      { role: 'system', content: prompt },
      ...(history || []).slice(-5), // Keep recent conversation context
      { role: 'user', content: prompt.split('Question: ')[1] }
    ];

    const response = await this.openaiClient.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.choices[0].message;
  }

  private formatSources(context: any[]): RAGSource[] {
    return context.map(item => {
      const embedding = item.embedding;
      const metadata = embedding.metadata;
      
      return {
        title: embedding.content.title,
        url: metadata.source,
        snippet: item.relevantContext,
        type: metadata.contentType,
        similarity: item.similarity
      };
    });
  }

  private calculateConfidence(context: any[]): number {
    if (context.length === 0) return 0;
    
    const avgSimilarity = context.reduce((sum, item) => sum + item.similarity, 0) / context.length;
    const coverage = Math.min(context.length / 3, 1); // Ideal is 3+ sources
    
    return (avgSimilarity * 0.7) + (coverage * 0.3);
  }

  private async findRelatedTopics(question: string, context: any[]): Promise<string[]> {
    // Extract tags from retrieved context
    const allTags = context.reduce((tags, item) => {
      return [...tags, ...item.embedding.content.tags];
    }, []);
    
    // Get unique tags, sorted by frequency
    const tagCounts = allTags.reduce((counts, tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
      return counts;
    }, {});
    
    return Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag);
  }
}

interface RAGResponse {
  answer: string;
  sources: RAGSource[];
  confidence: number;
  relatedTopics: string[];
}

interface RAGSource {
  title: string;
  url: string;
  snippet: string;
  type: string;
  similarity: number;
}
```

### Week 6: API Integration and Testing

#### Content-Aware API Routes
```typescript
// app/api/content/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { contentRegistry } from '@/content/registry';
import { ProductionRAGSystem } from '@/lib/ai/production-rag-system';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const [contentType, ...pathSegments] = params.path;

  try {
    switch (contentType) {
      case 'articles':
        return handleArticleRequest(pathSegments, request);
      case 'search':
        return handleSearchRequest(request);
      case 'rag':
        return handleRAGRequest(request);
      default:
        return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Content API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleArticleRequest(pathSegments: string[], request: NextRequest): Promise<NextResponse> {
  const [slug, format] = pathSegments;
  
  if (!slug) {
    // Return all articles
    const articles = contentRegistry.articles.getAll();
    return NextResponse.json({
      articles: articles.map(article => ({
        slug: article.metadata.slug,
        title: article.metadata.title,
        description: article.metadata.description,
        tags: article.metadata.tags,
        difficulty: article.metadata.difficulty,
        readingTime: article.metadata.readingTime,
        updatedAt: article.metadata.updatedAt
      }))
    });
  }

  const article = contentRegistry.articles.getBySlug(slug);
  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }

  // Return different formats based on request
  switch (format) {
    case 'markdown':
      const markdown = await generateMarkdownForArticle(article);
      return new NextResponse(markdown, {
        headers: { 'Content-Type': 'text/markdown' }
      });
    case 'json':
    default:
      return NextResponse.json({
        metadata: article.metadata,
        sections: article.sections.map(section => ({
          id: section.id,
          title: section.title,
          tags: section.tags
        }))
      });
  }
}

async function handleSearchRequest(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const contentTypes = searchParams.get('types')?.split(',') || ['article'];
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
  }

  const results = contentRegistry.searchAll(query, contentTypes as any);
  
  return NextResponse.json({
    query,
    results: results.slice(0, limit).map(result => ({
      id: result.metadata.id,
      title: result.metadata.title,
      description: result.metadata.description,
      type: getContentTypeFromMetadata(result.metadata),
      tags: result.metadata.tags,
      url: generateContentURL(result.metadata)
    })),
    total: results.length
  });
}

async function handleRAGRequest(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  const { question, context } = body;

  if (!question) {
    return NextResponse.json({ error: 'Question required' }, { status: 400 });
  }

  const ragSystem = new ProductionRAGSystem(/* dependencies */);
  const response = await ragSystem.answerQuestion(question, context);
  
  return NextResponse.json(response);
}

function getContentTypeFromMetadata(metadata: any): string {
  if ('slug' in metadata) return 'article';
  if ('username' in metadata) return 'contributor';
  if ('concept' in metadata) return 'terminology';
  if ('route' in metadata) return 'lab';
  return 'unknown';
}

function generateContentURL(metadata: any): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  
  if ('slug' in metadata) return `${baseUrl}/article/${metadata.slug}`;
  if ('username' in metadata) return `${baseUrl}/contributor/${metadata.username}`;
  if ('concept' in metadata) return `${baseUrl}/terminology/${metadata.concept}`;
  if ('route' in metadata) return `${baseUrl}${metadata.route}`;
  
  return `${baseUrl}/content/${metadata.id}`;
}

async function generateMarkdownForArticle(article: any): Promise<string> {
  // Use the content derivation pipeline to generate markdown
  // This would be implemented using your derivation system
  return `# ${article.metadata.title}\n\n${article.metadata.description}`;
}
```

## Success Metrics and Validation

### Phase Completion Criteria

**Phase 1 Success Metrics:**
- ✅ All existing content migrated without loss
- ✅ Content registry fully functional with type safety
- ✅ Zero TypeScript compilation errors
- ✅ Migration rollback tested and working
- ✅ Content validation passes 100%

**Phase 2 Success Metrics:**
- ✅ All content supports multimodal rendering
- ✅ Markdown/plain text derivation working
- ✅ Content derivation pipeline processes all content under 60 seconds
- ✅ Enhanced multimodal components fully tested
- ✅ Content integrity maintained throughout processing

**Phase 3 Success Metrics:**
- ✅ RAG system answers questions with >85% accuracy
- ✅ Vector search returns relevant results with <200ms response time
- ✅ API endpoints handle content requests efficiently
- ✅ Content-aware search integrates seamlessly
- ✅ Production deployment successful with zero downtime

### Long-term Maintenance Plan

**Automated Content Processing:**
- Build-time content derivation pipeline
- Automatic embedding generation on content changes
- CI/CD integration for content validation
- Performance monitoring and alerting

**Content Quality Assurance:**
- Automated content validation on every commit
- Cross-reference integrity checking
- Performance regression testing
- Content freshness monitoring

This comprehensive roadmap ensures a smooth transition to your content-as-source architecture while maintaining system reliability and improving developer experience at every phase.
