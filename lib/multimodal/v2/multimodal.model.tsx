/**
 * Multimodal v2 - Static Registry with Type-Safe Modalities
 * 
 * This version uses a static registry with const assertions for compile-time
 * type safety and discriminated unions for structured modal output types.
 */

import * as React from 'react';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// =============================================================================
// POJO Types (Plain Old JavaScript Objects - Serializable Primitives)
// =============================================================================

export type POJOValue = 
  | string 
  | number 
  | boolean 
  | null 
  | POJOValue[] 
  | { [key: string]: POJOValue };

// =============================================================================
// Markdown Types (Discriminated Union of Modal Blocks)
// =============================================================================

export type MarkdownInlineSegment = 
  | { type: 'text'; content: string }
  | { type: 'strong'; content: string }
  | { type: 'emphasis'; content: string }
  | { type: 'code'; content: string }
  | { type: 'link'; href: string; content: string };

export type MarkdownBlock = 
  | { type: 'paragraph'; segments: MarkdownInlineSegment[] }
  | { type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6; content: string }
  | { type: 'code_block'; language?: string; filename?: string; content: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'section'; title?: string; blocks: MarkdownBlock[] }
  | { type: 'article'; title?: string; metadata?: Record<string, any>; blocks: MarkdownBlock[] };

export type MarkdownValue = MarkdownBlock | MarkdownBlock[];

// =============================================================================
// Helper Functions
// =============================================================================



// =============================================================================
// Helper Functions
// =============================================================================

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Type for $ elements with phantom flag for type safety
 */
export type $el = React.ReactElement<{ children: string; $__: true }>;

/**
 * Special marker component for separating generated content from children
 * Returns a type-safe $el with phantom flag
 */
export const $ = ({ children }: { children: string }): $el => {
  const element = React.createElement('div', { className: '___string___', children });
  return element as unknown as $el;
};

/**
 * Extracts text content from React elements, specifically handling $ markers
 */
/**
 * Extracts text content from a React element tree, executing multimodal components
 */
function extractTextFromReactElement(element: any, modality: ModalityName = 'standard'): string {
  console.log('🔍 extractTextFromReactElement called with:', {
    elementType: typeof element,
    isValidElement: React.isValidElement(element),
    modality
  });

  if (!element) {
    return '';
  }
  
  if (typeof element === 'string' || typeof element === 'number') {
    return String(element);
  }
  
  if (React.isValidElement(element)) {
    const props = element.props as any;
    
    // Handle $ component specially
    if (element.type === $ || (element.type as any)?.name === '$') {
      console.log('💰 Found $ component with children:', props.children);
      return props.children || '';
    }
    
    // Check if this is a multimodal component (has a modality prop and is a function)
    if (props && 'modality' in props && typeof element.type === 'function') {
      console.log('🎯 Found multimodal component, executing with modality:', modality);
      try {
        // Execute the multimodal component with the current modality
        const result = (element.type as any)({ ...props, modality });
        console.log('✅ Multimodal component result:', { type: typeof result, isValidElement: React.isValidElement(result) });
        
        // Recursively extract from the result
        return extractTextFromReactElement(result, modality);
      } catch (error) {
        console.warn('❌ Error executing multimodal component:', error);
      }
    }
    
    // For other elements, recursively extract text from children
    if (props?.children) {
      if (Array.isArray(props.children)) {
        return props.children.map((child: any) => extractTextFromReactElement(child, modality)).join('');
      }
      return extractTextFromReactElement(props.children, modality);
    }
  }
  
  if (Array.isArray(element)) {
    return element.map(child => extractTextFromReactElement(child, modality)).join('');
  }
  
  return '';
}

// =============================================================================
// Static Modality Registry
// =============================================================================

