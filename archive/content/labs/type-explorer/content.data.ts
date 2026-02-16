import { type LabContentData } from '@/modules/labs/metadata.logic';

// Lab content text sections
export const labDescription = `
The Type Explorer Lab is an interactive learning environment for mastering 
TypeScript's advanced type system. Experiment with complex type patterns, 
utility types, and conditional types in a hands-on playground that provides 
real-time feedback and type checking. Perfect for developers looking to 
deepen their understanding of TypeScript's powerful type capabilities.
`;

export const labFeatures = [
  'Interactive Type Editor: Live TypeScript editor with real-time type checking',
  'Advanced Pattern Explorer: Learn complex type patterns and relationships',
  'Utility Type Playground: Experiment with Pick, Omit, Partial, and more',
  'Conditional Type Logic: Master conditional types and type inference',
  'Multi-file Support: Work with complex type definitions across files',
  'Type Visualization: See how types transform and compose together'
];

export const learningObjectives = [
  'Master advanced TypeScript type patterns and techniques',
  'Understand conditional types and type inference mechanisms',
  'Learn to create reusable utility types for complex scenarios',
  'Explore mapped types and template literal types',
  'Practice building type-safe APIs and component interfaces',
  'Develop intuition for TypeScript\'s type system behavior'
];

export const typeExplorerLabData: LabContentData = {
  slug: 'type-explorer',
  title: 'Type Explorer Lab',
  description: 'Interactive TypeScript type system explorer for learning advanced type patterns and complex type relationships.',
  status: 'active',
  tags: ['typescript', 'types', 'interactive', 'learning', 'advanced', 'type-system'],
  addedAt: new Date('2024-09-01'),
  author: 'Jameel Kassam',
  seoTitle: 'Type Explorer Lab - Interactive TypeScript Type Learning',
  seoDescription: 'Explore TypeScript features with our interactive type system explorer featuring advanced type patterns, utility types, and hands-on experimentation.',
  coverImage: '/images/labs/type-explorer-cover.png',
  iconName: 'braces',
};
