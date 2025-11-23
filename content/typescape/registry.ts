/**
 * Typescape Registry
 * Central registry for all TypeScript learning typescapes with example file backing
 */

import { typistIntroScenario } from './typist-intro/meta';
import { typistTupleManipulationScenario } from './typist-tuple-manipulation/meta';
import { typistEnumGuardsScenario } from './typist-enum-guards/meta';
import { typistGetOperationsScenario } from './typist-get-operations/meta';
import { typistOmitUtilitiesScenario } from './typist-omit-utilities/meta';
import { typistRegistryPatternsScenario } from './typist-registry-patterns/meta';
import type { ScenarioMeta } from '@/lib/content/scenario.model';

export const typescapeRegistry = [
  // Example-based typescapes (backed by tmp/examples/)
  typistIntroScenario,                    // tmp/examples/intro.ts
  typistTupleManipulationScenario,        // tmp/examples/tuple.ts
  typistEnumGuardsScenario,               // tmp/examples/enum.ts
  typistGetOperationsScenario,            // tmp/examples/get.ts
  typistOmitUtilitiesScenario,            // tmp/examples/omit.ts
  typistRegistryPatternsScenario,         // tmp/examples/registry.ts
] as const satisfies readonly ScenarioMeta[];