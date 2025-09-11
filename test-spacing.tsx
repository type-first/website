import React from 'react';
import { AdvancedTypescriptPatternsReactArticle } from './articles/advanced-typescript-patterns-react';
import { renderToMarkdown } from './lib/multimodal/v1';

const markdownComponent = <AdvancedTypescriptPatternsReactArticle modality="markdown" />;
const cleanMarkdown = renderToMarkdown(markdownComponent);

console.log('First 800 characters:');
console.log(cleanMarkdown.substring(0, 800));
console.log('...');

// Check specific patterns
if (cleanMarkdown.includes('[Community](/community)\n\n# Advanced')) {
  console.log('✅ Proper spacing after navigation');
} else {
  console.log('❌ Navigation spacing issue');
  console.log('Looking for pattern around navigation...');
  const navIndex = cleanMarkdown.indexOf('[Community](/community)');
  if (navIndex !== -1) {
    console.log('Navigation context:', cleanMarkdown.substring(navIndex, navIndex + 50));
  }
}

if (cleanMarkdown.includes('maintainability.\n\n## Generic Components')) {
  console.log('✅ Proper spacing before h2 headings');
} else {
  console.log('❌ H2 heading spacing issue');
  const h2Index = cleanMarkdown.indexOf('## Generic Components');
  if (h2Index !== -1) {
    console.log('H2 context:', JSON.stringify(cleanMarkdown.substring(h2Index - 30, h2Index + 30)));
  }
}
