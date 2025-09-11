/**
 * Test script to verify multimodal article rendering
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import AdvancedTypescriptPatternsReactArticle, { articleMetadata } from '../articles/advanced-typescript-patterns-react';
import { renderToMarkdown } from '../lib/multimodal/v1';

console.log('Testing article rendering...');

// Test metadata export
console.log('Article metadata:', {
  title: articleMetadata.title,
  tags: articleMetadata.tags,
  publishedAt: articleMetadata.publishedAt,
});

// Test standard mode rendering
try {
  const standardHtml = renderToString(
    React.createElement(AdvancedTypescriptPatternsReactArticle, { modality: null })
  );
  console.log('✅ Standard mode rendering successful');
  console.log('HTML length:', standardHtml.length);
} catch (error) {
  console.error('❌ Standard mode rendering failed:', error);
}

// Test markdown mode rendering
try {
  console.log('Creating markdown component...');
  const markdownComponent = <AdvancedTypescriptPatternsReactArticle modality="markdown" />;
  console.log('Markdown component type:', typeof markdownComponent);
  console.log('Is valid React element?', React.isValidElement(markdownComponent));
  
  console.log('Rendering to clean markdown...');
  const cleanMarkdown = renderToMarkdown(markdownComponent);
  
  console.log('✅ Markdown mode rendering successful');
  console.log('Clean markdown length:', cleanMarkdown.length);
  console.log('Clean markdown preview:', cleanMarkdown.substring(0, 500) + '...');
} catch (error) {
  console.error('❌ Markdown mode rendering failed:', error);
}

console.log('Test completed!');
