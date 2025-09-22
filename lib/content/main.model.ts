/**
 * Main Content Model
 * Types and constructors for main page content sections
 */

export type MainSectionMeta = {
  type: 'main-section'
  slug: string
  name: string
  blurb: string
  description: string
  tags: readonly string[]
  order: number
  iconName?: string
  href?: string
  imageUrl?: string
  features?: readonly string[]
}

export type MainOverviewMeta = {
  type: 'main-overview'
  slug: string
  title: string
  subtitle: string
  description: string
  heroImageUrl?: string
  callToAction?: {
    text: string
    href: string
  }
}

export const createMainSection = (data: {
  slug: string
  name: string
  blurb: string
  description: string
  tags: readonly string[]
  order: number
  iconName?: string
  href?: string
  imageUrl?: string
  features?: readonly string[]
}): MainSectionMeta => ({
  type: 'main-section',
  ...data,
})

export const createMainOverview = (data: {
  slug: string
  title: string
  subtitle: string
  description: string
  heroImageUrl?: string
  callToAction?: {
    text: string
    href: string
  }
}): MainOverviewMeta => ({
  type: 'main-overview',
  ...data,
})