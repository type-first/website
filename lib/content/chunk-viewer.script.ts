#!/usr/bin/env tsx

/**
 * Chunk viewer script - shows complete chunk details
 * Usage: npx tsx lib/content/chunk-viewer.script.ts <chunk-id>
 */

import { prepareChunkForEmbedding } from './rich-text/extract-text';
import { searchChunksRegistry as chunks } from '../../content/chunks.registry';
import { existsSync } from 'fs';
import * as path from 'path';

async function main() {
  const chunkId = process.argv[2];
  
  if (!chunkId) {
    console.error('❌ Error: Chunk ID is required');
    console.log('Usage: npx tsx lib/content/chunk-viewer.script.ts <chunk-id>');
    console.log('\nAvailable chunk IDs:');
    chunks.forEach(chunk => {
      console.log(`  - ${chunk.id}`);
    });
    process.exit(1);
  }

  const chunk = chunks.find(c => c.id === chunkId);
  
  if (!chunk) {
    console.error(`❌ Error: Chunk '${chunkId}' not found`);
    console.log('\nAvailable chunk IDs:');
    chunks.forEach(chunk => {
      console.log(`  - ${chunk.id}`);
    });
    process.exit(1);
  }

  // Check if embedding file exists (check both possible locations)
  const embeddingJsonPath = path.join(process.cwd(), 'lib/content/embeddings', `${chunkId}.json`);
  const embeddingYamlPath = chunk.vectorFp; // Use the vectorFp from the chunk
  const hasEmbeddingJson = existsSync(embeddingJsonPath);
  const hasEmbeddingYaml = existsSync(embeddingYamlPath);
  const hasEmbedding = hasEmbeddingJson || hasEmbeddingYaml;

  // Prepare the chunk for embedding (what would be used for vector search)
  const preparedText = prepareChunkForEmbedding(chunk);

  console.log('🔍 CHUNK DETAILS');
  console.log('='.repeat(60));
  console.log(`📋 ID: ${chunk.id}`);
  console.log(`🏷️  Label: ${chunk.label}`);
  console.log(`🏷️  Tags: [${chunk.tags.join(', ')}]`);
  console.log(`📏 Text Length: ${chunk.text.length} characters`);
  console.log(`🎯 Embedding: ${hasEmbedding ? '✅ Generated' : '❌ Missing'}`);
  
  if (hasEmbedding) {
    try {
      let embeddingData;
      if (hasEmbeddingYaml) {
        // Try to read YAML first (newer format)
        const yamlContent = require('fs').readFileSync(embeddingYamlPath, 'utf8');
        embeddingData = require('yaml').parse(yamlContent);
        console.log(`📊 Embedding Dimensions: ${embeddingData.embedding?.length || 'unknown'} (YAML format)`);
      } else if (hasEmbeddingJson) {
        // Fallback to JSON format
        embeddingData = require(embeddingJsonPath);
        console.log(`📊 Embedding Dimensions: ${embeddingData.embedding?.length || 'unknown'} (JSON format)`);
      }
    } catch (error) {
      console.log('📊 Embedding Dimensions: Error reading file');
    }
  }
  
  console.log('\n📝 RAW TEXT');
  console.log('='.repeat(60));
  console.log(chunk.text);
  
  console.log('\n🎯 PREPARED FOR EMBEDDING');
  console.log('='.repeat(60));
  console.log(preparedText);
  
  console.log('\n📊 STATS');
  console.log('='.repeat(60));
  console.log(`Raw text: ${chunk.text.length} chars`);
  console.log(`Prepared text: ${preparedText.length} chars`);
  console.log(`Difference: +${preparedText.length - chunk.text.length} chars (heading added)`);
}

main().catch(console.error);
