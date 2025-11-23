/**
 * Typist Get Operations Scenario - Meta Definition
 * Path-based object property access with full type safety and compile-time path validation
 */

import { createScenario } from '@/lib/content/scenario.model';

export const typistGetOperationsScenario = createScenario({
  slug: 'typist-get-operations',
  name: 'Typist: Path-Based Property Access',
  blurb: 'Build type-safe object property accessors with compile-time path validation and runtime safeguards for deep object traversal.',
  tags: ['Typist', 'TypeScript', 'Property Access', 'Path Validation', 'Utility Types', 'Advanced'] as const,
  difficulty: 'advanced',
  prerequisites: ['Template literal types', 'Conditional types', 'Mapped types', 'Type recursion patterns'] as const,
  learningGoals: [
    'Build compile-time validated path access utilities',
    'Master template literal types for path construction',
    'Create recursive type utilities for deep object traversal', 
    'Implement safe property access with graceful fallbacks',
    'Design flexible APIs with strong type inference'
  ] as const,
  introduction: `Create powerful property access utilities that validate object paths at compile time while providing runtime safety. This scenario demonstrates building a sophisticated \`get\` function that uses TypeScript's template literal types to validate property paths, ensuring you can only access properties that actually exist. You'll learn advanced type programming techniques including recursive conditional types, path parsing, and type inference patterns that make complex object traversal both safe and ergonomic.`
});