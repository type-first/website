/**
 * Example demonstrating the embeddings system
 */

import { ContentChunker } from '../lib/embeddings/content-chunker';

// Example content data (simulating our article structure)
const exampleContent = {
  metadata: {
    title: "Example Article",
    description: "A sample article for testing embeddings",
    tags: ["example", "test"],
    author: "Test Author",
    publishedAt: "2025-09-15",
    updatedAt: "2025-09-15",
  },
  
  introduction: "This is an example article to demonstrate the embeddings system.",
  
  sections: [
    {
      id: "introduction",
      title: "Introduction to the Topic",
      subtitle: "Getting Started",
      content: "This section provides an overview of the main concepts we'll be covering.",
      codeSnippet: {
        language: "typescript",
        filename: "example.ts",
        code: "const example = 'Hello, World!';",
      }
    },
    {
      id: "bestPractices",
      title: "Best Practices",
      content: "Here are some important guidelines to follow:",
      practices: [
        {
          title: "Use TypeScript",
          description: "Always use TypeScript for better type safety"
        },
        {
          title: "Write Tests", 
          description: "Comprehensive testing ensures code quality"
        }
      ]
    }
  ],
  
  footer: {
    title: "Conclusion",
    content: "This concludes our example article."
  }
};

async function demonstrateChunking() {
  console.log('🔄 Demonstrating Content Chunking...\n');
  
  const chunker = new ContentChunker();
  
  // Chunk the full article
  const chunks = chunker.chunkFullArticle(exampleContent);
  
  console.log(`📦 Generated ${chunks.length} chunks:\n`);
  
  chunks.forEach((chunk, index) => {
    console.log(`${index + 1}. ${chunk.type.toUpperCase()}: ${chunk.id}`);
    console.log(`   Title: ${chunk.sectionTitle || 'N/A'}`);
    console.log(`   Order: ${chunk.order}`);
    console.log(`   Tokens: ~${chunk.tokenCount}`);
    console.log(`   Content: ${chunk.content.substring(0, 100)}...`);
    console.log('');
  });
  
  console.log('✅ Chunking demonstration complete!');
}

if (require.main === module) {
  demonstrateChunking().catch(console.error);
}
