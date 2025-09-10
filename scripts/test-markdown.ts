#!/usr/bin/env node

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Modality } from '../lib/article-components';

// Make React available globally for JSX
(globalThis as any).React = React;

// Import the article component
import AiDrivenInterfacesReactPage from '../app/articles/ai-driven-interfaces-react/page';

console.log('Testing markdown rendering...\n');

try {
  // Render to markdown
  const markdownOutput = renderToStaticMarkup(
    React.createElement(Modality.Markdown, {
      children: React.createElement(AiDrivenInterfacesReactPage)
    })
  );

  console.log('=== MARKDOWN OUTPUT ===');
  console.log(markdownOutput);
  console.log('=== END OUTPUT ===');

} catch (error) {
  console.error('Error rendering markdown:', error);
  
  // Let's also try direct component rendering
  console.log('\nTrying direct component rendering...');
  
  try {
    const directOutput = renderToStaticMarkup(
      React.createElement(AiDrivenInterfacesReactPage)
    );
    console.log('=== DIRECT HTML OUTPUT ===');
    console.log(directOutput.slice(0, 500) + '...');
    console.log('=== END OUTPUT ===');
  } catch (directError) {
    console.error('Direct rendering also failed:', directError);
  }
}
