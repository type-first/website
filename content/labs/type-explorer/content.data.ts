import { type LabContentData } from '@/lib/labs/metadata.logic';

export const typeExplorerLabData: LabContentData = {
  slug: 'type-explorer',
  title: 'Type Explorer',
  description: 'TypeScript editor with autocomplete, types and diagnostics.',
  status: 'active',
  tags: ['typescript', 'editor', 'playground'],
  addedAt: new Date('2024-08-01'),
  author: 'TypeFirst Team',
  seoTitle: 'Type Explorer - Interactive TypeScript Playground',
  seoDescription: 'Explore TypeScript features with our interactive editor featuring real-time type checking, autocomplete, and multi-file support.',
  coverImage: '/images/labs/type-explorer-cover.png',
};
