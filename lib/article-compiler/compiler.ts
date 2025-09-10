import { readdir } from 'fs/promises';
import path from 'path';
import { ArticleExports, CompiledArticle } from './types';

class ArticleCompiler {
  constructor() {}

  async compileArticle(articlePath: string): Promise<CompiledArticle> {
    const slug = this.getSlugFromPath(articlePath);
    
    // For compilation, we'll work with the metadata and use a simpler approach
    // that doesn't require rendering React components in Node.js context
    const indexPath = articlePath.replace('/page.tsx', '/index.ts');
    
    try {
      // Try to import the index file first for metadata
      const fullIndexPath = path.resolve(process.cwd(), indexPath);
      const articleModule = await import(fullIndexPath);
      const articleExports: ArticleExports = articleModule;
      
      if (!articleExports.metadata) {
        throw new Error(`No metadata found in ${indexPath}`);
      }

      // For now, we'll create placeholder content since we can't render the component
      // In a real implementation, you might want to use a headless browser or
      // extract content through static analysis
      const metadata = articleExports.metadata;
      
      // Generate basic content from metadata
      const title = metadata.title;
      const description = metadata.description || '';
      const tags = metadata.tags.join(', ');
      
      const basicHtml = `
        <article>
          <header>
            <h1>${title}</h1>
            ${description ? `<p class="description">${description}</p>` : ''}
            <div class="tags">${tags}</div>
          </header>
          <div class="content">
            <!-- Article content would be rendered here -->
            <p>This article is available at /articles/${slug}</p>
          </div>
        </article>
      `.trim();
      
      // Convert to markdown and plain text
      const markdown = this.htmlToMarkdown(basicHtml);
      const plainText = this.htmlToPlainText(basicHtml);
      const outline = this.extractOutline(basicHtml);
      
      // Calculate reading stats (basic estimation)
      const wordCount = this.countWords(plainText);
      const readingTime = Math.ceil(wordCount / 200);

      return {
        slug,
        metadata: articleExports.metadata,
        html: basicHtml,
        markdown,
        plainText,
        outline,
        wordCount,
        readingTime,
        lastCompiled: new Date(),
      };
    } catch (error) {
      throw new Error(`Failed to compile article at ${articlePath}: ${error}`);
    }
  }

  async compileAllArticles(): Promise<CompiledArticle[]> {
    const articlesDir = path.join(process.cwd(), 'app', 'articles');
    const articlePaths = await this.findArticleModules(articlesDir);
    
    const compiledArticles = await Promise.all(
      articlePaths.map(articlePath => this.compileArticle(articlePath))
    );

    return compiledArticles;
  }

  async findArticleModules(baseDir: string): Promise<string[]> {
    const articles: string[] = [];
    
    try {
      const entries = await readdir(baseDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          const articleDir = path.join(baseDir, entry.name);
          const pagePath = path.join(articleDir, 'page.tsx');
          const indexPath = path.join(articleDir, 'index.ts');
          
          // Check if this looks like an article directory
          try {
            const { stat } = await import('fs/promises');
            await stat(pagePath);
            
            // Prefer index.ts for metadata, fallback to page.tsx
            try {
              await stat(indexPath);
              articles.push(path.relative(process.cwd(), indexPath));
            } catch {
              articles.push(path.relative(process.cwd(), pagePath));
            }
          } catch {
            // Not an article directory, skip
          }
        }
      }
    } catch (error) {
      console.warn('Could not read articles directory:', error);
    }

    return articles;
  }

  private getSlugFromPath(articlePath: string): string {
    // Extract slug from path like "app/articles/my-article/page.tsx" -> "my-article"
    const parts = articlePath.split(path.sep);
    const articlesIndex = parts.findIndex(part => part === 'articles');
    
    if (articlesIndex === -1 || articlesIndex >= parts.length - 1) {
      throw new Error(`Invalid article path: ${articlePath}`);
    }

    return parts[articlesIndex + 1];
  }

  private htmlToMarkdown(html: string): string {
    // Simple HTML to Markdown conversion
    return html
      .replace(/<h([1-6])(?:[^>]*)>(.*?)<\/h[1-6]>/g, (_, level, text) => {
        const hashes = '#'.repeat(parseInt(level));
        return `${hashes} ${text.trim()}\n\n`;
      })
      .replace(/<p(?:[^>]*)>(.*?)<\/p>/g, '$1\n\n')
      .replace(/<strong(?:[^>]*)>(.*?)<\/strong>/g, '**$1**')
      .replace(/<em(?:[^>]*)>(.*?)<\/em>/g, '*$1*')
      .replace(/<code(?:[^>]*)>(.*?)<\/code>/g, '`$1`')
      .replace(/<pre(?:[^>]*)><code(?:[^>]*)>([\s\S]*?)<\/code><\/pre>/g, '```\n$1\n```\n\n')
      .replace(/<blockquote(?:[^>]*)>([\s\S]*?)<\/blockquote>/g, (_, content) => {
        const lines = content.trim().split('\n');
        return lines.map((line: string) => `> ${line.trim()}`).join('\n') + '\n\n';
      })
      .replace(/<[^>]+>/g, '') // Remove remaining HTML tags
      .replace(/\n{3,}/g, '\n\n') // Clean up excessive newlines
      .trim();
  }

  private htmlToPlainText(html: string): string {
    // Simple HTML to plain text conversion
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
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

export const articleCompiler = new ArticleCompiler();
