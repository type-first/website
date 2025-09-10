import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ModalityProvider } from '../lib/article-components';

interface RenderResult {
  html: string;
  markdown: string;
  plainText: string;
  json: any;
}

export async function renderArticleComponent(ArticleComponent: React.ComponentType): Promise<RenderResult> {
  // Render HTML
  const htmlContent = renderToStaticMarkup(
    React.createElement(ModalityProvider, { 
      modality: 'html',
      children: React.createElement(ArticleComponent)
    })
  );

  // Render Markdown  
  const markdownContent = renderToStaticMarkup(
    React.createElement(ModalityProvider, { 
      modality: 'markdown',
      children: React.createElement(ArticleComponent)
    })
  );

  // Render Plain Text
  const plainTextContent = renderToStaticMarkup(
    React.createElement(ModalityProvider, { 
      modality: 'plaintext',
      children: React.createElement(ArticleComponent)
    })
  );

  // Render JSON structure
  const jsonContent = renderToStaticMarkup(
    React.createElement(ModalityProvider, { 
      modality: 'json',
      children: React.createElement(ArticleComponent)
    })
  );

  return {
    html: htmlContent,
    markdown: cleanMarkdownOutput(markdownContent),
    plainText: cleanPlainTextOutput(plainTextContent),
    json: JSON.parse(jsonContent || '{}')
  };
}

function cleanMarkdownOutput(content: string): string {
  // Remove React hydration artifacts and clean up markdown
  return content
    .replace(/<!-- -->/g, '')
    .replace(/data-reactroot="[^"]*"/g, '')
    .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
    .trim();
}

function cleanPlainTextOutput(content: string): string {
  // Clean up plain text output
  return content
    .replace(/<!-- -->/g, '')
    .replace(/data-reactroot="[^"]*"/g, '')
    .replace(/<[^>]*>/g, '') // Remove any HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

export function extractOutlineFromJson(jsonContent: any): Array<{ level: number; text: string }> {
  const outline: Array<{ level: number; text: string }> = [];
  
  function traverseJson(obj: any) {
    if (Array.isArray(obj)) {
      obj.forEach(traverseJson);
    } else if (obj && typeof obj === 'object') {
      if (obj.type === 'heading' && obj.level && obj.content) {
        outline.push({
          level: obj.level,
          text: extractTextFromContent(obj.content)
        });
      }
      Object.values(obj).forEach(traverseJson);
    }
  }
  
  traverseJson(jsonContent);
  return outline;
}

function extractTextFromContent(content: any): string {
  if (typeof content === 'string') {
    return content;
  }
  if (Array.isArray(content)) {
    return content.map(extractTextFromContent).join('');
  }
  if (content && typeof content === 'object' && content.content) {
    return extractTextFromContent(content.content);
  }
  return '';
}
