/**
 * Content Chunker for creating embeddings
 * Chunks content by sections to maintain semantic boundaries
 */

import type { ContentChunk } from './types';

export class ContentChunker {
  
  /**
   * Chunk content by sections
   * Each section becomes a separate chunk for embedding
   */
  chunkBySections(sections: any[]): ContentChunk[] {
    const chunks: ContentChunk[] = [];

    sections.forEach((section, index) => {
      // Main section content chunk
      const mainContent = this.buildSectionContent(section);
      
      chunks.push({
        id: `section-${section.id}`,
        content: mainContent,
        type: 'section',
        sectionId: section.id,
        sectionTitle: section.title,
        order: index,
        tokenCount: this.estimateTokenCount(mainContent),
      });

      // If section has code, create a separate chunk for it
      if (section.codeSnippet) {
        const codeContent = this.buildCodeContent(section);
        
        chunks.push({
          id: `code-${section.id}`,
          content: codeContent,
          type: 'code',
          sectionId: section.id,
          sectionTitle: `${section.title} - Code Example`,
          order: index + 0.5, // Place code chunks between sections
          tokenCount: this.estimateTokenCount(codeContent),
        });
      }

      // If section has practices (like best practices), create separate chunks
      if (section.practices) {
        section.practices.forEach((practice: any, practiceIndex: number) => {
          const practiceContent = `${practice.title}: ${practice.description}`;
          
          chunks.push({
            id: `practice-${section.id}-${practiceIndex}`,
            content: practiceContent,
            type: 'section',
            sectionId: section.id,
            sectionTitle: `${section.title} - ${practice.title}`,
            order: index + 0.1 + (practiceIndex * 0.01),
            tokenCount: this.estimateTokenCount(practiceContent),
          });
        });
      }
    });

    return chunks.sort((a, b) => a.order - b.order);
  }

  /**
   * Build the main content for a section
   */
  private buildSectionContent(section: any): string {
    let content = section.title;
    
    if (section.subtitle) {
      content += `\n${section.subtitle}`;
    }
    
    content += `\n${section.content}`;
    
    return content;
  }

  /**
   * Build content for code snippets
   */
  private buildCodeContent(section: any): string {
    const codeSnippet = section.codeSnippet;
    
    let content = `${section.title} - Code Example`;
    
    if (section.subtitle) {
      content += `\n${section.subtitle}`;
    }
    
    if (codeSnippet.filename) {
      content += `\nFile: ${codeSnippet.filename}`;
    }
    
    content += `\nLanguage: ${codeSnippet.language}`;
    content += `\n\nCode:\n${codeSnippet.code}`;
    
    return content;
  }

  /**
   * Estimate token count for text
   * Rough approximation: 1 token ≈ 4 characters for English text
   */
  private estimateTokenCount(text: string): number {
    return Math.ceil(text.length / 4);
  }

  /**
   * Create metadata chunk for the article
   */
  createMetadataChunk(contentData: any): ContentChunk {
    const metadata = contentData.metadata;
    
    const content = [
      metadata.title,
      metadata.description,
      `Tags: ${metadata.tags.join(', ')}`,
      `Author: ${metadata.author}`,
      `Published: ${metadata.publishedAt}`,
    ].join('\n');

    return {
      id: 'metadata',
      content,
      type: 'metadata',
      order: -1, // Metadata comes first
      tokenCount: this.estimateTokenCount(content),
    };
  }

  /**
   * Create introduction chunk
   */
  createIntroductionChunk(contentData: any): ContentChunk {
    const content = `Introduction\n${contentData.introduction}`;

    return {
      id: 'introduction',
      content,
      type: 'introduction',
      order: 0, // Introduction comes after metadata
      tokenCount: this.estimateTokenCount(content),
    };
  }

  /**
   * Create footer chunk
   */
  createFooterChunk(contentData: any): ContentChunk {
    const footer = contentData.footer;
    const content = `${footer.title}\n${footer.content}`;

    return {
      id: 'footer',
      content,
      type: 'footer',
      order: 1000, // Footer comes last
      tokenCount: this.estimateTokenCount(content),
    };
  }

  /**
   * Chunk complete article with all parts
   */
  chunkFullArticle(contentData: any): ContentChunk[] {
    const chunks: ContentChunk[] = [];

    // Add metadata chunk
    chunks.push(this.createMetadataChunk(contentData));

    // Add introduction chunk
    if (contentData.introduction) {
      chunks.push(this.createIntroductionChunk(contentData));
    }

    // Add section chunks
    chunks.push(...this.chunkBySections(contentData.sections));

    // Add footer chunk
    if (contentData.footer) {
      chunks.push(this.createFooterChunk(contentData));
    }

    return chunks.sort((a, b) => a.order - b.order);
  }
}
