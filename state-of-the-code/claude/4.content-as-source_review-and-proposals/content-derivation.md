# Content Derivation Pipeline

**Comprehensive system for transforming multimodal content into multiple target formats**

## Content Derivation Overview

Your content-as-source philosophy requires sophisticated content derivation capabilities to transform authored multimodal components into various output formats. This pipeline enables the same canonical content to serve multiple purposes: human reading, search indexing, RAG context, social media previews, and API consumption.

### Derivation Targets

**Primary Derivation Formats:**
1. **Markdown** - For embedding generation, documentation, and external consumption
2. **Plain Text** - For search indexing and text analysis
3. **JSON-LD** - For structured data and semantic web
4. **OpenGraph Metadata** - For social media and link previews
5. **SEO Metadata** - For search engine optimization
6. **Vector Embeddings** - For semantic search and RAG

## Multimodal Rendering Engine

### Enhanced Multimodal Component System

```typescript
// lib/multimodal/v1/enhanced-renderer.ts
import { ReactElement, ComponentType } from 'react';
import { renderToString } from 'react-dom/server';

export interface RenderContext {
  target: 'html' | 'markdown' | 'plaintext' | 'json-ld';
  options: {
    includeMetadata?: boolean;
    includeInteractive?: boolean;
    maxDepth?: number;
    sectionId?: string;
  };
}

export interface MultimodalRenderer {
  renderToHTML(context: RenderContext): Promise<string>;
  renderToMarkdown(context: RenderContext): Promise<string>;
  renderToPlainText(context: RenderContext): Promise<string>;
  renderToJSONLD(context: RenderContext): Promise<object>;
}

export abstract class BaseMultimodalComponent implements MultimodalRenderer {
  protected props: any;
  protected children?: React.ReactNode;

  constructor(props: any) {
    this.props = props;
    this.children = props.children;
  }

  // React component render method
  abstract render(): ReactElement;

  // HTML rendering (default React behavior)
  async renderToHTML(context: RenderContext): Promise<string> {
    const element = this.render();
    return renderToString(element);
  }

  // Markdown rendering (abstract, implemented by each component)
  abstract renderToMarkdown(context: RenderContext): Promise<string>;

  // Plain text rendering (strip all formatting)
  async renderToPlainText(context: RenderContext): Promise<string> {
    const markdown = await this.renderToMarkdown(context);
    // Strip markdown formatting
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

  // JSON-LD rendering (structured data)
  async renderToJSONLD(context: RenderContext): Promise<object> {
    return {
      '@type': 'TextDigitalDocument',
      'text': await this.renderToPlainText(context),
      'encodingFormat': 'text/plain'
    };
  }
}

// Enhanced multimodal components with derivation support
export class MultimodalHeading extends BaseMultimodalComponent {
  render(): ReactElement {
    const { level = 1, children, anchor, ...props } = this.props;
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    
    return (
      <Tag id={anchor} {...props}>
        {children}
      </Tag>
    );
  }

  async renderToMarkdown(context: RenderContext): Promise<string> {
    const { level = 1, children, anchor } = this.props;
    const heading = '#'.repeat(level);
    const text = typeof children === 'string' ? children : this.extractTextContent(children);
    
    let markdown = `${heading} ${text}`;
    
    if (anchor && context.options.includeMetadata) {
      markdown += ` {#${anchor}}`;
    }
    
    return markdown + '\n\n';
  }

  async renderToJSONLD(context: RenderContext): Promise<object> {
    const { level = 1, children } = this.props;
    const text = typeof children === 'string' ? children : this.extractTextContent(children);
    
    return {
      '@type': 'Article',
      'headline': text,
      'position': level,
      'identifier': this.props.anchor
    };
  }

  private extractTextContent(children: React.ReactNode): string {
    if (typeof children === 'string') return children;
    if (typeof children === 'number') return children.toString();
    if (Array.isArray(children)) {
      return children.map(child => this.extractTextContent(child)).join('');
    }
    return '';
  }
}

