import React from 'react';
import { Section } from '@/lib/schemas/article';
import { IslandLoader } from '@/lib/islands/registry';

interface ArticleRendererProps {
  sections: Section[];
  className?: string;
}

export function ArticleRenderer({ sections, className = '' }: ArticleRendererProps) {
  return (
    <article className={`prose prose-lg max-w-none ${className}`}>
      {sections.map((section, index) => (
        <SectionRenderer key={section.id || index} section={section} index={index} />
      ))}
    </article>
  );
}

interface SectionRendererProps {
  section: Section;
  index: number;
}

function SectionRenderer({ section, index }: SectionRendererProps) {
  const sectionId = section.id || `section-${index}`;

  switch (section.type) {
    case 'text':
      return (
        <div id={sectionId} className="text-section">
          <TextContent content={section.content} />
        </div>
      );

    case 'quote':
      return (
        <blockquote id={sectionId} className="quote-section border-l-4 border-blue-500 pl-6 italic text-gray-700 my-6">
          <p className="text-lg">{section.content}</p>
          {(section.author || section.source) && (
            <footer className="text-sm text-gray-500 mt-2">
              {section.author && <span>— {section.author}</span>}
              {section.source && <span>, {section.source}</span>}
            </footer>
          )}
        </blockquote>
      );

    case 'code':
      return (
        <div id={sectionId} className="code-section my-6">
          {section.filename && (
            <div className="bg-gray-100 px-4 py-2 text-sm text-gray-600 border-b border-gray-300 rounded-t-lg">
              {section.filename}
            </div>
          )}
          <pre className={`overflow-x-auto ${section.filename ? 'rounded-t-none' : ''} rounded-lg`}>
            <code className={`language-${section.language} block p-4 bg-gray-900 text-gray-100`}>
              {section.content}
            </code>
          </pre>
        </div>
      );

    case 'island':
      return (
        <div id={sectionId} className="island-section my-8">
          <IslandLoader 
            name={section.component} 
            props={section.props}
            fallback={
              <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
                <p className="text-sm text-gray-500 mt-4">{section.textAlt}</p>
              </div>
            }
          />
        </div>
      );

    default:
      return null;
  }
}

// Text content renderer with markdown-like formatting
function TextContent({ content }: { content: string }) {
  // Split content by paragraphs and process each
  const paragraphs = content.split('\n\n').filter(p => p.trim());

  return (
    <>
      {paragraphs.map((paragraph, index) => {
        // Check if it's a heading
        const headingMatch = paragraph.match(/^(#{1,6})\s+(.+)$/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const text = headingMatch[2];
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          
          // Use createElement for dynamic heading tags
          const HeadingComponent = ({ children, ...props }: any) => {
            const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
            return React.createElement(Tag, props, children);
          };
          
          return (
            <HeadingComponent 
              key={index} 
              id={id}
              className={`heading-${level} scroll-mt-20`}
            >
              {text}
            </HeadingComponent>
          );
        }

        // Regular paragraph
        return (
          <p key={index} className="mb-4">
            <FormattedText text={paragraph} />
          </p>
        );
      })}
    </>
  );
}

// Simple text formatting (bold, italic, links)
function FormattedText({ text }: { text: string }) {
  // Simple regex-based formatting
  let formatted = text;

  // Bold text
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic text
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Inline code
  formatted = formatted.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
  
  // Links
  formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>');

  return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
}
