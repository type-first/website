import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import path from 'path';
import { existsSync } from 'fs';
import { ArticleExports, CompiledArticle } from './types';
import { ModalityProvider } from '../article-components/simple-context';

/**
 * Semantic Article Compiler
 * 
 * This compiler leverages our semantic component system to extract clean text
 * content from articles by rendering them in markdown mode. This approach:
 * 
 * 1. Imports the actual article component
 * 2. Renders it wrapped in ModalityProvider with markdown mode
 * 3. Extracts the clean text content for search indexing
 * 4. Generates proper embeddings from full article content
 */

class SemanticArticleCompiler {
  async compileArticle(slug: string): Promise<CompiledArticle> {
    // Get paths
    const indexPath = path.join(process.cwd(), 'app', 'articles', slug, 'index.ts');
    const pagePath = path.join(process.cwd(), 'app', 'articles', slug, 'page.tsx');
    
    if (!existsSync(pagePath)) {
      throw new Error(`Article page not found: ${pagePath}`);
    }
    
    // Import the page module which contains both metadata and component
    const pageModule = await import(pagePath);
    const ArticleComponent = pageModule.default;
    
    if (!ArticleComponent) {
      throw new Error(`No default export found in ${pagePath}`);
    }
    
    // Try to get metadata from index.ts, fallback to page.tsx
    let metadata;
    if (existsSync(indexPath)) {
      const articleModule = await import(indexPath);
      metadata = articleModule.metadata;
    } else {
      // Get metadata from page.tsx export
      metadata = pageModule.articleMetadata;
    }
    
    if (!metadata) {
      throw new Error(`No metadata found for article: ${slug}`);
    }
    
    try {
      // Render article in markdown mode to extract clean text
      const markdownContent = this.renderArticleAsMarkdown(ArticleComponent);
      
      // Also render as HTML for display
      const htmlContent = this.renderArticleAsHtml(ArticleComponent);
      
      // Extract plain text from markdown
      const plainText = this.markdownToPlainText(markdownContent);
      
      // Generate outline from markdown headings
      const outline = this.extractOutlineFromMarkdown(markdownContent);
      
      // Calculate reading metrics
      const wordCount = this.countWords(plainText);
      const readingTime = Math.ceil(wordCount / 200);
      
      console.log(`✅ Compiled ${slug}: ${wordCount} words (${readingTime} min read)`);
      
      return {
        slug,
        metadata,
        html: htmlContent,
        markdown: markdownContent,
        plainText,
        outline,
        wordCount,
        readingTime,
        lastCompiled: new Date(),
      };
    } catch (error) {
      console.error(`❌ Failed to render article ${slug}:`, error);
      
      // Fallback to metadata-only compilation
      return this.createFallbackCompilation(slug, metadata);
    }
  }
  
  private renderArticleAsMarkdown(ArticleComponent: React.ComponentType): string {
    // Render component wrapped in markdown mode provider
    const element = React.createElement(
      ModalityProvider,
      { modality: 'markdown', children: React.createElement(ArticleComponent) }
    );
    
    // Render to static markup and extract text content
    const rendered = renderToStaticMarkup(element);
    
    // The rendered output will be the concatenated markdown strings
    // Clean up any React artifacts
    return this.cleanMarkdownOutput(rendered);
  }
  
  private renderArticleAsHtml(ArticleComponent: React.ComponentType): string {
    // Render component in normal HTML mode
    const element = React.createElement(ArticleComponent);
    
    return renderToStaticMarkup(element);
  }
  
  private cleanMarkdownOutput(rawOutput: string): string {
    // Remove any HTML tags that might have leaked through
    return rawOutput
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
  
  private markdownToPlainText(markdown: string): string {
    return markdown
      // Remove markdown formatting
      .replace(/#{1,6}\s+/g, '') // Headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1') // Italic
      .replace(/`(.*?)`/g, '$1') // Inline code
      .replace(/```[\s\S]*?```/g, '') // Code blocks
      .replace(/^\s*[-*+]\s+/gm, '') // List items
      .replace(/^\s*\d+\.\s+/gm, '') // Numbered lists
      .replace(/^\s*>\s+/gm, '') // Blockquotes
      .replace(/---+/g, '') // Separators
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
      .replace(/!\[[^\]]*\]\([^)]+\)/g, '') // Images
      .replace(/\n{2,}/g, '\n') // Multiple newlines
      .replace(/\s+/g, ' ') // Multiple spaces
      .trim();
  }
  
