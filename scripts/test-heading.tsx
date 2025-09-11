/**
 * Simple test to isolate the multimodal rendering issue
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { Heading } from '../lib/multimodal/v1/heading.mm.srv';

console.log('Testing individual component...');

// Test Heading component in standard mode
try {
  const standardHeading = renderToString(
    <Heading modality={null} level={1}>Test Heading</Heading>
  );
  console.log('✅ Standard heading rendering successful');
  console.log('Standard heading HTML:', standardHeading);
} catch (error) {
  console.error('❌ Standard heading rendering failed:', error);
}

// Test Heading component in markdown mode
try {
  const markdownHeading = renderToString(
    <Heading modality="markdown" level={1}>Test Heading</Heading>
  );
  console.log('✅ Markdown heading rendering successful');
  console.log('Markdown heading result:', markdownHeading);
} catch (error) {
  console.error('❌ Markdown heading rendering failed:', error);
}

console.log('Test completed!');
