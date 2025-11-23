/**
 * Typescape Registry
 * Central registry for all TypeScript learning typescapes with example file backing
 */

import { typistIntroScenario } from './typist-intro/meta';
import { typistTupleManipulationScenario } from './typist-tuple-manipulation/meta';
import type { ScenarioMeta } from '@/lib/content/scenario.model';

// Note: Some typescapes use different meta formats and need to be converted
// These will be updated to use the proper createScenario format

export const typescapeRegistry = [
  // Example-based typescapes (backed by tmp/examples/)
  typistIntroScenario,                    // tmp/examples/intro.ts
  typistTupleManipulationScenario,        // tmp/examples/tuple.ts
  
  // TODO: Convert these to proper createScenario format:
  // typistRegistryPatternsMeta,          // tmp/examples/registry.ts
  // typistEnumGuardsMeta,                // tmp/examples/enum.ts  
  // typistGetOperationsMeta,             // tmp/examples/get.ts
  // typistOmitUtilitiesMeta,             // tmp/examples/omit.ts
] as const satisfies readonly ScenarioMeta[];