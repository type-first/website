/**
 * test.tsx - Multimodal v2 System Tests
 * 
 * Tests for the static registry system with modal primitives
 */

import * as React from 'react';
import * as Model from './multimodal.model';
import { ExampleArticle } from './article.example.cmp.mm';

// Extract the needed exports
const {
  renderModality,
  renderStandardHtml
} = Model;

console.log('🔥 Module loaded successfully');

// Test 1: HTML/Standard Modality
console.log('\n📝 Test 1: ExampleArticle - HTML/Standard Modality');
try {
  const htmlElement = <ExampleArticle modality="standard" />;
  console.log('✅ Standard React element created successfully');
  console.log('Element type:', typeof htmlElement);
  console.log('Is React element:', React.isValidElement(htmlElement));
  console.log('Component type:', (htmlElement.type as any)?.name || 'MultimodalComponent');
} catch (error) {
  console.log('❌ Error creating standard ExampleArticle:', error);
}

// Test 2: Markdown Modality  
console.log('\n📝 Test 2: ExampleArticle - Markdown Modality');
try {
  const markdownResult = renderModality('markdown')(ExampleArticle, {});
  console.log('✅ Markdown generation completed');
  console.log('Result type:', typeof markdownResult);
  console.log('Is string:', typeof markdownResult === 'string');
  console.log('Full markdown content:');
  console.log('---START MARKDOWN---');
  console.log(markdownResult);
  console.log('---END MARKDOWN---');
} catch (error) {
  console.log('❌ Error rendering markdown ExampleArticle:', error);
}

// Test 3: POJO Modality
console.log('\n📝 Test 3: ExampleArticle - POJO Modality');
try {
  const pojoResult = renderModality('pojo')(ExampleArticle, {});
  console.log('✅ POJO generation completed');
  console.log('Result type:', typeof pojoResult);
  console.log('Is object:', typeof pojoResult === 'object' && !React.isValidElement(pojoResult));
  console.log('Full POJO structure:');
  console.log('---START POJO---');
  console.log(JSON.stringify(pojoResult, null, 2));
  console.log('---END POJO---');
} catch (error) {
  console.log('❌ Error rendering POJO ExampleArticle:', error);
}

console.log('\n✅ All multimodal tests completed!');

console.log('\n✅ All multimodal tests completed!');
