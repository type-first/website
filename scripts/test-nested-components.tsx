/**
 * Test nested component structure like in the article
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  Article,
  Header,
  Navigation,
  Link,
  Heading,
  Paragraph,
  Section
} from '../lib/multimodal/v1';

console.log('Testing nested component structure...\n');

// Test simple nesting in standard mode
console.log('=== STANDARD MODE ===');
try {
  const standardResult = renderToString(
    <Article modality={null}>
      <Header modality={null}>
        <Navigation modality={null}>
          <Link modality={null} href="/">Home</Link>
        </Navigation>
      </Header>
      <Section modality={null}>
        <Heading modality={null} level={1}>Test Article</Heading>
        <Paragraph modality={null}>This is a test paragraph.</Paragraph>
      </Section>
    </Article>
  );
  console.log(`✅ Standard nested rendering successful: ${standardResult.length} chars`);
  console.log('Preview:', standardResult.substring(0, 200) + '...');
} catch (error) {
  console.error('❌ Standard nested rendering failed:', error);
}

// Test simple nesting in markdown mode
console.log('\n=== MARKDOWN MODE ===');
try {
  const markdownResult = renderToString(
    <Article modality="markdown">
      <Header modality="markdown">
        <Navigation modality="markdown">
          <Link modality="markdown" href="/">Home</Link>
        </Navigation>
      </Header>
      <Section modality="markdown">
        <Heading modality="markdown" level={1}>Test Article</Heading>
        <Paragraph modality="markdown">This is a test paragraph.</Paragraph>
      </Section>
    </Article>
  );
  console.log(`✅ Markdown nested rendering successful: ${markdownResult.length} chars`);
  console.log('Preview:', markdownResult.substring(0, 200) + '...');
} catch (error) {
  console.error('❌ Markdown nested rendering failed:', error);
}

console.log('\nTest completed!');
