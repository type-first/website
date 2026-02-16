/**
 * Labs Registry
 * Central registry for all experimental labs and demos
 */

import { typeExplorerLab } from './type-explorer/meta';
import { searchTestLab } from './search-test/meta';
import type { LabMeta } from '@/lib/content/lab.model';

export const labsRegistry = [
  typeExplorerLab,
  searchTestLab,
] as const satisfies readonly LabMeta[];
