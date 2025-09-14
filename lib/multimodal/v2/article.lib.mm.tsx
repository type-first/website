/**
 * examples.cmp.mm.tsx - Multimodal v2 Component Examples
 * 
 * Demonstrates the static registry system with modal-specific components
 */

import * as React from 'react';
import { 
  multimodal,
  M,
  $,
  type BaseModalProps,
  type POJOValue,
  type MarkdownValue,
  createParagraph,
  createHeading,
  createList,
  createSection,
  createArticle,
  createTextSegment,
  createStrongSegment,
  createCodeSegment,
  createLinkSegment,
  createCodeBlock
} from './multimodal.model';

// =============================================================================
// Example Component - Article
// =============================================================================

export interface ArticleProps extends BaseModalProps {
  title: string;
  author?: string;
  publishedAt?: string;
  children: React.ReactNode;
}

export const Article = multimodal<ArticleProps>({
  pojo: ({ title, author, publishedAt, children }) => (
    <>
      <$>{`type: article, title: ${title}${author ? `, author: ${author}` : ''}${publishedAt ? `, publishedAt: ${publishedAt}` : ''}
`}</$>
      {children}
    </>
  ),  markdown: ({ title, author, publishedAt, children }) => {
    const metadata: Record<string, any> = {};
    if (author) metadata.author = author;
    if (publishedAt) metadata.publishedAt = publishedAt;
    
    let headerText = `# ${title}\n\n`;
    if (Object.keys(metadata).length > 0) {
      headerText += '---\n';
      Object.entries(metadata).forEach(([key, value]) => {
        headerText += `${key}: ${value}\n`;
      });
      headerText += '---\n\n';
    }
    
    return (
      <>
        <$>{headerText}</$>
        {children}
        <$>{'\n\n---\n\n'}</$>
      </>
    );
  }
})(({ title, author, children }) => (
  <article className="max-w-4xl mx-auto px-6 py-12">
    <header className="mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
      {author && <p className="text-gray-600">By {author}</p>}
    </header>
    <div className="prose">{children}</div>
  </article>
));

// =============================================================================
// Example Component - Section
// =============================================================================

export interface SectionProps extends BaseModalProps {
  title?: string;
  children: React.ReactNode;
}

export const Section = multimodal<SectionProps>({
  pojo: ({ title, children }) => (
    <>
      <$>{`${title ? `section: ${title}\n` : ''}content: `}</$>
      {children}
      <$>{'\n---\n'}</$>
    </>
  ),
  
  markdown: ({ title, children }) => (
    <>
      {title && <$>{`## ${title}\n\n`}</$>}
      {children}
      <$>{'\n\n'}</$>
    </>
  )
})(({ title, children }) => (
  <section className="mb-8">
    {title && <h2 className="text-2xl font-semibold mb-4">{title}</h2>}
    <div>{children}</div>
  </section>
));

// =============================================================================
// Example Component - FeatureList
// =============================================================================

export interface FeatureListProps extends BaseModalProps {
  title: string;
  features: Array<{
    name: string;
    description: string;
    link?: string;
  }>;
}

export const FeatureList = multimodal<FeatureListProps>({
  pojo: ({ title, features }) => (
    <>
      <$>{JSON.stringify({
        type: 'feature_list',
        title,
        features: features.map(f => ({
          name: f.name,
          description: f.description,
          ...(f.link && { link: f.link })
        }))
      }, null, 2)}</$>
    </>
  ),
  
  markdown: ({ title, features }) => {
    const items = features.map(feature => {
      if (feature.link) {
        return `**[${feature.name}](${feature.link})**: ${feature.description}`;
      } else {
        return `**${feature.name}**: ${feature.description}`;
      }
    });
    
    const markdown = `## ${title}\n\n${items.map(item => `- ${item}`).join('\n')}\n\n`;
    
    return (
      <>
        <$>{markdown}</$>
      </>
    );
  }
})(({ title, features }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="border-l-4 border-blue-500 pl-4">
          <strong className="text-blue-700">
            {feature.link ? (
              <a href={feature.link} className="hover:underline">
                {feature.name}
              </a>
            ) : (
              feature.name
            )}
          </strong>
          <p className="text-gray-700 mt-1">{feature.description}</p>
        </li>
      ))}
    </ul>
  </div>
));

// =============================================================================
// Example Component - CodeExample
// =============================================================================

export interface CodeExampleProps extends BaseModalProps {
  title: string;
  description: string;
  language: string;
  filename?: string;
  code: string;
}

export const CodeExample = multimodal<CodeExampleProps>({
  pojo: ({ title, description, language, filename, code }) => (
    <>
      <$>{JSON.stringify({
        type: 'code_example',
        title,
        description,
        code: {
          language,
          ...(filename && { filename }),
          content: code
        }
      }, null, 2)}</$>
    </>
  ),
  
  markdown: ({ title, description, language, filename, code }) => {
    let markdown = `### ${title}\n\n${description}\n\n`;
    markdown += '```';
    if (language) markdown += language;
    markdown += '\n';
    if (filename) markdown += `// ${filename}\n`;
    markdown += code;
    markdown += '\n```\n\n';
    
    return (
      <>
        <$>{markdown}</$>
      </>
    );
  }
})(({ title, description, language, filename, code }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    {filename && <p className="text-sm text-gray-500 mb-2">📁 {filename}</p>}
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
      <code className={`language-${language}`}>
        {code}
      </code>
    </pre>
  </div>
));

// =============================================================================
// Comprehensive Demo Article
// =============================================================================

const DemoArticle = () => (
  <Article 
    title="Multimodal v2 System Demo"
    author="Type-First Team"
    publishedAt="2025-09-13"
    modality="standard"
  >
    <Section title="Introduction" modality="standard">
      The new multimodal v2 system provides a clean, type-safe way to create 
      components that can render in multiple formats: standard React, YAML 
      serialization, and structured Markdown.
    </Section>

    <FeatureList
      title="Key Benefits"
      features={[
        {
          name: "Static Registry",
          description: "Compile-time type safety with const assertions - no runtime registration needed"
        },
        {
          name: "Modal Primitives",
          description: "M.md.* and M.yml.* helpers for building structured content"
        },
        {
          name: "Discriminated Unions",
          description: "Structured markdown output using TypeScript discriminated unions"
        },
        {
          name: "YML Serialization",
          description: "Clean serializable primitive types that convert to proper YAML"
        }
      ]}
      modality="standard"
    />

    <CodeExample
      title="Using Modal Primitives"
      description="The M object provides modal-specific helper functions:"
      language="typescript"
      filename="example.tsx"
      code={`// Create markdown structures programmatically
const mdContent = M.md.list([
  "First item",
  "Second item", 
  "Third item"
]);

// Create YML structures
const ymlData = M.yml.object({
  title: "My Document",
  items: ["item1", "item2", "item3"]
});`}
      modality="standard"
    />

    <CodeExample
      title="Multimodal Component Definition"
      description="Create components that can render in multiple modalities:"
      language="typescript"
      filename="my-component.tsx"
      code={`const MyComponent = multimodal<Props>({
  yml: ({ title, items }) => ({
    type: 'list',
    title,
    items
  }),
  
  markdown: ({ title, items }) => 
    createSection([
      createHeading(2, title),
      createList(items, false)
    ])
})(({ title, items }) => (
  <div>
    <h2>{title}</h2>
    <ul>
      {items.map(item => <li key={item}>{item}</li>)}
    </ul>
  </div>
));`}
      modality="standard"
    />
  </Article>
);

// =============================================================================
// Export everything
// =============================================================================

export default DemoArticle;
