import { type LabContentData } from '@/modules/labs/metadata.logic';

// Lab content text sections
export const labDescription = `
The Search Test Lab provides an interactive interface for exploring and comparing 
different search methodologies including full-text search and semantic vector search. 
Test real queries, analyze results, and understand how different search algorithms 
rank and retrieve content based on relevance and similarity metrics.
`;

export const labFeatures = [
  'Full-Text Search: Test traditional keyword-based search with relevance scoring',
  'Vector Search: Explore semantic search using embeddings and similarity matching',
  'Real-Time Comparison: Compare results side-by-side with performance metrics',
  'Query Analysis: Understand how queries are processed and matched',
  'Interactive Interface: Live search testing with immediate feedback'
];

export const learningObjectives = [
  'Understand the differences between text and vector search approaches',
  'Learn how search relevance scoring affects result ranking',
  'Explore semantic similarity concepts in vector search',
  'Practice query optimization techniques for better results',
  'Analyze search performance and accuracy metrics'
];

export const searchTestLabData: LabContentData = {
  slug: 'search-test',
  title: 'Search Test Lab',
  description: 'Interactive testing interface for exploring text search and vector search capabilities with real-time results comparison.',
  status: 'active',
  tags: ['search', 'vector', 'testing', 'interactive', 'text-search', 'semantic-search'],
  addedAt: new Date('2024-09-15'),
  author: 'Santiago Elustondo',
  seoTitle: 'Search Test Lab - Interactive Search Testing Interface',
  seoDescription: 'Test and compare different search methods including full-text search and semantic vector search with live query processing and performance analysis.',
  coverImage: '/images/labs/search-test-cover.png',
  iconName: 'search',
};