export class MultimodalCodeBlock extends BaseMultimodalComponent {
  render(): ReactElement {
    const { language, code, title, filename, highlights, showLineNumbers = true } = this.props;
    
    return (
      <div className="code-block">
        {(title || filename) && (
          <div className="code-header">
            {title && <span className="code-title">{title}</span>}
            {filename && <span className="code-filename">{filename}</span>}
          </div>
        )}
        <pre className={`language-${language}`}>
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

  async renderToPlainText(context: RenderContext): Promise<string> {
    const { code, title, filename } = this.props;
    
    let text = '';
    
    if (title || filename) {
      text += `${title || filename}\n\n`;
    }
    
    text += `[CODE BLOCK]\n${code}\n[/CODE BLOCK]\n\n`;
    
    return text;
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
}

export class MultimodalInteractiveSection extends BaseMultimodalComponent {
  render(): ReactElement {
    const { component: Component, props: componentProps, fallback } = this.props;
    
    if (!Component) {
      return <div className="interactive-fallback">{fallback || 'Interactive content not available'}</div>;
    }
    
    return <Component {...componentProps} />;
  }

  async renderToMarkdown(context: RenderContext): Promise<string> {
    const { fallback, description } = this.props;
    
    if (!context.options.includeInteractive) {
      return `*[Interactive content: ${description || 'Interactive component'}]*\n\n`;
    }
    
    // For markdown, render the fallback content
    if (fallback) {
      return `${fallback}\n\n`;
    }
    
    return `*[Interactive component not available in this format]*\n\n`;
  }

  async renderToPlainText(context: RenderContext): Promise<string> {
    const { description } = this.props;
    return `[INTERACTIVE: ${description || 'Interactive component'}]\n\n`;
  }

  async renderToJSONLD(context: RenderContext): Promise<object> {
    const { description, component } = this.props;
    
    return {
      '@type': 'MediaObject',
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

### Content Derivation Service

```typescript
// content/derivation/content-derivation-service.ts
import { MultimodalContent, ContentSection, RenderContext } from '@/content/types';
import { EmbeddingService } from '@/lib/ai/embedding-service';
import { SearchIndexService } from '@/lib/search/search-index-service';

export interface DerivedContentArtifact {
  contentId: string;
  contentType: string;
  format: 'markdown' | 'plaintext' | 'json-ld' | 'html';
  content: string;
  metadata: {
    generatedAt: Date;
    sourceVersion: string;
    derivationOptions: any;
  };
}

export interface ContentEmbedding {
  contentId: string;
  sectionId?: string;
  vector: number[];
  metadata: {
    contentType: string;
    title: string;
    tags: string[];
    length: number;
    generatedAt: Date;
  };
}

export class ContentDerivationService {
  constructor(
    private embeddingService: EmbeddingService,
    private searchIndexService: SearchIndexService
  ) {}

  async deriveAllFormats<T>(content: MultimodalContent<T>): Promise<{
    artifacts: DerivedContentArtifact[];
    embeddings: ContentEmbedding[];
    searchableContent: any;
  }> {
    const artifacts: DerivedContentArtifact[] = [];
    const embeddings: ContentEmbedding[] = [];

    // Generate full article artifacts
    if (content.derivation.enableMarkdown) {
      const markdown = await this.renderToMarkdown(content);
      artifacts.push(this.createArtifact(content.metadata.id, 'markdown', markdown));
    }

    if (content.derivation.enablePlainText) {
      const plainText = await this.renderToPlainText(content);
      artifacts.push(this.createArtifact(content.metadata.id, 'plaintext', plainText));
    }

    // Generate section-level artifacts and embeddings
    for (const section of content.sections) {
      const sectionArtifacts = await this.deriveSectionContent(content.metadata.id, section);
      artifacts.push(...sectionArtifacts);

      if (content.derivation.enableEmbeddings) {
        const sectionEmbedding = await this.generateSectionEmbedding(content.metadata.id, section);
        if (sectionEmbedding) {
          embeddings.push(sectionEmbedding);
        }
      }
    }

    // Generate full article embedding if strategy requires it
    if (content.derivation.enableEmbeddings && 
        (content.derivation.embeddingStrategy === 'full-article' || 
         content.derivation.embeddingStrategy === 'hybrid')) {
      const fullEmbedding = await this.generateFullArticleEmbedding(content);
      if (fullEmbedding) {
        embeddings.push(fullEmbedding);
      }
    }

    // Create searchable content index
    const searchableContent = await this.createSearchableContent(content, artifacts);

    return {
      artifacts,
      embeddings,
      searchableContent
    };
  }

  private async renderToMarkdown<T>(content: MultimodalContent<T>): Promise<string> {
    const context: RenderContext = {
      target: 'markdown',
      options: {
        includeMetadata: true,
        includeInteractive: false
      }
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

  private async renderToPlainText<T>(content: MultimodalContent<T>): Promise<string> {
    const context: RenderContext = {
      target: 'plaintext',
      options: {
        includeMetadata: false,
        includeInteractive: false
      }
    };

    const sections = await Promise.all(
      content.sections.map(section => this.renderSectionToPlainText(section, context))
    );

    return [
      content.metadata.title,
      '',
      content.metadata.description,
      '',
      ...sections
    ].join('\n');
  }

  private async renderSectionToMarkdown(section: ContentSection, context: RenderContext): Promise<string> {
    try {
      // Assuming the component implements the MultimodalRenderer interface
      const component = new section.component({});
      if ('renderToMarkdown' in component && typeof component.renderToMarkdown === 'function') {
        return await component.renderToMarkdown(context);
      }
      
      // Fallback: render as React and convert
      return await this.convertReactToMarkdown(section.component);
    } catch (error) {
      console.error(`Error rendering section ${section.id} to markdown:`, error);
      return `## ${section.title}\n\n*[Content could not be rendered]*\n\n`;
    }
  }

  private async renderSectionToPlainText(section: ContentSection, context: RenderContext): Promise<string> {
    try {
      const component = new section.component({});
      if ('renderToPlainText' in component && typeof component.renderToPlainText === 'function') {
        return await component.renderToPlainText(context);
      }
      
      // Fallback: convert markdown to plain text
      const markdown = await this.renderSectionToMarkdown(section, context);
      return this.convertMarkdownToPlainText(markdown);
    } catch (error) {
      console.error(`Error rendering section ${section.id} to plain text:`, error);
      return `${section.title}\n\n[Content could not be rendered]\n\n`;
    }
  }

  private async deriveSectionContent(contentId: string, section: ContentSection): Promise<DerivedContentArtifact[]> {
    const artifacts: DerivedContentArtifact[] = [];
    
    const markdownContext: RenderContext = {
      target: 'markdown',
      options: { includeMetadata: true, sectionId: section.id }
    };
    
    const plaintextContext: RenderContext = {
      target: 'plaintext', 
      options: { includeMetadata: false, sectionId: section.id }
    };

    try {
      const markdown = await this.renderSectionToMarkdown(section, markdownContext);
      artifacts.push(this.createArtifact(`${contentId}:${section.id}`, 'markdown', markdown));
      
      const plaintext = await this.renderSectionToPlainText(section, plaintextContext);
      artifacts.push(this.createArtifact(`${contentId}:${section.id}`, 'plaintext', plaintext));
    } catch (error) {
      console.error(`Error deriving content for section ${section.id}:`, error);
    }

    return artifacts;
  }

  private async generateSectionEmbedding(contentId: string, section: ContentSection): Promise<ContentEmbedding | null> {
    try {
      const context: RenderContext = {
        target: 'plaintext',
        options: { includeMetadata: false, sectionId: section.id }
      };
      
      const plainText = await this.renderSectionToPlainText(section, context);
      
      if (plainText.trim().length < 50) {
        // Skip very short sections
        return null;
      }

      const vector = await this.embeddingService.generateEmbedding(plainText);
      
      return {
        contentId: `${contentId}:${section.id}`,
        sectionId: section.id,
        vector,
        metadata: {
          contentType: 'section',
          title: section.title,
          tags: section.tags || [],
          length: plainText.length,
          generatedAt: new Date()
        }
      };
    } catch (error) {
      console.error(`Error generating embedding for section ${section.id}:`, error);
      return null;
    }
  }

  private async generateFullArticleEmbedding<T>(content: MultimodalContent<T>): Promise<ContentEmbedding | null> {
    try {
      const plainText = await this.renderToPlainText(content);
      const vector = await this.embeddingService.generateEmbedding(plainText);
      
      return {
        contentId: content.metadata.id,
        vector,
        metadata: {
          contentType: 'article',
          title: content.metadata.title,
          tags: content.metadata.tags,
          length: plainText.length,
          generatedAt: new Date()
        }
      };
    } catch (error) {
      console.error(`Error generating full article embedding for ${content.metadata.id}:`, error);
      return null;
    }
  }

  private createArtifact(contentId: string, format: string, content: string): DerivedContentArtifact {
    return {
      contentId,
      contentType: 'derived',
      format: format as any,
      content,
      metadata: {
        generatedAt: new Date(),
        sourceVersion: '1.0', // Could be derived from git hash
        derivationOptions: {}
      }
    };
  }

  private async createSearchableContent<T>(
    content: MultimodalContent<T>, 
    artifacts: DerivedContentArtifact[]
  ): Promise<any> {
    const plaintextArtifact = artifacts.find(a => a.format === 'plaintext' && !a.contentId.includes(':'));
    
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
      searchVector: await this.embeddingService.generateEmbedding(plaintextArtifact.content)
    };
  }

  private async convertReactToMarkdown(Component: React.ComponentType): Promise<string> {
    // This would need a more sophisticated implementation
    // For now, return a placeholder
    return `*[React component: ${Component.name || 'Unknown'}]*\n\n`;
  }

  private convertMarkdownToPlainText(markdown: string): string {
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
}
```

### OpenGraph and SEO Metadata Generation

```typescript
// content/derivation/metadata-generator.ts
import { MultimodalContent, ArticleMetadata } from '@/content/types';

export interface OpenGraphData {
  title: string;
  description: string;
  type: 'article' | 'website' | 'profile';
  url: string;
  image?: string;
  article?: {
    author: string;
    publishedTime?: string;
    modifiedTime?: string;
    tags: string[];
    section?: string;
  };
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  canonicalUrl: string;
  publishedTime?: string;
  modifiedTime?: string;
  readingTime?: number;
  structuredData: any;
}

export class MetadataGenerator {
  generateOpenGraphData<T>(content: MultimodalContent<T>, baseUrl: string): OpenGraphData {
    const metadata = content.metadata;
    
    const openGraph: OpenGraphData = {
      title: metadata.title,
      description: metadata.description,
      type: this.getOpenGraphType(content),
      url: this.generateContentUrl(content, baseUrl),
      image: this.generateOGImageUrl(content, baseUrl)
    };

    // Add article-specific metadata
    if ('slug' in metadata) {
      const articleMetadata = metadata as ArticleMetadata;
      openGraph.article = {
        author: articleMetadata.author,
        publishedTime: articleMetadata.publishedAt?.toISOString(),
        modifiedTime: articleMetadata.updatedAt.toISOString(),
        tags: articleMetadata.tags,
        section: articleMetadata.category
      };
    }

    return openGraph;
  }

  generateSEOMetadata<T>(content: MultimodalContent<T>, baseUrl: string): SEOMetadata {
    const metadata = content.metadata;
    
    const seoMetadata: SEOMetadata = {
      title: this.generateSEOTitle(content),
      description: this.generateSEODescription(content),
      keywords: this.generateKeywords(content),
      author: metadata.author,
      canonicalUrl: this.generateContentUrl(content, baseUrl),
      modifiedTime: metadata.updatedAt.toISOString(),
      structuredData: this.generateStructuredData(content, baseUrl)
    };

    // Add article-specific SEO data
    if ('readingTime' in metadata) {
      const articleMetadata = metadata as ArticleMetadata;
      seoMetadata.publishedTime = articleMetadata.publishedAt?.toISOString();
      seoMetadata.readingTime = articleMetadata.readingTime;
    }

    return seoMetadata;
  }

  private getOpenGraphType<T>(content: MultimodalContent<T>): OpenGraphData['type'] {
    if ('slug' in content.metadata) return 'article';
    if ('username' in content.metadata) return 'profile';
    return 'website';
  }

  private generateContentUrl<T>(content: MultimodalContent<T>, baseUrl: string): string {
    const metadata = content.metadata;
    
    if ('slug' in metadata) {
      return `${baseUrl}/article/${(metadata as any).slug}`;
    }
    if ('username' in metadata) {
      return `${baseUrl}/contributor/${(metadata as any).username}`;
    }
    if ('concept' in metadata) {
      return `${baseUrl}/terminology/${(metadata as any).concept}`;
    }
    if ('route' in metadata) {
      return `${baseUrl}${(metadata as any).route}`;
    }
    
    return `${baseUrl}/content/${metadata.id}`;
  }

  private generateOGImageUrl<T>(content: MultimodalContent<T>, baseUrl: string): string {
    // Generate dynamic OG image URL
    const params = new URLSearchParams({
      title: content.metadata.title,
      type: this.getOpenGraphType(content),
      tags: content.metadata.tags.slice(0, 3).join(',')
    });
    
    return `${baseUrl}/api/og?${params.toString()}`;
  }

  private generateSEOTitle<T>(content: MultimodalContent<T>): string {
    const baseTitle = content.metadata.title;
    
    // Add site branding and context
    if ('difficulty' in content.metadata) {
      const difficulty = (content.metadata as any).difficulty;
      return `${baseTitle} - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Guide | TypeFirst`;
    }
    
    return `${baseTitle} | TypeFirst`;
  }

  private generateSEODescription<T>(content: MultimodalContent<T>): string {
    let description = content.metadata.description;
    
    // Enhance description with content-specific information
    if ('readingTime' in content.metadata) {
      const readingTime = (content.metadata as any).readingTime;
      description += ` • ${readingTime} min read`;
    }
    
    if ('difficulty' in content.metadata) {
      const difficulty = (content.metadata as any).difficulty;
      description += ` • ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} level`;
    }
    
    return description;
  }

  private generateKeywords<T>(content: MultimodalContent<T>): string[] {
    const keywords = [...content.metadata.tags];
    
    // Add content-type specific keywords
    if ('category' in content.metadata) {
      keywords.push((content.metadata as any).category);
    }
    
    if ('technologies' in content.metadata) {
      keywords.push(...(content.metadata as any).technologies);
    }
    
    // Add common site keywords
    keywords.push('TypeScript', 'React', 'JavaScript', 'Programming', 'Tutorial');
    
    return [...new Set(keywords)]; // Remove duplicates
  }

  private generateStructuredData<T>(content: MultimodalContent<T>, baseUrl: string): any {
    const metadata = content.metadata;
    
    const baseStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      'name': metadata.title,
      'description': metadata.description,
      'author': {
        '@type': 'Person',
        'name': metadata.author
      },
      'dateCreated': metadata.createdAt.toISOString(),
      'dateModified': metadata.updatedAt.toISOString(),
      'keywords': metadata.tags.join(', '),
      'url': this.generateContentUrl(content, baseUrl)
    };

    // Add article-specific structured data
    if ('slug' in metadata) {
      const articleMetadata = metadata as ArticleMetadata;
      return {
        ...baseStructuredData,
        '@type': 'Article',
        'headline': articleMetadata.title,
        'datePublished': articleMetadata.publishedAt?.toISOString(),
        'timeRequired': `PT${articleMetadata.readingTime}M`,
        'educationalLevel': articleMetadata.difficulty,
        'teaches': articleMetadata.learningObjectives,
        'articleSection': articleMetadata.category,
        'image': this.generateOGImageUrl(content, baseUrl)
      };
    }

    return baseStructuredData;
  }
}
```

### Content Pipeline Integration

```typescript
// content/derivation/pipeline-integration.ts
import { ContentDerivationService } from './content-derivation-service';
import { MetadataGenerator } from './metadata-generator';
import { contentRegistry } from '@/content/registry';

export class ContentPipelineIntegration {
  constructor(
    private derivationService: ContentDerivationService,
    private metadataGenerator: MetadataGenerator,
    private baseUrl: string
  ) {}

  async processAllContent(): Promise<void> {
    console.log('Starting content derivation pipeline...');
    
    // Process all content types
    await this.processArticles();
    await this.processContributors();
    await this.processTerminology();
    await this.processLabs();
    
    console.log('Content derivation pipeline completed!');
  }

  private async processArticles(): Promise<void> {
    const articles = contentRegistry.articles.getAll();
    
    for (const article of articles) {
      console.log(`Processing article: ${article.metadata.slug}`);
      
      const derived = await this.derivationService.deriveAllFormats(article);
      const openGraph = this.metadataGenerator.generateOpenGraphData(article, this.baseUrl);
      const seoMetadata = this.metadataGenerator.generateSEOMetadata(article, this.baseUrl);
      
      // Store derived content (would integrate with your storage system)
      await this.storeDerivedContent(article.metadata.id, {
        ...derived,
        openGraph,
        seoMetadata
      });
    }
  }

  private async processContributors(): Promise<void> {
    const contributors = contentRegistry.contributors.getAll();
    
    for (const contributor of contributors) {
      console.log(`Processing contributor: ${contributor.metadata.username}`);
      
      const derived = await this.derivationService.deriveAllFormats(contributor);
      const openGraph = this.metadataGenerator.generateOpenGraphData(contributor, this.baseUrl);
      const seoMetadata = this.metadataGenerator.generateSEOMetadata(contributor, this.baseUrl);
      
      await this.storeDerivedContent(contributor.metadata.id, {
        ...derived,
        openGraph,
        seoMetadata
      });
    }
  }

  private async processTerminology(): Promise<void> {
    const terms = contentRegistry.terminology.getAll();
    
    for (const term of terms) {
      console.log(`Processing terminology: ${term.metadata.concept}`);
      
      const derived = await this.derivationService.deriveAllFormats(term);
      
      await this.storeDerivedContent(term.metadata.id, derived);
    }
  }

  private async processLabs(): Promise<void> {
    const labs = contentRegistry.labs.getAll();
    
    for (const lab of labs) {
      console.log(`Processing lab: ${lab.metadata.labId}`);
      
      const derived = await this.derivationService.deriveAllFormats(lab);
      const openGraph = this.metadataGenerator.generateOpenGraphData(lab, this.baseUrl);
      const seoMetadata = this.metadataGenerator.generateSEOMetadata(lab, this.baseUrl);
      
      await this.storeDerivedContent(lab.metadata.id, {
        ...derived,
        openGraph,
        seoMetadata
      });
    }
  }

  private async storeDerivedContent(contentId: string, derivedData: any): Promise<void> {
    // This would integrate with your storage/database system
    // For now, we'll just log the operation
    console.log(`Storing derived content for ${contentId}:`, {
      artifactsCount: derivedData.artifacts?.length || 0,
      embeddingsCount: derivedData.embeddings?.length || 0,
      hasOpenGraph: !!derivedData.openGraph,
      hasSEO: !!derivedData.seoMetadata
    });
  }
}

// Build-time content processing
export async function runContentDerivationPipeline(): Promise<void> {
  const derivationService = new ContentDerivationService(
    new EmbeddingService(),
    new SearchIndexService()
  );
  
  const metadataGenerator = new MetadataGenerator();
  
  const pipeline = new ContentPipelineIntegration(
    derivationService,
    metadataGenerator,
    process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3000'
  );
  
  await pipeline.processAllContent();
}
```

This comprehensive content derivation pipeline enables your multimodal content to be transformed into all necessary formats while maintaining the canonical source-of-truth in your React components. The system supports incremental builds, caching, and can be integrated into your build process for automatic content processing.
