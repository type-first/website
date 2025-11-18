/**
 * Typist Intro Scenario - Meta Definition
 * A comprehensive introduction to typist fundamentals with real-world examples
 */

import { createScenario } from '@/lib/content/scenario.model';

export const typistIntroScenario = createScenario({
  slug: 'typist-intro',
  name: 'Typist: Introduction & Fundamentals',
  blurb: 'Learn typist fundamentals through practical examples. Explore assertions, type relationships, and domain modeling with compile-time validation.',
  tags: ['Typist', 'TypeScript', 'Fundamentals', 'Assertions', 'Domain Modeling', 'Type Safety'] as const,
  difficulty: 'beginner',
  prerequisites: ['Basic TypeScript knowledge', 'Understanding of union and intersection types'] as const,
  learningGoals: [
    'Master basic typist assertions and type checking',
    'Understand the typeof/t_ flexibility pattern',
    'Build type-safe domain models with user hierarchies',
    'Use type guards with compile-time validation',
    'Create feedback systems with exclusive reactions',
    'Practice positive and negative testing patterns'
  ] as const
});