export const MODALITY_REGISTRY = {
  standard: {
    name: 'standard',
    returnType: undefined as unknown as ReactNode,
    transform: undefined,
    emend: undefined
  },
  pojo: {
    name: 'pojo', 
    returnType: undefined as unknown as ReactNode,
    transform: undefined,
    emend: (reactElement: ReactNode) => {
      console.log(`📝 POJO emend - Input:`, JSON.stringify(reactElement, null, 2));
      
      // Render the React element to static markup
      const htmlString = renderToStaticMarkup(reactElement as React.ReactElement);
      console.log(`📝 POJO rendered HTML:`, htmlString);
      
      // Strip out the $ component tags and extract content
      const content = htmlString
        .replace(/<div class="___string___">/g, '')
        .replace(/<\/div>/g, '')
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .trim();
      
      console.log(`📝 POJO final content:`, content);
      return content;
    }
  },
  markdown: {
    name: 'markdown',
    returnType: undefined as unknown as ReactNode,
    transform: undefined,
    emend: (reactElement: ReactNode) => {
      console.log(`📝 Markdown emend - Input:`, JSON.stringify(reactElement, null, 2));
      
      // Render the React element to static markup
      const htmlString = renderToStaticMarkup(reactElement as React.ReactElement);
      console.log(`📝 Markdown rendered HTML:`, htmlString);
      
      // Strip out the $ component tags and extract content
      const content = htmlString
        .replace(/<div class="___string___">/g, '')
        .replace(/<\/div>/g, '')
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .trim();
      
      console.log(`📝 Markdown final content:`, content);
      return content;
    }
  }
} as const;

export type ModalityName = keyof typeof MODALITY_REGISTRY;

export type ModalityReturnType<T extends ModalityName> = 
  typeof MODALITY_REGISTRY[T]['returnType'];

// =============================================================================
// Base Props
// =============================================================================

export interface BaseModalProps {
  modality?: ModalityName;
}

// =============================================================================
// POJO Utilities (formerly YML utilities)
// =============================================================================

