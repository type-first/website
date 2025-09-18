/**
 * Basic Types and Functions Scenario - Content Definition
 * A beginner-friendly scenario introducing TypeScript fundamentals
 */

import { createScenario } from '@/lib/content/scenario.model';

export const basicTypesAndFunctionsScenario = createScenario({
  slug: 'basic-types-and-functions',
  name: 'Basic Types and Functions',
  blurb: 'Learn TypeScript fundamentals through hands-on practice with basic types, interfaces, and function definitions in a multi-file project structure.',
  tags: ['TypeScript', 'Beginner', 'Types', 'Functions', 'Interfaces', 'Fundamentals'] as const,
  difficulty: 'beginner',
  prerequisites: ['Basic JavaScript knowledge', 'Understanding of ES6 modules'] as const,
  learningGoals: [
    'Define and use TypeScript interfaces and types',
    'Create type-safe functions with proper parameter and return types',
    'Work with TypeScript modules and imports/exports',
    'Understand basic type inference and annotation',
    'Practice with string manipulation and utility functions'
  ] as const
});