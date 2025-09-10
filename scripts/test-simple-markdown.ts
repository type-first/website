#!/usr/bin/env node

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Modality, Text, Paragraph } from '../lib/article-components';

console.log('Testing simple markdown rendering...\n');

// Simple test component
function SimpleTest() {
  return (
    <>
      <Paragraph>
        This is a test with <Text bold>bold text</Text> and <Text italic>italic text</Text>.
      </Paragraph>
    </>
  );
}

try {
  // Render to markdown
  const markdownOutput = renderToStaticMarkup(
    React.createElement(Modality.Markdown, {
      children: React.createElement(SimpleTest)
    })
  );

  console.log('=== SIMPLE MARKDOWN OUTPUT ===');
  console.log(markdownOutput);
  console.log('=== END OUTPUT ===');

} catch (error) {
  console.error('Error rendering markdown:', error);
}