function escapeYMLString(value: string): string {
  if (
    value.includes(':') ||
    value.includes('-') ||
    value.includes('?') ||
    value.includes('{') ||
    value.includes('}') ||
    value.includes('[') ||
    value.includes(']') ||
    value.includes(',') ||
    value.includes('&') ||
    value.includes('*') ||
    value.includes('!') ||
    value.includes('%') ||
    value.includes('@') ||
    value.includes('`') ||
    value.includes('"') ||
    value.includes("'") ||
    value.includes('\\') ||
    value.includes('\n') ||
    value.includes('\r') ||
    value.includes('\t') ||
    value.trim() !== value ||
    value.match(/^\s*$/) ||
    value.match(/^[\-\?:,\[\]{}#&*!|>'"%@`]/) ||
    value.match(/^(true|false|null|yes|no|on|off|\d+|\d+\.\d+)$/i)
  ) {
    return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return value;
}

function createIndent(level: number): string {
  return '  '.repeat(level);
}


// =============================================================================
// Markdown Utilities  
// =============================================================================

function inlineSegmentToMarkdown(segment: MarkdownInlineSegment): string {
  switch (segment.type) {
    case 'text':
      return segment.content;
    case 'strong':
      return `**${segment.content}**`;
    case 'emphasis':
      return `*${segment.content}*`;
    case 'code':
      return `\`${segment.content}\``;
    case 'link':
      return `[${segment.content}](${segment.href})`;
    default:
      return '';
  }
}

function blockToMarkdown(block: MarkdownBlock): string {
  switch (block.type) {
    case 'paragraph':
      return block.segments.map(inlineSegmentToMarkdown).join('');
      
    case 'heading':
      return `${'#'.repeat(block.level)} ${block.content}`;
      
    case 'code_block':
      let result = '```';
      if (block.language) result += block.language;
      result += '\n';
      if (block.filename) result += `// ${block.filename}\n`;
      result += block.content;
      result += '\n```';
      return result;
      
    case 'list':
      const marker = block.ordered ? '1.' : '-';
      return block.items.map(item => `${marker} ${item}`).join('\n');
      
    case 'section':
      let sectionResult = '';
      if (block.title) {
        sectionResult += `## ${block.title}\n\n`;
      }
      sectionResult += block.blocks.map(blockToMarkdown).join('\n\n');
      return sectionResult;
      
    case 'article':
      let articleResult = '';
      if (block.title) {
        articleResult += `# ${block.title}\n\n`;
      }
      if (block.metadata) {
        articleResult += '---\n';
        Object.entries(block.metadata).forEach(([key, value]) => {
          articleResult += `${key}: ${value}\n`;
        });
        articleResult += '---\n\n';
      }
      articleResult += block.blocks.map(blockToMarkdown).join('\n\n');
      return articleResult;
      
    default:
      return '';
  }
}

// =============================================================================
// Multimodal Component Factory
// =============================================================================

export function multimodal<TProps extends BaseModalProps>(
  modalities: {
    [K in ModalityName]?: (props: TProps) => ModalityReturnType<K>;
  }
) {
  return function<TComponentProps extends TProps>(
    StandardComponent: React.ComponentType<TComponentProps>
  ): React.ComponentType<TComponentProps> {
    
    return function MultimodalComponent(props: TComponentProps) {
      const modality = props.modality ?? 'standard';
      
      // Type-safe modality lookup
      const modalityConfig = MODALITY_REGISTRY[modality];
      if (!modalityConfig) {
        console.warn(`Unknown modality: ${modality}, falling back to standard`);
        return React.createElement(StandardComponent, props);
      }
      
      // Get the modality-specific handler
      const modalityHandler = modalities[modality];
      if (!modalityHandler) {
        // No handler for this modality - just use standard (no transform)
        return React.createElement(StandardComponent, props);
      }
      
      // Execute the modality handler
      const result = modalityHandler(props);
      
      // Return the result directly (no transform needed)
      return result as ReactNode;
      return result as ReactNode;
    };
  };
}

// =============================================================================
// Modal-Specific Component Primitives Namespace
// =============================================================================

/**
 * Static registry for modal-specific components with compile-time type safety
 * 
 * M.md.* components return MarkdownValue types using create*() helpers
 * M.pojo.* components return POJOValue types (serializable primitives)
 * 
 * This serves as a type-first registry for modal primitives
 */
export const M = {
  md: {
    text: (props: { children: React.ReactNode }) => 
      createParagraph(createTextSegment(String(props.children))),
    
    heading: (props: { level: 1 | 2 | 3 | 4 | 5 | 6; children: React.ReactNode }) =>
      createHeading(props.level, String(props.children)),
    
    paragraph: (props: { children: React.ReactNode }) =>
      createParagraph(createTextSegment(String(props.children))),
    
    list: (props: { ordered?: boolean; children: React.ReactNode }) => {
      const items: string[] = [];
      React.Children.forEach(props.children, (child) => {
        if (React.isValidElement(child)) {
          items.push(String((child.props as any)?.children || ''));
        } else {
          items.push(String(child));
        }
      });
      return createList(items, props.ordered || false);
    },
    
    listItem: (props: { children: React.ReactNode }) =>
      createParagraph(createTextSegment(String(props.children))),
    
    link: (props: { href: string; children: React.ReactNode }) =>
      createParagraph(createLinkSegment(props.href, String(props.children))),
    
    code: (props: { language?: string; filename?: string; children: React.ReactNode }) =>
      createCodeBlock(String(props.children), props.language, props.filename),
    
    strong: (props: { children: React.ReactNode }) =>
      createParagraph(createStrongSegment(String(props.children)))
  },
  pojo: {
    text: (props: { children: React.ReactNode }) => 
      String(props.children),
    
    heading: (props: { level: 1 | 2 | 3 | 4 | 5 | 6; children: React.ReactNode }) => ({
      type: 'heading',
      level: props.level,
      text: String(props.children)
    } as POJOValue),
    
    paragraph: (props: { children: React.ReactNode }) => ({
      type: 'paragraph', 
      text: String(props.children)
    } as POJOValue),
    
    list: (props: { ordered?: boolean; children: React.ReactNode }) => {
      const items: string[] = [];
      React.Children.forEach(props.children, (child) => {
        if (React.isValidElement(child)) {
          items.push(String((child.props as any)?.children || ''));
        } else {
          items.push(String(child));
        }
      });
      return {
        type: 'list',
        ordered: props.ordered || false,
        items
      } as POJOValue;
    },
    
    listItem: (props: { children: React.ReactNode }) =>
      String(props.children),
    
    link: (props: { href: string; children: React.ReactNode }) => ({
      type: 'link',
      href: props.href,
      text: String(props.children)
    } as POJOValue),
    
    code: (props: { language?: string; filename?: string; children: React.ReactNode }) => ({
      type: 'code',
      ...(props.language && { language: props.language }),
      ...(props.filename && { filename: props.filename }),
      content: String(props.children)
    } as POJOValue),
    
    strong: (props: { children: React.ReactNode }) => ({
      type: 'strong',
      text: String(props.children)
    } as POJOValue)
  }
} as const;

export type ModalComponentRegistry = typeof M;

// =============================================================================
// POJO Utility Functions
// =============================================================================


export function createTextSegment(content: string): MarkdownInlineSegment {
  return { type: 'text', content };
}

export function createStrongSegment(content: string): MarkdownInlineSegment {
  return { type: 'strong', content };
}

export function createCodeSegment(content: string): MarkdownInlineSegment {
  return { type: 'code', content };
}

export function createLinkSegment(href: string, content: string): MarkdownInlineSegment {
  return { type: 'link', href, content };
}

export function createParagraph(...segments: MarkdownInlineSegment[]): MarkdownBlock {
  return { type: 'paragraph', segments };
}

export function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6, content: string): MarkdownBlock {
  return { type: 'heading', level, content };
}

export function createCodeBlock(content: string, language?: string, filename?: string): MarkdownBlock {
  return { type: 'code_block', content, language, filename };
}

export function createList(items: string[], ordered: boolean = false): MarkdownBlock {
  return { type: 'list', ordered, items };
}

export function createSection(blocks: MarkdownBlock[], title?: string): MarkdownBlock {
  return { type: 'section', title, blocks };
}

export function createArticle(blocks: MarkdownBlock[], title?: string, metadata?: Record<string, any>): MarkdownBlock {
  return { type: 'article', title, metadata, blocks };
}

// =============================================================================
// Modality Renderer
// =============================================================================

/**
 * Renders a multimodal component to a specific modality's output type,
 * applying the emend transformation if available.
 * 
 * This function properly executes the modality-specific logic and returns
 * the final output after emend transformation.
 * 
 * Usage:
 * ```typescript
 * const renderToPOJO = renderModality('pojo');
 * const pojoOutput = renderToPOJO(MyMultimodalComponent, props);
 * 
 * const renderToMarkdown = renderModality('markdown');  
 * const markdownOutput = renderToMarkdown(MyMultimodalComponent, props);
 * ```
 */
export function renderModality<M extends ModalityName>(modality: M) {
  return function<TProps extends BaseModalProps>(
    Component: any, // Component created with multimodal()
    props: TProps
  ): M extends 'pojo' ? POJOValue : string {
    // Get modality configuration
    const modalityConfig = MODALITY_REGISTRY[modality];
    if (!modalityConfig) {
      throw new Error(`Unknown modality: ${modality}`);
    }
    
    // For standard modality, we can't render to string without a React renderer
    if (modality === 'standard') {
      throw new Error('Cannot render standard modality to string without a React renderer');
    }
    
    // Execute the component with the requested modality
    const modalProps = { ...props, modality } as TProps;
    console.log(`🚀 renderModality(${modality}) - Executing component with props:`, JSON.stringify(modalProps, null, 2));
    const renderedOutput = Component(modalProps);
    console.log(`🚀 renderModality(${modality}) - Component output:`, JSON.stringify(renderedOutput, null, 2));
    
    // Apply emend directly to the rendered output (no transform needed)
    if (modalityConfig.emend && typeof modalityConfig.emend === 'function') {
      console.log(`🚀 renderModality(${modality}) - Calling emend function with:`, JSON.stringify(renderedOutput, null, 2));
      const result = modalityConfig.emend(renderedOutput) as M extends 'pojo' ? POJOValue : string;
      console.log(`🚀 renderModality(${modality}) - Final result:`, JSON.stringify(result, null, 2));
      return result;
    }
    
    console.log(`🚀 renderModality(${modality}) - No emend, returning raw output:`, JSON.stringify(renderedOutput, null, 2));
    return renderedOutput as M extends 'pojo' ? POJOValue : string;
  };
}

// =============================================================================
// Standard HTML Renderer
// =============================================================================

/**
 * Renders a multimodal component to standard HTML using React's built-in rendering.
 * This function forces the modality to null/standard and returns a simple HTML representation.
 * 
 * Usage:
 * ```typescript
 * const htmlOutput = renderStandardHtml(MyComponent, { ...props, modality: null });
 * ```
 */
export function renderStandardHtml<P extends { modality: null }>(
  Component: React.ComponentType<P>,
  props: P
): string {
  // Create component with standard modality (null)
  const element = React.createElement(Component, props);
  
  // Simple HTML string conversion
  // Note: This is a basic implementation. For production use, consider using react-dom/server
  if (React.isValidElement(element)) {
    const elementProps = element.props as any;
    
    // Handle common HTML elements
    if (typeof element.type === 'string') {
      const tag = element.type;
      const children = elementProps.children;
      const attrs = Object.entries(elementProps)
        .filter(([key]) => key !== 'children')
        .map(([key, value]) => `${key}="${String(value)}"`)
        .join(' ');
      
      if (children) {
        return `<${tag}${attrs ? ' ' + attrs : ''}>${String(children)}</${tag}>`;
      } else {
        return `<${tag}${attrs ? ' ' + attrs : ''} />`;
      }
    } else {
      // For component elements, extract children or convert to string
      return String(elementProps.children || element);
    }
  }
  
  return String(element);
}
