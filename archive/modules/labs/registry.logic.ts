/**
 * Labs Registry Logic
 * Business logic functions for working with the labs registry
 */

import { labsRegistry as _labsRegistry } from '@/content/labs/registry';
import type { LabMeta } from '@/lib/content/lab.model';

// Re-export registry for components that need direct access
export const labsRegistry = _labsRegistry;

export type LabRegistryEntry = LabMeta;

// Legacy interface for backward compatibility with existing components
export interface LegacyLabData {
  slug: string;
  title: string;
  description: string;
  status: 'active' | 'experimental' | 'archived';
  tags: string[];
  iconName?: string;
}

// Convert LabMeta to legacy format for existing components
function adaptLabMeta(lab: LabMeta): LegacyLabData {
  return {
    slug: lab.slug,
    title: lab.name,
    description: lab.blurb,
    status: 'active', // Default status for new format
    tags: [...lab.tags], // Convert readonly to mutable array
    iconName: lab.iconUrl.replace('/icons/', '').replace('.svg', ''), // Extract icon name from URL
  };
}

export interface ListLabsOptions {
  limit?: number;
  offset?: number;
  tags?: string[];
}

export function listLabs(options: ListLabsOptions = {}) {
  const { limit, offset = 0, tags } = options;

  let filtered = labsRegistry.slice();

  if (tags && tags.length) {
    filtered = filtered.filter((l) => l.tags?.some((t: string) => tags.includes(t)));
  }

  // Sort alphabetically by name
  filtered.sort((a, b) => a.name.localeCompare(b.name));

  const total = filtered.length;
  if (limit !== undefined) {
    filtered = filtered.slice(offset, offset + limit);
  }

  // Convert to legacy format for existing components
  const adaptedLabs = filtered.map(adaptLabMeta);

  return { labs: adaptedLabs, total };
}

export function getLabBySlug(slug: string) {
  const lab = labsRegistry.find((l) => l.slug === slug);
  return lab ? adaptLabMeta(lab) : undefined;
}