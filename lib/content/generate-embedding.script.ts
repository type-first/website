#!/usr/bin/env tsx

/**
 * Script to generate embeddings for a specific chunk by ID
 * Usage: npx tsx scripts/generate-chunk-embedding.ts <chunk-id>
 */

console.log('🔧 Starting embedding generation script...');

import dotenv from 'dotenv';

console.log('📦 Loading environment variables...');
// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('📚 Importing modules...');
import * as yaml from 'yaml';
import { writeFile, mkdir } from 'fs/promises';
import * as path from 'path';
import { OpenAIEmbeddingProvider } from './embeddings/providers/openai';
import { prepareChunkForEmbedding } from './rich-text/extract-text';

console.log('📋 Loading chunks registry...');
import { searchChunksRegistry as chunks } from '../../content/chunks.registry';
import type { GenericContentChunk } from './content.model';

console.log('✅ All modules loaded successfully');

async function main() {
  console.log('🚀 Main function started');
  console.log(`📝 Command line args: ${JSON.stringify(process.argv)}`);
  
  const chunkId = process.argv[2];
  console.log(`🎯 Target chunk ID: "${chunkId}"`);
  
  if (!chunkId) {
    console.error('❌ Error: Chunk ID is required');
    console.log('Usage: npx tsx lib/content/generate-embedding.script.ts <chunk-id>');
    console.log('\nAvailable chunk IDs:');
    chunks.forEach((chunk: GenericContentChunk) => {
      console.log(`  - ${chunk.id}`);
    });
    process.exit(1);
  }

  console.log('🔑 Checking for OpenAI API key...');
  const apiKey = process.env.OPENAI_API_KEY;
  console.log(`🔍 API key present: ${apiKey ? 'YES' : 'NO'}`);
  if (apiKey) {
    console.log(`🔑 API key length: ${apiKey.length} characters`);
    console.log(`🔑 API key starts with: ${apiKey.substring(0, 7)}...`);
  }

  // Check for OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY environment variable is required');
    console.log('Please set your OpenAI API key:');
    console.log('export OPENAI_API_KEY="your-api-key-here"');
    process.exit(1);
  }

  console.log(`📊 Total chunks available: ${chunks.length}`);
  console.log('🔍 Searching for target chunk...');

  // Find the chunk
  const chunk = chunks.find((c: GenericContentChunk) => c.id === chunkId);
  if (!chunk) {
    console.error(`❌ Error: Chunk with ID "${chunkId}" not found`);
    console.log('\nAvailable chunk IDs:');
    chunks.forEach((c: GenericContentChunk) => {
      console.log(`  - ${c.id}`);
    });
    process.exit(1);
  }

  console.log('✅ Chunk found!');
  console.log(`🚀 Generating embedding for chunk: ${chunk.id}`);
  console.log(`📝 Label: ${chunk.label}`);
  console.log(`🏷️  Tags: ${chunk.tags.join(', ')}`);
  console.log(`📄 Raw text length: ${chunk.text.length} characters`);
  
  // Prepare the text for embedding (adds label as heading)
  const preparedText = prepareChunkForEmbedding(chunk);
  console.log(`📄 Prepared text length: ${preparedText.length} characters (+${preparedText.length - chunk.text.length} with heading)`);
  console.log(`💾 Vector file: ${chunk.vectorFp}`);
  console.log(`📄 First 100 chars of prepared text: ${preparedText.substring(0, 100)}...`);
  console.log('');

  try {
    console.log('🔧 Initializing OpenAI provider...');
    // Initialize the OpenAI provider
    const provider = new OpenAIEmbeddingProvider({
      apiKey: process.env.OPENAI_API_KEY!,
      model: 'text-embedding-3-small',
    });
    console.log('✅ OpenAI provider initialized');

    // Generate the embedding
    console.log('🔄 Generating embedding...');
    console.log(`📤 Sending prepared text to OpenAI (${preparedText.length} characters)...`);
    const embeddings = await provider.generateEmbeddings([preparedText]);
    console.log(`📥 Received ${embeddings.length} embeddings from OpenAI`);
    
    const embedding = embeddings[0];
    console.log(`📊 Embedding dimensions: ${embedding ? embedding.length : 'undefined'}`);

    console.log('📁 Preparing file system...');
    // Ensure the directory exists
    const dir = path.dirname(chunk.vectorFp);
    console.log(`📂 Creating directory: ${dir}`);
    await mkdir(dir, { recursive: true });

    console.log('📋 Creating embedding data structure...');
    // Create the embedding data
    const embeddingData = {
      id: chunk.id,
      label: chunk.label,
      tags: [...chunk.tags],
      textLength: chunk.text.length,
      preparedTextLength: preparedText.length,
      embedding: embedding,
      model: 'text-embedding-3-small',
      generatedAt: new Date().toISOString(),
      target: {
        kind: chunk.target.kind,
        slug: chunk.target.slug,
        name: chunk.target.name
      }
    };

    console.log('🔄 Converting to YAML...');
    // Write to YAML file
    const yamlContent = yaml.stringify(embeddingData);
    console.log(`📄 YAML content length: ${yamlContent.length} characters`);

    console.log(`💾 Writing to file: ${chunk.vectorFp}`);
    await writeFile(chunk.vectorFp, yamlContent, 'utf8');

    console.log(`✅ Embedding generated successfully!`);
    console.log(`📁 Saved to: ${chunk.vectorFp}`);
    console.log(`📊 Embedding dimensions: ${embedding.length}`);
    console.log(`⏰ Process completed at: ${new Date().toISOString()}`);

  } catch (error) {
    console.error('❌ Error generating embedding:');
    console.error(`❌ Error type: ${error instanceof Error ? error.constructor.name : typeof error}`);
    console.error(`❌ Error message: ${error instanceof Error ? error.message : String(error)}`);
    if (error instanceof Error && error.stack) {
      console.error('❌ Stack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

console.log('🎬 Calling main function...');
main().catch((error) => {
  console.error('💥 Unhandled error in main:');
  console.error(error);
  process.exit(1);
});
