#!/usr/bin/env tsx

/**
 * Test script to see what text extractPlainText generates
 */

import { extractPlainText } from './lib/content/rich-text/extract-text';
import React from 'react';

async function main() {
  // Test with JSX directly
  const testJSX = React.createElement('p', {}, 'Hello world');
  console.log('Test JSX text:', extractPlainText(testJSX));

  // Now let's check what's in the chunks
  console.log('\nChecking chunks registry...');
  try {
    const { chunks } = await import('./content/articles/advanced-typescript-patterns-react/chunks');
    
    console.log('Testing text extraction for chunks...\n');
    
    chunks.forEach(chunk => {
      console.log(`\n--- Chunk: ${chunk.id} ---`);
      console.log(`Label: ${chunk.label}`);
      console.log(`Text length: ${chunk.text.length}`);
      console.log(`Text preview: "${chunk.text.substring(0, 200)}..."`);
      console.log('---');
    });
  } catch (error:any) {
    console.error('Error loading chunks:', error.message);
  }
}

main().catch(console.error);
