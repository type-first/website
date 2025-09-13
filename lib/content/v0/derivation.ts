import { remark } from 'remark';
import remarkHtml from 'remark-html';
import { Article, Section, DerivedContent, SectionEmbedding } from '@/lib/schemas/v0/article';
import { saveDerivedContent, saveSectionEmbeddings } from '@/lib/db/v0/articles';

export interface DerivationOptions {
  generateEmbeddings?: boolean;
  embeddingService?: EmbeddingService;
}

export interface EmbeddingService {
  generateEmbeddings(texts: string[]): Promise<number[][]>;
}

export class ContentDerivationPipeline {
  private remarkProcessor = remark().use(remarkHtml);

  async deriveContent(article: Article, options: DerivationOptions = {}): Promise<void> {
    const { generateEmbeddings = false, embeddingService } = options;

    // Generate markdown
    const markdown = this.generateMarkdown(article.content);
    
    // Generate plaintext
    const plaintext = this.generatePlaintext(article.content);
    
    // Generate outline
    const outline = this.generateOutline(article.content);

    // Save derived content
    const derivedContent: DerivedContent = {
      articleId: article.id,
      markdown,
      plaintext,
      outline,
      wordCount: plaintext.split(' ').length,
      readingTime: `${Math.ceil(plaintext.split(' ').length / 200)} min read`,
      updatedAt: new Date(),
    };

    await saveDerivedContent(article.id, derivedContent);

    // Generate embeddings if requested
    if (generateEmbeddings && embeddingService) {
      await this.generateSectionEmbeddings(article, embeddingService);
    }
  }

  private generateMarkdown(sections: Section[]): string {
    return sections.map((section, _index) => {
      switch (section.type) {
        case 'text':
          return section.content;

        case 'quote':
          let quote = `> ${section.content}`;
          if (section.author) {
            quote += `\n> \n> — ${section.author}`;
            if (section.source) {
              quote += `, ${section.source}`;
            }
          }
          return quote;

        case 'code':
          let codeBlock = '```';
          if (section.language) {
            codeBlock += section.language;
          }
          if (section.filename) {
            codeBlock += ` title="${section.filename}"`;
          }
          codeBlock += `\n${section.content}\n\`\`\``;
          return codeBlock;

        case 'island':
          return `<!-- Island: ${section.component} -->\n${section.textAlt}`;

        default:
          return '';
      }
    }).join('\n\n');
  }

  private generatePlaintext(sections: Section[]): string {
    return sections.map(section => {
      switch (section.type) {
        case 'text':
          return section.content;

        case 'quote':
          let text = section.content;
          if (section.author) {
            text += ` — ${section.author}`;
            if (section.source) {
              text += `, ${section.source}`;
            }
          }
          return text;

        case 'code':
          return section.content;

        case 'island':
          return section.textAlt;

        default:
          return '';
      }
    }).join('\n\n');
  }

  private generateOutline(sections: Section[]): Array<{ level: number; title: string; id: string }> {
    const outline: Array<{ level: number; title: string; id: string }> = [];
    
    sections.forEach((section, index) => {
      if (section.type === 'text') {
        // Extract headings from text content
        const headingMatches = section.content.match(/^(#{1,6})\s+(.+)$/gm);
        if (headingMatches) {
          headingMatches.forEach((match: string) => {
            const level = match.match(/^#+/)?.[0].length || 1;
            const title = match.replace(/^#+\s+/, '').trim();
            const id = section.id || `section-${index}`;
            outline.push({ level, title, id });
          });
        }
      } else if (section.type === 'island' && section.component) {
        // Add islands to outline
        const title = `Interactive: ${section.component}`;
        const id = section.id || `island-${index}`;
        outline.push({ level: 2, title, id });
      }
    });

    return outline;
  }

  private async generateSectionEmbeddings(
    article: Article, 
    embeddingService: EmbeddingService
  ): Promise<void> {
    // Prepare content for embedding
    const sectionContents = article.content.map(section => {
      switch (section.type) {
        case 'text':
          return section.content;
        case 'quote':
          return `Quote: ${section.content}${section.author ? ` — ${section.author}` : ''}`;
        case 'code':
          return `Code (${section.language}): ${section.content}`;
        case 'island':
          return `Interactive component (${section.component}): ${section.textAlt}`;
        default:
          return '';
      }
    }).filter(content => content.length > 0);

    if (sectionContents.length === 0) return;

    // Generate embeddings
    const embeddings = await embeddingService.generateEmbeddings(sectionContents);

    // Create section embedding objects
    const sectionEmbeddings: SectionEmbedding[] = embeddings.map((embedding, index) => ({
      id: crypto.randomUUID(),
      articleId: article.id,
      sectionIndex: index,
      content: sectionContents[index],
      embedding,
      createdAt: new Date(),
    }));

    // Save to database
    await saveSectionEmbeddings(article.id, sectionEmbeddings);
  }

  async processArticleHtml(markdown: string): Promise<string> {
    const result = await this.remarkProcessor.process(markdown);
    return result.toString();
  }
}

// Mock embedding service for development
export class MockEmbeddingService implements EmbeddingService {
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    // Generate random embeddings for development
    return texts.map(() => 
      Array.from({ length: 1536 }, () => Math.random() * 2 - 1)
    );
  }
}

// Factory function
export function createContentPipeline(): ContentDerivationPipeline {
  return new ContentDerivationPipeline();
}

// Utility function to trigger derivation after article changes
export async function triggerDerivation(
  article: Article, 
  options: DerivationOptions = {}
): Promise<void> {
  const pipeline = createContentPipeline();
  await pipeline.deriveContent(article, options);
}
