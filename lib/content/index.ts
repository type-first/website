/**
 * Main content system exports
 * Clean API surface for the unified content system
 */

// --- core models
export * from './content.model'
export * from './text.model'

// --- specific content models (explicit exports to avoid conflicts)
export { 
  createArticle,
  createArticleChunk,
  isArticleChunk,
  getArticleAuthor,
  getArticlePublishedDate,
  formatPublishedDate,
} from './article.model'

export {
  createContributor,
  createContributorChunk,
  isContributorChunk,
  getContributorProfileImage,
  getContributorExpertise,
} from './contributor.model'

export {
  createLab,
  createLabChunk,
  isLabChunk,
  getLabIcon,
  getLabFeatures,
} from './lab.model'

// --- utilities
export * from './embeddings'
export * from './search'
export * from './html-utils'
