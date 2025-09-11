/**
 * Labs Registry
 * Central registry for all experimental labs and demos
 */

import React from 'react';

export interface LabRegistryEntry {
  slug: string;
  title: string;
  description: string;
  Icon?: React.FC;
  status?: 'active' | 'experimental' | 'archived';
  tags?: string[];
  addedAt?: Date;
}

function TypeExplorerIcon() {
  return (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
      <defs>
        <linearGradient id="tx" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#1d4ed8"/>
          <stop offset="100%" stopColor="#0ea5a4"/>
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="36" height="36" rx="8" fill="#f1f5f9" />
      <path d="M17 16h14" stroke="url(#tx)" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M17 24h14" stroke="#334155" strokeWidth="2" strokeLinecap="round" opacity=".6"/>
      <path d="M17 32h9" stroke="#334155" strokeWidth="2" strokeLinecap="round" opacity=".4"/>
      <path d="M10 18c0-3 2-5 5-5" stroke="#94a3b8" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M38 30c0 3-2 5-5 5" stroke="#94a3b8" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <text x="24" y="28" textAnchor="middle" fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" fontSize="9" fontWeight="700" fill="url(#tx)">TS</text>
      <path d="M20 22h8" stroke="url(#tx)" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  );
}

function SearchTestIcon() {
  return (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
      <defs>
        <linearGradient id="search" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed"/>
          <stop offset="100%" stopColor="#06b6d4"/>
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="36" height="36" rx="8" fill="#f8fafc" />
      <circle cx="20" cy="20" r="8" stroke="url(#search)" strokeWidth="2.5" fill="none"/>
      <path d="m26 26 6 6" stroke="url(#search)" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M16 20h8" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" opacity=".6"/>
      <path d="M20 16v8" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" opacity=".6"/>
      <circle cx="32" cy="32" r="2" fill="url(#search)" opacity=".8"/>
    </svg>
  );
}

export const labsRegistry: LabRegistryEntry[] = [
  {
    slug: 'type-explorer',
    title: 'Type Explorer',
    description: 'TypeScript editor with autocomplete, types and diagnostics.',
    Icon: TypeExplorerIcon,
    status: 'active',
    tags: ['typescript', 'editor', 'playground'],
    addedAt: new Date('2024-08-01'),
  },
  {
    slug: 'search-test',
    title: 'Search Testing',
    description: 'Test and compare text vs vector search functionality.',
    Icon: SearchTestIcon,
    status: 'active',
    tags: ['search', 'nlp', 'vector'],
    addedAt: new Date('2024-08-10'),
  },
];

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

