/**
 * Search Test Lab - Content Definition
 * Interactive search testing interface for text and vector search
 */

import { createLab } from '@/lib/content/lab.model';

export const searchTestLab = createLab({
  slug: 'search-test',
  name: 'Search Test Lab',
  blurb: 'Interactive testing interface for exploring text search and vector search capabilities with real-time results comparison and performance analysis.',
  tags: ['Search', 'Vector', 'Testing', 'Interactive', 'Text Search', 'Semantic Search'] as const,
  iconUrl: '/icons/search-lab.svg'
});
