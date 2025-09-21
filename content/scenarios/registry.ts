/**
 * Scenarios Registry
 * Central registry for all TypeScript learning scenarios
 */

import { basicTypesAndFunctionsScenario } from './basic-types-and-functions/meta';
import { typistPhantomTypesBasicsScenario } from './typist-phantom-types-basics/meta';
import { typistTypeComparisonsScenario } from './typist-type-comparisons/meta';
import { typistAdvancedPatternsScenario } from './typist-advanced-patterns/meta';
import type { ScenarioMeta } from '@/lib/content/scenario.model';

export const scenariosRegistry = [
  basicTypesAndFunctionsScenario,
  typistPhantomTypesBasicsScenario,
  typistTypeComparisonsScenario,
  typistAdvancedPatternsScenario,
] as const satisfies readonly ScenarioMeta[];