/**
 * Content Chunker
 * Splits article content into meaningful chunks for embedding generation
 */

import type { ContentChunk } from './types';

export interface ArticleContent {
  metadata: {
    title: string;
    description: string;
    tags: readonly string[];
    author: string;
  };
  introduction: string;
  sections: Array<{
    id: string;
    title: string;
    content: string;
    subtitle?: string;
    codeSnippet?: {
      language: string;
      code: string;
      filename?: string;
    };
    practices?: Array<{
      title: string;
      description: string;
    }>;
  }>;
  footer: {
    title: string;
    content: string;
  };
}

export class ContentChunker {
  private maxTokensPerChunk: number;
  private preserveCodeBlocks: boolean;

  constructor(options: {
    maxTokensPerChunk?: number;
    preserveCodeBlocks?: boolean;
  } = {}) {
    this.maxTokensPerChunk = options.maxTokensPerChunk ?? 512;
    this.preserveCodeBlocks = options.preserveCodeBlocks ?? true;
  }

  /**
   * Chunk article content into meaningful pieces
   */
  chunkArticle(articleId: string, content: ArticleContent): ContentChunk[] {
    const chunks: ContentChunk[] = [];
    let order = 0;

    // 1. Metadata chunk
    const metadataText = this.formatMetadata(content.metadata);
    chunks.push({
      id: `${articleId}-metadata`,
      content: metadataText,
      type: 'metadata',
      order: order++,
      tokenCount: this.estimateTokens(metadataText),
    });

    // 2. Introduction chunk
    if (content.introduction) {
      chunks.push({
        id: `${articleId}-introduction`,
        content: content.introduction,
        type: 'introduction',
        order: order++,
        tokenCount: this.estimateTokens(content.introduction),
      });
    }

    // 3. Section chunks
    for (const section of content.sections) {
      const sectionChunks = this.chunkSection(articleId, section, order);
      chunks.push(...sectionChunks);
      order += sectionChunks.length;
    }

    // 4. Footer chunk
    if (content.footer) {
      const footerText = `${content.footer.title}\n\n${content.footer.content}`;
      chunks.push({
        id: `${articleId}-footer`,
        content: footerText,
        type: 'footer',
        order: order++,
        tokenCount: this.estimateTokens(footerText),
      });
    }

    return chunks;
  }

  /**
   * Chunk a single section
   */
  private chunkSection(
    articleId: string, 
    section: ArticleContent['sections'][0], 
    startOrder: number
  ): ContentChunk[] {
    const chunks: ContentChunk[] = [];
    let order = startOrder;

    // Main section content
    const sectionText = this.formatSectionText(section);
    const mainChunk: ContentChunk = {
      id: `${articleId}-section-${section.id}`,
      content: sectionText,
      type: 'section',
      sectionId: section.id,
      sectionTitle: section.title,
      order: order++,
      tokenCount: this.estimateTokens(sectionText),
    };

    chunks.push(mainChunk);

    // Code snippet as separate chunk if present
    if (section.codeSnippet && this.preserveCodeBlocks) {
      const codeText = this.formatCodeSnippet(section);
      chunks.push({
        id: `${articleId}-section-${section.id}-code`,
        content: codeText,
        type: 'code',
        sectionId: section.id,
        sectionTitle: section.title,
        order: order++,
        tokenCount: this.estimateTokens(codeText),
      });
    }

    return chunks;
  }

  /**
   * Format metadata into searchable text
   */
  private formatMetadata(metadata: ArticleContent['metadata']): string {
    return [
      `Title: ${metadata.title}`,
      `Description: ${metadata.description}`,
      `Author: ${metadata.author}`,
      `Tags: ${metadata.tags.join(', ')}`,
    ].join('\n');
  }

  /**
   * Format section content
   */
  private formatSectionText(section: ArticleContent['sections'][0]): string {
    const parts = [`# ${section.title}`];
    
    if (section.subtitle) {
      parts.push(`## ${section.subtitle}`);
    }
    
    parts.push(section.content);

    // Include practices if present (for best practices section)
    if (section.practices) {
      parts.push('\nPractices:');
      for (const practice of section.practices) {
        parts.push(`- ${practice.title}: ${practice.description}`);
      }
    }

    return parts.join('\n\n');
  }

  /**
   * Format code snippet with context
   */
  private formatCodeSnippet(section: ArticleContent['sections'][0]): string {
    if (!section.codeSnippet) return '';

    const parts = [
      `Code example for: ${section.title}`,
      section.subtitle ? `Subtitle: ${section.subtitle}` : '',
      `Language: ${section.codeSnippet.language}`,
      section.codeSnippet.filename ? `File: ${section.codeSnippet.filename}` : '',
      '',
      '```' + section.codeSnippet.language,
      section.codeSnippet.code,
      '```'
    ].filter(Boolean);

    return parts.join('\n');
  }

  /**
   * Estimate token count (rough approximation)
   * More accurate estimation would use the actual tokenizer
   */
  private estimateTokens(text: string): number {
    // Rough approximation: ~4 characters per token for English text
    return Math.ceil(text.length / 4);
  }

  /**
   * Split text if it exceeds max tokens (for future use)
   */
  private splitTextIfNeeded(text: string, type: ContentChunk['type']): string[] {
    const estimatedTokens = this.estimateTokens(text);
    
    if (estimatedTokens <= this.maxTokensPerChunk) {
      return [text];
    }

    // For now, return as-is. In the future, implement smart splitting
    // that respects paragraph boundaries, sentence boundaries, etc.
    console.warn(`Chunk exceeds max tokens (${estimatedTokens} > ${this.maxTokensPerChunk})`);
    return [text];
  }
}
