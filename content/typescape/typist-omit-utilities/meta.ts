/**
 * Typist Omit Utilities Scenario - Meta Definition
 * Advanced omit patterns, deep key manipulation, and sophisticated object transformation utilities
 */

import { createScenario } from '@/lib/content/scenario.model';

export const typistOmitUtilitiesScenario = createScenario({
  slug: 'typist-omit-utilities',
  name: 'Typist: Advanced Omit & Key Manipulation',
  blurb: 'Master sophisticated object transformation patterns with deep key omission, nested property manipulation, and type-preserving utilities.',
  tags: ['Typist', 'TypeScript', 'Object Transformation', 'Key Manipulation', 'Utility Types', 'Advanced'] as const,
  difficulty: 'advanced',
  prerequisites: ['Mapped types', 'Conditional types', 'Key manipulation', 'Object type patterns'] as const,
  learningGoals: [
    'Build advanced omit utilities beyond built-in Omit<T, K>',
    'Create deep key manipulation for nested objects',
    'Master recursive type patterns for object transformation',
    'Implement flexible key filtering with pattern matching',
    'Design type-preserving object manipulation utilities'
  ] as const,
  introduction: `Go beyond TypeScript's built-in \`Omit\` utility to create sophisticated object transformation patterns. This scenario explores advanced techniques for omitting keys from nested objects, implementing pattern-based key filtering, and building flexible utilities that preserve type relationships while enabling complex object manipulation. You'll learn to handle deep object structures, create recursive omit patterns, and build utilities that work seamlessly with TypeScript's type inference system.`
});