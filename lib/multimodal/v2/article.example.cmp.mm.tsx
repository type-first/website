/**
 * article.example.cmp.mm.tsx - Example Article Component for Testing
 * 
 * Simple example component to demonstrate the multimodal system
 */

import * as React from 'react';
import { multimodal, type BaseModalProps } from './multimodal.model';
import { Article, Section, FeatureList, CodeExample } from './article.lib.mm';

export interface ExampleArticleProps extends BaseModalProps {
  modality: 'markdown' | 'standard' | 'pojo';
}

export const ExampleArticle = multimodal<ExampleArticleProps>({})(({ modality }) => (
  <Article
    modality={modality}
    title="Advanced TypeScript Patterns for React"
    author="TypeScript Expert"
    publishedAt="2025-09-13"
  >
    <Section modality={modality} title="Introduction">
      Learn how to leverage advanced TypeScript patterns to build more robust and maintainable React applications.
    </Section>
    <Section modality={modality} title="Generic Components">
      Generic components allow you to create reusable UI elements that work with different data types while maintaining full type safety.
      <CodeExample
        modality={modality}
        title="Generic Component Example"
        description="A type-safe generic component:"
        language="typescript"
        filename="generic-list.tsx"
        code={`interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}`}
      />
    </Section>
    <Section modality={modality} title="Conditional Types">
      Conditional types enable you to create types that adapt based on the input, making your components more flexible and type-safe.
    </Section>
    <FeatureList
      modality={modality}
      title="Key Benefits"
      features={[
        {
          name: "Type Safety",
          description: "Catch errors at compile time with advanced TypeScript patterns"
        },
        {
          name: "Reusability", 
          description: "Create generic components that work with multiple data types"
        },
        {
          name: "Performance",
          description: "Optimize your applications with conditional type optimizations"
        }
      ]}
    />
  </Article>
));
