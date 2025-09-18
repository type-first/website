/**
 * Scenarios Registry
 * Central registry for all TypeScript learning scenarios
 */

import { basicTypesAndFunctionsScenario } from './basic-types-and-functions/meta';
import type { ScenarioMeta } from '@/lib/content/scenario.model';

export const scenariosRegistry = [
  basicTypesAndFunctionsScenario,
] as const satisfies readonly ScenarioMeta[];