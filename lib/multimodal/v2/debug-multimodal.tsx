#!/usr/bin/env tsx
/**
 * Debug the multimodal system
 */

import * as React from 'react';
import { renderModality } from './multimodal.model';
import { Article } from './article.lib.mm';

console.log('🔥 Debugging multimodal system\n');

// Test Article component with renderModality
console.log('📝 Testing Article with renderModality - POJO:');
try {
  const pojoOutput = renderModality('pojo')(Article, {
    title: 'Test Article',
    author: 'Test Author', 
    children: 'This is the article content',
    modality: 'pojo'
  });
  console.log('POJO Output type:', typeof pojoOutput);
  console.log('POJO Output:', JSON.stringify(pojoOutput, null, 2));
} catch (error) {
  console.error('Error with POJO:', error);
}

console.log('\n📝 Testing Article with renderModality - Markdown:');
try {
  const markdownOutput = renderModality('markdown')(Article, {
    title: 'Test Article',
    author: 'Test Author',
    children: 'This is the article content', 
    modality: 'markdown'
  });
  console.log('Markdown Output type:', typeof markdownOutput);
  console.log('Markdown Output:', markdownOutput);
} catch (error) {
  console.error('Error with Markdown:', error);
}
