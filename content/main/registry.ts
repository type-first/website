/**
 * Main Content Registry
 * Central registry for main page content
 */

import { mainOverview } from './overview'
import { sections } from './sections'

export const mainContentRegistry = {
  overview: mainOverview,
  sections: [...sections].sort((a, b) => a.order - b.order)
} as const

export type { MainSectionMeta, MainOverviewMeta } from '@/lib/content/main.model'