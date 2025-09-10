import { readdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import { CompiledArticle } from './types';

/**
 * Simple article compiler that works with Next.js pages
 * Each article is at app/articles/[slug]/page.tsx
 * Metadata is exported from the same file
 */
export class SimpleArticleCompiler {
  
  async compileArticle(slug: string): Promise<CompiledArticle> {
    const articlePath = path.join(process.cwd(), 'app', 'articles', slug, 'page.tsx');
    
    if (!existsSync(articlePath)) {
      throw new Error(`Article not found: ${slug}`);
    }

    try {
      // Import the article module to get metadata
      const module = await import(articlePath);
      
      if (!module.metadata) {
        throw new Error(`No metadata export found in ${articlePath}`);
      }

      const metadata = module.metadata;
      
      // Generate basic searchable content from metadata
      const searchableText = [
        metadata.title,
        metadata.description || '',
        metadata.tags?.join(' ') || '',
        metadata.author || '',
      ].filter(Boolean).join('\n\n');

      // Create simple HTML representation
      const html = this.generateSimpleHtml(metadata, slug);
      
      // Convert to other formats
      const markdown = this.htmlToMarkdown(html);
      const plainText = searchableText;
      const outline = this.extractOutlineFromMetadata(metadata);
      
      const wordCount = this.countWords(plainText);
      const readingTime = Math.ceil(wordCount / 200);

      return {
        slug,
        metadata,
        html,
        markdown,
        plainText,
        outline,
        wordCount,
        readingTime,
        lastCompiled: new Date(),
      };
    } catch (error) {
      throw new Error(`Failed to compile article ${slug}: ${error}`);
    }
  }

  async compileAllArticles(): Promise<CompiledArticle[]> {
    const articlesDir = path.join(process.cwd(), 'app', 'articles');
    const slugs = await this.findArticleSlugs(articlesDir);
    
    const compiled: CompiledArticle[] = [];
    
    for (const slug of slugs) {
      try {
        const article = await this.compileArticle(slug);
        compiled.push(article);
      } catch (error) {
        console.warn(`Failed to compile ${slug}:`, error);
      }
    }
    
    return compiled;
  }

  private async findArticleSlugs(articlesDir: string): Promise<string[]> {
    const slugs: string[] = [];
    
    try {
      const entries = await readdir(articlesDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          const pagePath = path.join(articlesDir, entry.name, 'page.tsx');
          
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

  private generateSimpleHtml(metadata: any, slug: string): string {
    return `
      <article>
        <header>
          <h1>${metadata.title}</h1>
          ${metadata.description ? `<p class="description">${metadata.description}</p>` : ''}
          <div class="metadata">
            ${metadata.publishedAt ? `<time>${metadata.publishedAt.toISOString()}</time>` : ''}
            <div class="tags">${(metadata.tags || []).join(', ')}</div>
            ${metadata.author ? `<div class="author">${metadata.author}</div>` : ''}
          </div>
        </header>
        <div class="content">
          <p>Full article content available at <a href="/articles/${slug}">/articles/${slug}</a></p>
        </div>
      </article>
    `.trim();
  }

  private htmlToMarkdown(html: string): string {
    return html
      .replace(/<h([1-6])(?:[^>]*)>(.*?)<\/h[1-6]>/g, (_, level, text) => {
        const hashes = '#'.repeat(parseInt(level));
        return `${hashes} ${text.trim()}\n\n`;
      })
      .replace(/<p(?:[^>]*)>(.*?)<\/p>/g, '$1\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  private extractOutlineFromMetadata(metadata: any): Array<{ level: number; title: string; id: string }> {
    // For now, just return the title as a single heading
    // In a full implementation, you might parse the component to extract headings
    return [
      {
        level: 1,
        title: metadata.title,
        id: 'title',
      },
    ];
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }
}

export const simpleArticleCompiler = new SimpleArticleCompiler();
