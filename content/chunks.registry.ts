/**
 * Search Chunks Registry
 * Flat list of all content chunks for search functionality
 */

import { chunks as advancedTypescriptChunks } from './articles/advanced-typescript-patterns-react';
import { chunks as searchTestLabChunks } from './labs/search-test/chunks';
import { chunks as typeExplorerLabChunks } from './labs/type-explorer/chunks';
import { chunks as basicTypesAndFunctionsScenarioChunks } from './scenarios/basic-types-and-functions';
import type { ContentChunk } from '@/lib/content/content.model';

export const searchChunksRegistry = [
  ...advancedTypescriptChunks,
  ...searchTestLabChunks,
  ...typeExplorerLabChunks,
  ...basicTypesAndFunctionsScenarioChunks,
  // Add more content chunks here as they are created
] as const satisfies readonly ContentChunk<any>[];
