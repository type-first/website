import React from 'react';
import { writeFileSync } from 'fs';
import { AdvancedTypescriptPatternsReactArticle, articleMetadata } from './articles/advanced-typescript-patterns-react';
import { renderToMarkdown } from './lib/multimodal/v1';

console.log('Generating clean markdown output...');

try {
  // Create markdown component
  const markdownComponent = <AdvancedTypescriptPatternsReactArticle modality="markdown" />;
  
  // Render to clean markdown
  const cleanMarkdown = renderToMarkdown(markdownComponent);
  
  // Save to file
  const outputPath = './test-output.md';
  writeFileSync(outputPath, cleanMarkdown, 'utf8');
  
  console.log(`✅ Clean markdown saved to ${outputPath}`);
  console.log(`Length: ${cleanMarkdown.length} characters`);
  console.log('\nFirst 500 characters:');
  console.log(cleanMarkdown.substring(0, 500));
  console.log('\n...');
  
} catch (error) {
  console.error('❌ Error generating markdown:', error);
}
