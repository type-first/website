#!/usr/bin/env tsx
/**
 * Article Markdown Generator
 * Generates clean markdown output for multimodal articles
 */

import React from 'react';
import { promises as fs } from 'fs';
import * as path from 'path';
import clipboardy from 'clipboardy';
import { renderToMarkdown } from '../lib/multimodal/v1/markdown-utils';

// Import available articles
import { AdvancedTypescriptPatternsReactArticle, articleMetadata as advancedTsMetadata } from '../articles/advanced-typescript-patterns-react/article';

const ARTICLES = {
  'advanced-typescript-patterns-react': {
    component: AdvancedTypescriptPatternsReactArticle,
    metadata: advancedTsMetadata,
    slug: 'advanced-typescript-patterns-react'
  }
} as const;

type ArticleKey = keyof typeof ARTICLES;

async function generateMarkdown(articleKey: ArticleKey, action: 'print' | 'copy' | 'write') {
  const article = ARTICLES[articleKey];
  const markdown = renderToMarkdown(React.createElement(article.component, { modality: 'markdown' }));
  
  switch (action) {
    case 'print':
      console.log('\n' + '='.repeat(50));
      console.log(`📄 Markdown for: ${articleKey}`);
      console.log('='.repeat(50) + '\n');
      console.log(markdown);
      break;
      
    case 'copy':
      try {
        await clipboardy.write(markdown);
        console.log(`✅ Markdown for "${articleKey}" copied to clipboard`);
      } catch (error) {
        console.error('❌ Failed to copy to clipboard:', error);
        process.exit(1);
      }
      break;
      
    case 'write':
      const outputDir = path.join(process.cwd(), 'tmp');
      const outputPath = path.join(outputDir, `${articleKey}.md`);
      
      try {
        await fs.mkdir(outputDir, { recursive: true });
        await fs.writeFile(outputPath, markdown, 'utf8');
        console.log(`✅ Markdown saved to: ${outputPath}`);
      } catch (error) {
        console.error('❌ Failed to save file:', error);
        process.exit(1);
      }
      break;
  }
}

function listArticles() {
  console.log('📚 Available Articles:');
  console.log('');
  Object.entries(ARTICLES).forEach(([key, article]) => {
    console.log(`  ${key.padEnd(35)} - ${article.metadata.title}`);
  });
  console.log('');
  console.log('Use: npm run md:gen:print <article> to generate markdown');
}

function printUsage() {
  console.log('📚 Markdown Generator');
  console.log('');
  console.log('Usage:');
  console.log('  npm run md:gen:print <article>  - Print markdown to console');
  console.log('  npm run md:gen:copy <article>   - Copy markdown to clipboard');
  console.log('  npm run md:gen:write <article>  - Save markdown to file');
  console.log('  npm run md:gen:list             - List available articles');
  console.log('');
  console.log('Examples:');
  console.log('  npm run md:gen:print advanced-typescript-patterns-react');
  console.log('  npm run md:gen:copy advanced-typescript-patterns-react');
  console.log('  npm run md:gen:write advanced-typescript-patterns-react');
}

// Parse command line arguments
const args = process.argv.slice(2);
// Filter out the '--' that npm adds
const filteredArgs = args.filter(arg => arg !== '--');
const action = filteredArgs[0]; // 'print', 'copy', 'write', or 'list'
const articleKey = filteredArgs[1];

if (!action) {
  printUsage();
  process.exit(1);
}

if (action === 'list') {
  listArticles();
} else if (['print', 'copy', 'write'].includes(action)) {
  if (!articleKey || !(articleKey in ARTICLES)) {
    console.error(`❌ Article "${articleKey}" not found`);
    console.log('Available articles:', Object.keys(ARTICLES).join(', '));
    process.exit(1);
  }
  generateMarkdown(articleKey as ArticleKey, action as 'print' | 'copy' | 'write');
} else {
  console.error(`❌ Unknown action: ${action}`);
  console.log('');
  printUsage();
  process.exit(1);
}
