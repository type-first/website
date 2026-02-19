/**
 * Documentation Registry Logic
 * Business logic functions for working with the documentation registry
 */

import { docsMetaRegistry } from '@/content/docs/meta.registry';
import type { DocLibraryMeta } from '@/lib/content/doc.model';

export interface ListDocLibrariesOptions {
  limit?: number;
  offset?: number;
  tags?: string[];
}

export function listDocLibraries(options: ListDocLibrariesOptions = {}) {
  const { limit, offset = 0, tags } = options;

  let filtered = docsMetaRegistry.slice() as DocLibraryMeta[];

  if (tags && tags.length) {
    filtered = filtered.filter((lib) => lib.tags?.some((t: string) => tags.includes(t)));
  }

  // Sort alphabetically by name
  filtered.sort((a, b) => a.name.localeCompare(b.name));

  const total = filtered.length;
  if (limit !== undefined) {
    filtered = filtered.slice(offset, offset + limit);
  }

  return { libraries: filtered, total };
}

export function getDocLibraryBySlug(slug: string): DocLibraryMeta | undefined {
  return (docsMetaRegistry as readonly DocLibraryMeta[]).find((lib) => lib.slug === slug);
}