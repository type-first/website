/**
 * Labs Content Registry
 * Central registry that pulls from structured content data
 */

import { typeExplorerLabData } from '@/content/labs/type-explorer/content.data';
import { searchTestLabData } from '@/content/labs/search-test/content.data';
import { type LabContentData } from '@/lib/labs/metadata.logic';

// Re-export the content data type for external use
export type { LabContentData };

// Central registry of all lab content data
export const labsContentRegistry: LabContentData[] = [
  typeExplorerLabData,
  searchTestLabData,
];

export interface ListLabsOptions {
  limit?: number;
  offset?: number;
  status?: 'active' | 'experimental' | 'archived';
  tags?: string[];
}

export function listLabsContent(options: ListLabsOptions = {}) {
  const { limit, offset = 0, status, tags } = options;

  let filtered = labsContentRegistry.slice();

  if (status) {
    filtered = filtered.filter((l) => l.status === status);
  }

  if (tags && tags.length) {
    filtered = filtered.filter((l) => l.tags.some((t) => tags.includes(t)));
  }

  // Sort by added date desc if available, otherwise by title
  filtered.sort((a, b) => {
    const at = a.addedAt.getTime();
    const bt = b.addedAt.getTime();
    if (at !== bt) return bt - at;
    return a.title.localeCompare(b.title);
  });

  const total = filtered.length;
  if (limit !== undefined) {
    filtered = filtered.slice(offset, offset + limit);
  }

  return { labs: filtered, total };
}

export function getLabContentBySlug(slug: string): LabContentData | undefined {
  return labsContentRegistry.find((l) => l.slug === slug);
}
