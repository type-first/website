/**
 * Articles Meta Registry
 * Central registry containing only article metadata for efficient loading
 */

import { article as advancedTypescriptPatternsReactMeta } from './advanced-typescript-patterns-react/meta';
import type { ArticleMeta } from '@/lib/content/article.model';

export const articlesMetaRegistry = [
  advancedTypescriptPatternsReactMeta,
] as const satisfies readonly ArticleMeta[];
