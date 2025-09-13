#!/usr/bin/env node

/**
 * YML Test Runner
 * Simple script to test YML modality functionality
 */

// Import the examples
const { runAllYMLExamples } = require('./yml-examples');

console.log('Testing YML Modality Implementation...\n');

try {
  runAllYMLExamples();
  console.log('\n✅ YML examples completed successfully!');
} catch (error) {
  console.error('\n❌ Error running YML examples:', error);
  process.exit(1);
}
