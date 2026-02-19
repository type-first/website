/**
 * Documentation-specific content model
 * Types, constructors, and guards for documentation libraries
 */

import type { ContentMeta, ContentChunk, ContributorMeta } from './content.model'
import { chunker } from './content.model'

// --- doc types

export type DocLibraryMeta = ContentMeta<'doc-library'> & {
  author: ContributorMeta
  createdTs: number
  updatedTs: number
  description: string
  coverImgUrl?: string
  logoUrl?: string
  githubUrl?: string
  npmPackage?: string
  version?: string
  pages: DocPageMeta[]
}

export type DocPageMeta = {
  slug: string
  title: string
  description: string
  path: string[] // hierarchical path: ['guides', 'getting-started'] 
  order: number
  parentSlug?: string
  children?: DocPageMeta[]
  tags?: readonly string[]
  updatedTs: number
}

export type DocSectionMeta = {
  id: string
  title: string
  level: number // 1-6 for h1-h6
  anchor: string
  order: number
}

export type DocLibraryChunk = ContentChunk<'doc-library'>

// --- constructors

export const createDocLibrary = (data: {
  slug: string
  name: string
  blurb: string
  description: string
  tags: readonly string[]
  author: ContributorMeta
  createdTs: number
  updatedTs: number
  coverImgUrl?: string
  logoUrl?: string
  githubUrl?: string
  npmPackage?: string
  version?: string
  pages: DocPageMeta[]
}): DocLibraryMeta => ({
  kind: 'doc-library',
  ...data
})

export const createDocPage = (data: {
  slug: string
  title: string
  description: string
  path: string[]
  order: number
  parentSlug?: string
  children?: DocPageMeta[]
  tags?: readonly string[]
  updatedTs: number
}): DocPageMeta => ({
  ...data
})

export const createDocSection = (data: {
  id: string
  title: string
  level: number
  anchor: string
  order: number
}): DocSectionMeta => ({
  ...data
})

export const createDocLibraryChunk = (library: DocLibraryMeta) => chunker(library)

// --- type guards

export const isDocLibrary = (content: ContentMeta<any>): content is DocLibraryMeta => {
  return content.kind === 'doc-library'
}

export const isDocLibraryChunk = (chunk: ContentChunk<any>): chunk is DocLibraryChunk => {
  return chunk.target.kind === 'doc-library'
}

// --- utilities

export const getDocLibraryAuthor = (library: DocLibraryMeta): ContributorMeta => library.author

export const getDocPageBySlug = (library: DocLibraryMeta, slug: string): DocPageMeta | undefined => {
  const findInPages = (pages: DocPageMeta[]): DocPageMeta | undefined => {
    for (const page of pages) {
      if (page.slug === slug) return page
      if (page.children) {
        const found = findInPages(page.children)
        if (found) return found
      }
    }
    return undefined
  }
  return findInPages(library.pages)
}

export const getDocPageByPath = (library: DocLibraryMeta, path: string[]): DocPageMeta | undefined => {
  const findByPath = (pages: DocPageMeta[], targetPath: string[]): DocPageMeta | undefined => {
    if (targetPath.length === 0) return undefined
    
    for (const page of pages) {
      if (arraysEqual(page.path, targetPath)) {
        return page
      }
      if (page.children && targetPath.length > page.path.length && 
          targetPath.slice(0, page.path.length).every((p, i) => p === page.path[i])) {
        const found = findByPath(page.children, targetPath)
        if (found) return found
      }
    }
    return undefined
  }
  return findByPath(library.pages, path)
}

export const buildDocNavigation = (pages: DocPageMeta[]): DocPageMeta[] => {
  // Sort pages by order, then build hierarchical structure
  const sortedPages = [...pages].sort((a, b) => a.order - b.order)
  
  const buildHierarchy = (pages: DocPageMeta[], parentPath: string[] = []): DocPageMeta[] => {
    const result: DocPageMeta[] = []
    
    for (const page of pages) {
      if (page.path.length === parentPath.length + 1 && 
          arraysEqual(page.path.slice(0, parentPath.length), parentPath)) {
        const children = buildHierarchy(pages, page.path)
        result.push({
          ...page,
          children: children.length > 0 ? children : undefined
        })
      }
    }
    
    return result.sort((a, b) => a.order - b.order)
  }
  
  return buildHierarchy(sortedPages)
}

export const getDocBreadcrumbs = (library: DocLibraryMeta, currentPage: DocPageMeta): Array<{name: string, href: string}> => {
  const breadcrumbs = [
    { name: 'Docs', href: '/docs' },
    { name: library.name, href: `/docs/${library.slug}` }
  ]
  
  // Build breadcrumb path from page hierarchy
  for (let i = 0; i < currentPage.path.length; i++) {
    const pathSegment = currentPage.path.slice(0, i + 1)
    const page = getDocPageByPath(library, pathSegment)
    if (page) {
      breadcrumbs.push({
        name: page.title,
        href: `/docs/${library.slug}/${pathSegment.join('/')}`
      })
    }
  }
  
  return breadcrumbs
}

// Helper function for array comparison
function arraysEqual<T>(a: T[], b: T[]): boolean {
  return a.length === b.length && a.every((val, i) => val === b[i])
}