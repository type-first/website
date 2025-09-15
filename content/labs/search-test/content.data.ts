import { type LabContentData } from '@/lib/labs/metadata.logic';

export const searchTestLabData: LabContentData = {
  slug: 'search-test',
  title: 'Search Testing',
  description: 'Test and compare text vs vector search functionality.',
  status: 'active',
  tags: ['search', 'nlp', 'vector'],
  addedAt: new Date('2024-08-10'),
  author: 'TypeFirst Team',
  seoTitle: 'Search Testing Lab - Compare Text vs Vector Search',
  seoDescription: 'Compare different search methods including full-text search, vector similarity, and hybrid approaches in our interactive testing environment.',
  coverImage: '/images/labs/search-test-cover.png',
};
