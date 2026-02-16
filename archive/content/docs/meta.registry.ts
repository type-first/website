/**
 * Documentation Libraries Meta Registry
 * Central registry containing only documentation library metadata for efficient loading
 */

// Import doc libraries as they're created
// import { library as gettingStartedLibrary } from './getting-started/meta';
import { library as typistLibrary } from './typist/meta';

import type { DocLibraryMeta } from '@/lib/content/doc.model';

export const docsMetaRegistry = [
  // gettingStartedLibrary,
  typistLibrary,
] as const satisfies readonly DocLibraryMeta[];