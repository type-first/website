import { execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import path from 'path';
import { ArticleExports, CompiledArticle } from './types';

/**
 * This script uses Next.js's own rendering to compile articles by:
 * 1. Starting a temporary Next.js server
 * 2. Fetching the rendered HTML from each article page
 * 3. Processing the HTML to extract content for search/embeddings
 */

class NextJSArticleCompiler {
  private serverUrl = 'http://localhost:3001'; // Use different port to avoid conflicts
  
  async compileArticle(slug: string): Promise<CompiledArticle> {
    // Get metadata from the index file
    const indexPath = path.join(process.cwd(), 'app', 'articles', slug, 'index.ts');
    
    if (!existsSync(indexPath)) {
      throw new Error(`No index.ts found for article: ${slug}`);
    }
    
    // Import metadata
    const articleModule = await import(indexPath);
    const articleExports: ArticleExports = articleModule;
    
    if (!articleExports.metadata) {
      throw new Error(`No metadata export found in ${indexPath}`);
    }
    
    // For initial implementation, we'll work with metadata only
    // Later, we can add HTML fetching from a running Next.js server
    const metadata = articleExports.metadata;
    
    // Generate searchable content from metadata
    const searchableText = this.generateSearchableContent(metadata, slug);
    
    // Create basic HTML structure
    const html = `
      <article>
        <header>
          <h1>${metadata.title}</h1>
          ${metadata.description ? `<p>${metadata.description}</p>` : ''}
          <div class="metadata">
            <time>${metadata.publishedAt?.toISOString()}</time>
            <div class="tags">${metadata.tags.join(', ')}</div>
          </div>
        </header>
        <div class="content">
          <!-- Rendered content would go here -->
          <p>Article content is available at /articles/${slug}</p>
        </div>
      </article>
    `;
    
    const markdown = this.htmlToMarkdown(html);
    const plainText = this.htmlToPlainText(html);
    const outline = this.extractOutline(html);
    const wordCount = this.countWords(plainText);
    const readingTime = Math.ceil(wordCount / 200);
    
    return {
      slug,
      metadata,
      html: html.trim(),
      markdown,
      plainText: searchableText,
      outline,
      wordCount,
      readingTime,
      lastCompiled: new Date(),
    };
  }
  
  async compileAllArticles(): Promise<CompiledArticle[]> {
    const articlesDir = path.join(process.cwd(), 'app', 'articles');
    const articleSlugs = await this.findArticleSlugs(articlesDir);
    
    const compiled: CompiledArticle[] = [];
    
    for (const slug of articleSlugs) {
      try {
        const article = await this.compileArticle(slug);
        compiled.push(article);
        console.log(`✅ Compiled: ${slug}`);
      } catch (error) {
        console.error(`❌ Failed to compile ${slug}:`, error);
      }
    }
    
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
          
          // Check if this looks like an article directory
          if (existsSync(indexPath) && existsSync(pagePath)) {
            slugs.push(entry.name);
          }
        }
      }
    } catch (error) {
      console.warn('Could not read articles directory:', error);
    }
    
    return slugs;
  }
  
  private generateSearchableContent(metadata: any, slug: string): string {
    const parts = [
      metadata.title,
      metadata.description || '',
      metadata.tags.join(' '),
      metadata.author || '',
    ];
    
    return parts.filter(Boolean).join('\n\n');
  }
  
  private htmlToMarkdown(html: string): string {
    return html
      .replace(/<h([1-6])(?:[^>]*)>(.*?)<\/h[1-6]>/g, (_, level, text) => {
        const hashes = '#'.repeat(parseInt(level));
        return `${hashes} ${text.trim()}\n\n`;
      })
      .replace(/<p(?:[^>]*)>(.*?)<\/p>/g, '$1\n\n')
      .replace(/<strong(?:[^>]*)>(.*?)<\/strong>/g, '**$1**')
      .replace(/<em(?:[^>]*)>(.*?)<\/em>/g, '*$1*')
      .replace(/<[^>]+>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
  
  private htmlToPlainText(html: string): string {
    return html
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  private extractOutline(html: string): Array<{ level: number; title: string; id: string }> {
    const outline: Array<{ level: number; title: string; id: string }> = [];
    const headingRegex = /<h([1-6])(?:[^>]*id="([^"]*)")?[^>]*>(.*?)<\/h[1-6]>/gi;
    
    let match;
    let index = 0;
    
    while ((match = headingRegex.exec(html)) !== null) {
      const level = parseInt(match[1]);
      const id = match[2] || `heading-${index}`;
      const title = match[3].replace(/<[^>]+>/g, '').trim();
      
      outline.push({ level, title, id });
      index++;
    }
    
    return outline;
  }
  
  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }
}

export const nextjsArticleCompiler = new NextJSArticleCompiler();
