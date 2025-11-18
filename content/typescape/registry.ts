/**
 * Typescape Registry
 * Central registry for all TypeScript learning typescapes
 */

import { basicTypesAndFunctionsScenario } from './basic-types-and-functions/meta';
import { typistPhantomTypesBasicsScenario } from './typist-phantom-types-basics/meta';
import { typistTypeComparisonsScenario } from './typist-type-comparisons/meta';
import { typistAdvancedPatternsScenario } from './typist-advanced-patterns/meta';
import type { ScenarioMeta } from '@/lib/content/scenario.model';

export const typescapeRegistry = [
  basicTypesAndFunctionsScenario,
  typistPhantomTypesBasicsScenario,
  typistTypeComparisonsScenario,
  typistAdvancedPatternsScenario,
] as const satisfies readonly ScenarioMeta[];