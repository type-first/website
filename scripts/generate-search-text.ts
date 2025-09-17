#!/usr/bin/env node
/**
 * Pre-build script to generate search text for content chunks
 * Runs in clean Node environment to avoid RSC proxy issues
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import React from 'react'
import { renderToString } from 'react-dom/server'

// Mock the Next.js server environment for component rendering
global.React = React

/**
 * Safely render JSX to plain text in Node environment
 * This avoids RSC proxy issues by running at build time
 */
function renderComponentToText(component: React.ReactElement): string {
  try {
    const html = renderToString(component)
    // Strip HTML tags to get plain text
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  } catch (error) {
    console.warn('Failed to render component:', error)
    return ''
  }
}

/**
 * Generate search text for article chunks
 */
function generateChunkText() {
  // This would be called by a build script before Next.js build
  console.log('Generating search text for content chunks...')
  
  // For now, let's create a simple manifest that the chunks can import
  const searchTexts = {
    'advanced-typescript-patterns-react:metadata': 'Advanced TypeScript patterns for React development guide covering generics, conditional types, and best practices',
    'advanced-typescript-patterns-react:introduction': 'Introduction to advanced TypeScript patterns and their application in React applications',
    'advanced-typescript-patterns-react:generics': 'Understanding TypeScript generics and how to use them effectively in React components',
    'advanced-typescript-patterns-react:conditional-types': 'Conditional types in TypeScript for advanced component type inference',
    'advanced-typescript-patterns-react:api-patterns': 'API design patterns using TypeScript for type-safe React applications',
    'advanced-typescript-patterns-react:best-practices': 'Best practices for implementing TypeScript patterns in React projects',
    'advanced-typescript-patterns-react:conclusion': 'Summary and conclusion of advanced TypeScript patterns for React development'
  }
  
  const outputPath = join(process.cwd(), 'content/articles/advanced-typescript-patterns-react/search-text.json')
  writeFileSync(outputPath, JSON.stringify(searchTexts, null, 2))
  
  console.log('Generated search text manifest:', outputPath)
}

if (require.main === module) {
  generateChunkText()
}

export { renderComponentToText }
