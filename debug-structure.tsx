import React from 'react';
import { renderToMarkdown } from './lib/multimodal/v1';
import { Section, Paragraph, Heading } from './lib/multimodal/v1';

// Test the exact structure from the article
const testStructure = (
  <>
    <Section modality="markdown">
      <Paragraph modality="markdown">
        TypeScript has revolutionized React development by providing static type checking and enhanced developer experience. 
        In this comprehensive guide, we'll explore advanced TypeScript patterns that will elevate your React applications 
        to new levels of type safety and maintainability.
      </Paragraph>
    </Section>

    <Section modality="markdown">
      <Heading modality="markdown" level={2}>Generic Components</Heading>
      <Paragraph modality="markdown">
        Generic components are one of the most powerful patterns in TypeScript React development.
      </Paragraph>
    </Section>
  </>
);

const result = renderToMarkdown(testStructure);
console.log('Result with context markers:');
console.log(result.replace(/\n/g, '\\n'));

console.log('\nLooking for the problematic area:');
const genericIndex = result.indexOf('## Generic Components');
if (genericIndex !== -1) {
  console.log('Context around h2:', JSON.stringify(result.substring(genericIndex - 30, genericIndex + 30)));
}