  private extractOutlineFromMarkdown(markdown: string): Array<{ level: number; title: string; id: string }> {
    const outline: Array<{ level: number; title: string; id: string }> = [];
    const lines = markdown.split('\n');
    
    lines.forEach((line, index) => {
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const title = headingMatch[2].trim();
        const id = this.generateHeadingId(title, index);
        
        outline.push({ level, title, id });
      }
    });
    
    return outline;
  }
  
  private generateHeadingId(title: string, index: number): string {
    const baseId = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return baseId || `heading-${index}`;
  }
  
  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }
  
  private createFallbackCompilation(slug: string, metadata: any): CompiledArticle {
    // Enhanced fallback for legacy articles
    const searchableText = [
      metadata.title,
      metadata.description || '',
      metadata.tags.join(' '),
      metadata.author || '',
      // Add some derived content based on common patterns
      `Article about ${metadata.tags.slice(0, 3).join(', ')}`,
      `Published on ${metadata.publishedAt?.toLocaleDateString() || 'unknown date'}`,
      `Topics covered: ${metadata.tags.join(', ')}`
    ].filter(Boolean).join('\n\n');
    
    const markdown = [
      `# ${metadata.title}`,
      '',
      metadata.description || '',
      '',
      `## Topics Covered`,
      metadata.tags.map(tag => `- ${tag}`).join('\n'),
      '',
      `*Published: ${metadata.publishedAt?.toLocaleDateString() || 'Unknown'}*`,
      `*Author: ${metadata.author || 'Unknown'}*`
    ].join('\n');
    
    return {
      slug,
      metadata,
      html: `<h1>${metadata.title}</h1><p>${metadata.description || ''}</p><div class="tags">${metadata.tags.join(', ')}</div>`,
      markdown,
      plainText: searchableText,
      outline: [
        { level: 1, title: metadata.title, id: 'title' },
        { level: 2, title: 'Topics Covered', id: 'topics' }
      ],
      wordCount: this.countWords(searchableText),
      readingTime: Math.max(1, Math.ceil(this.countWords(searchableText) / 200)),
      lastCompiled: new Date(),
    };
  }
  
  async compileAllArticles(): Promise<CompiledArticle[]> {
    const articlesDir = path.join(process.cwd(), 'app', 'articles');
    const articleSlugs = await this.findArticleSlugs(articlesDir);
    
    const compiled: CompiledArticle[] = [];
    
    console.log(`🔄 Compiling ${articleSlugs.length} articles with semantic components...`);
    
    for (const slug of articleSlugs) {
      try {
        const article = await this.compileArticle(slug);
        compiled.push(article);
      } catch (error) {
        console.error(`❌ Failed to compile ${slug}:`, error);
      }
    }
    
    console.log(`✅ Compiled ${compiled.length}/${articleSlugs.length} articles successfully`);
    
    return compiled;
  }
  
  private async findArticleSlugs(articlesDir: string): Promise<string[]> {
    const { readdir } = await import('fs/promises');
    const slugs: string[] = [];
    
    try {
      const entries = await readdir(articlesDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          const indexPath = path.join(articlesDir, entry.name, 'index.ts');
          const pagePath = path.join(articlesDir, entry.name, 'page.tsx');
          
          // Check if this looks like an article directory (needs at least page.tsx)
          if (existsSync(pagePath)) {
            slugs.push(entry.name);
          }
        }
      }
    } catch (error) {
      console.warn('Could not read articles directory:', error);
    }
    
    return slugs;
  }
}

export const semanticArticleCompiler = new SemanticArticleCompiler();
