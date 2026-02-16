#!/usr/bin/env ts-node

/**
 * Demo script to show the markdown export
 */

import path from 'path';
import { writeFile } from 'fs/promises';

async function main() {
  console.log('🚀 Demo: Article markdown export\n');

  try {
    // Article configuration
    const articleSlug = 'advanced-typescript-patterns-react';
    const articlePath = path.join(process.cwd(), 'content', 'articles', articleSlug);
    
    // Import the article markdown
    const { articleMarkdown } = await import(path.join(articlePath, 'data.ts'));

    console.log(`📄 Markdown length: ${articleMarkdown.length} characters`);
    console.log(`📊 Preview (first 500 chars):\n`);
    console.log('─'.repeat(50));
    console.log(articleMarkdown.substring(0, 500) + '...');
    console.log('─'.repeat(50));

    // Save to a demo file
    const outputPath = path.join(articlePath, 'demo.markdown.md');
    await writeFile(outputPath, articleMarkdown, 'utf8');
    
    console.log(`\n✅ Markdown export demo completed!`);
    console.log(`📄 Full markdown saved to: ${outputPath}`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);
