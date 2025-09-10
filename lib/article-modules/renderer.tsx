import React from 'react';
import { Section, TextSection, CodeSection, QuoteSection, IslandSection } from './types';
import { highlightCode } from '@/lib/highlight';

interface ModuleArticleRendererProps {
  sections: Section[];
  className?: string;
  context?: 'web' | 'plaintext' | 'markdown'; // Different rendering contexts
}

export function ModuleArticleRenderer({ 
  sections, 
  className = '',
  context = 'web'
}: ModuleArticleRendererProps) {
  if (context === 'plaintext') {
    return null; // Plain text would be handled by utility functions
  }

  return (
    <article className={`prose prose-lg max-w-none ${className}`}>
      {sections.map((section, index) => (
        <ModuleSectionRenderer 
          key={section.id || index} 
          section={section} 
          index={index}
          context={context}
        />
      ))}
    </article>
  );
}

interface ModuleSectionRendererProps {
  section: Section;
  index: number;
  context: 'web' | 'markdown';
}

function ModuleSectionRenderer({ section, index, context }: ModuleSectionRendererProps) {
  const sectionId = section.id || `section-${index}`;

  switch (section.type) {
    case 'text':
      return <TextSectionRenderer section={section} id={sectionId} />;
    
    case 'code':
      return <CodeSectionRenderer section={section} id={sectionId} />;
    
    case 'quote':
      return <QuoteSectionRenderer section={section} id={sectionId} />;
    
    case 'island':
      return <IslandSectionRenderer section={section} id={sectionId} context={context} />;
    
    default:
      return null;
  }
}

function TextSectionRenderer({ section, id }: { section: TextSection; id: string }) {
  return (
    <div id={id} className="text-section">
      <div dangerouslySetInnerHTML={{ __html: section.content }} />
    </div>
  );
}

function CodeSectionRenderer({ section, id }: { section: CodeSection; id: string }) {
  const highlightedCode = highlightCode(section.content, section.language);
  
  return (
    <div id={id} className="code-section my-6">
      {section.filename && (
        <div className="bg-gray-100 px-4 py-2 text-sm font-mono text-gray-600 border-b">
          {section.filename}
        </div>
      )}
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      </pre>
    </div>
  );
}

function QuoteSectionRenderer({ section, id }: { section: QuoteSection; id: string }) {
  return (
    <blockquote id={id} className="quote-section border-l-4 border-blue-500 pl-6 italic text-gray-700 my-6">
      <p className="text-lg">{section.content}</p>
      {(section.author || section.source) && (
        <footer className="text-sm text-gray-500 mt-2">
          {section.author && <span>— {section.author}</span>}
          {section.source && <span>, {section.source}</span>}
        </footer>
      )}
    </blockquote>
  );
}

function IslandSectionRenderer({ 
  section, 
  id, 
  context 
}: { 
  section: IslandSection; 
  id: string; 
  context: 'web' | 'markdown';
}) {
  // In markdown context (e.g., for static export), show text alternative
  if (context === 'markdown') {
    return (
      <div id={id} className="island-placeholder bg-gray-100 p-4 rounded border-2 border-dashed">
        <p className="text-sm text-gray-600 mb-2">
          Interactive Component: {section.component.name || 'Unknown'}
        </p>
        <div className="text-gray-800">{section.textAlt}</div>
      </div>
    );
  }

  // In web context, render the actual component
  const Component = section.component;
  
  return (
    <div id={id} className="island-section my-6">
      <React.Suspense fallback={
        <div className="bg-gray-100 p-4 rounded animate-pulse">
          <div className="text-gray-600">{section.textAlt}</div>
        </div>
      }>
        <Component {...(section.props || {})} />
      </React.Suspense>
    </div>
  );
}

// Utility functions for different output formats
export function renderToPlainText(sections: Section[]): string {
  return sections.map(section => {
    switch (section.type) {
      case 'text':
        // Strip HTML tags for plain text
        return section.content.replace(/<[^>]*>/g, '');
      case 'quote':
        return `"${section.content}"${section.author ? ` — ${section.author}` : ''}`;
      case 'code':
        return `[Code: ${section.language}]\n${section.content}`;
      case 'island':
        return section.textAlt;
      default:
        return '';
    }
  }).join('\n\n');
}

export function renderToMarkdown(sections: Section[]): string {
  return sections.map(section => {
    switch (section.type) {
      case 'text':
        return section.content;
      case 'quote':
        const quote = `> ${section.content}`;
        const attribution = section.author || section.source;
        return attribution ? `${quote}\n>\n> — ${attribution}` : quote;
      case 'code':
        const filename = section.filename ? `\`\`\`${section.language} title="${section.filename}"\n` : `\`\`\`${section.language}\n`;
        return `${filename}${section.content}\n\`\`\``;
      case 'island':
        return `<!-- Interactive Component: ${section.component.name} -->\n${section.textAlt}`;
      default:
        return '';
    }
  }).join('\n\n');
}
