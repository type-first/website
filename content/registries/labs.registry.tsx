/**
 * Labs Registry
 * Central registry for all experimental labs and demos
 */

import React from 'react';
import { Braces, Microscope } from 'lucide-react';
import { labsContentRegistry, type LabContentData } from '@/content/registries/labs.content.registry';

export interface LabRegistryEntry extends LabContentData {
  Icon?: React.FC;
}

function TypeExplorerIcon() {
  return (
    <Braces
      className="h-10 w-10 text-gray-700 group-hover:text-blue-700 transition-colors"
      strokeWidth={1.8}
      aria-hidden="true"
    />
  );
}

function SearchTestIcon() {
  return (
    <Microscope
      className="h-10 w-10 text-gray-700 group-hover:text-blue-700 transition-colors"
      strokeWidth={1.8}
      aria-hidden="true"
    />
  );
}

// Map content data to registry entries with icons
export const labsRegistry: LabRegistryEntry[] = labsContentRegistry.map((lab) => {
  const iconMap: Record<string, React.FC> = {
    'type-explorer': TypeExplorerIcon,
    'search-test': SearchTestIcon,
  };

  return {
    ...lab,
    Icon: iconMap[lab.slug],
  };
});

export interface ListLabsOptions {
  limit?: number;
  offset?: number;
  status?: 'active' | 'experimental' | 'archived';
  tags?: string[];
}

export function listLabs(options: ListLabsOptions = {}) {
  const { limit, offset = 0, status, tags } = options;

  let filtered = labsRegistry.slice();

  if (status) {
    filtered = filtered.filter((l) => (l.status ?? 'active') === status);
  }

  if (tags && tags.length) {
    filtered = filtered.filter((l) => l.tags?.some((t) => tags.includes(t)));
  }

  // Sort by added date desc if available, otherwise by title
  filtered.sort((a, b) => {
    const at = a.addedAt?.getTime?.() ?? 0;
    const bt = b.addedAt?.getTime?.() ?? 0;
    if (at !== bt) return bt - at;
    return a.title.localeCompare(b.title);
  });

  const total = filtered.length;
  if (limit !== undefined) {
    filtered = filtered.slice(offset, offset + limit);
  }

  return { labs: filtered, total };
}

export function getLabBySlug(slug: string) {
  return labsRegistry.find((l) => l.slug === slug);
}
