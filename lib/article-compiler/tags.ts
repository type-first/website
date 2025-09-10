// Centralized tag definitions
export const ARTICLE_TAGS = {
  // Technology
  TYPESCRIPT: 'typescript',
  JAVASCRIPT: 'javascript',
  REACT: 'react',
  NEXTJS: 'nextjs',
  NODE: 'nodejs',
  
  // Categories
  TUTORIAL: 'tutorial',
  GUIDE: 'guide',
  OPINION: 'opinion',
  ANALYSIS: 'analysis',
  NEWS: 'news',
  
  // Topics
  PERFORMANCE: 'performance',
  SECURITY: 'security',
  ARCHITECTURE: 'architecture',
  DEVELOPMENT: 'development',
  DESIGN: 'design',
  AI: 'ai',
  DATABASE: 'database',
  WEB_DEVELOPMENT: 'web-development',
  TOOLING: 'tooling',
  
  // Difficulty
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;

export type ArticleTag = typeof ARTICLE_TAGS[keyof typeof ARTICLE_TAGS];

// Helper to validate tags
export function validateTags(tags: string[]): ArticleTag[] {
  const validTags = Object.values(ARTICLE_TAGS);
  return tags.filter((tag): tag is ArticleTag => 
    validTags.includes(tag as ArticleTag)
  ) as ArticleTag[];
}

// Tag metadata for display
export const TAG_METADATA: Record<ArticleTag, { label: string; color: string; description?: string }> = {
  // Technology
  [ARTICLE_TAGS.TYPESCRIPT]: { label: 'TypeScript', color: 'blue' },
  [ARTICLE_TAGS.JAVASCRIPT]: { label: 'JavaScript', color: 'yellow' },
  [ARTICLE_TAGS.REACT]: { label: 'React', color: 'cyan' },
  [ARTICLE_TAGS.NEXTJS]: { label: 'Next.js', color: 'gray' },
  [ARTICLE_TAGS.NODE]: { label: 'Node.js', color: 'green' },
  
  // Categories
  [ARTICLE_TAGS.TUTORIAL]: { label: 'Tutorial', color: 'purple' },
  [ARTICLE_TAGS.GUIDE]: { label: 'Guide', color: 'indigo' },
  [ARTICLE_TAGS.OPINION]: { label: 'Opinion', color: 'pink' },
  [ARTICLE_TAGS.ANALYSIS]: { label: 'Analysis', color: 'orange' },
  [ARTICLE_TAGS.NEWS]: { label: 'News', color: 'red' },
  
  // Topics
  [ARTICLE_TAGS.PERFORMANCE]: { label: 'Performance', color: 'emerald' },
  [ARTICLE_TAGS.SECURITY]: { label: 'Security', color: 'red' },
  [ARTICLE_TAGS.ARCHITECTURE]: { label: 'Architecture', color: 'slate' },
  [ARTICLE_TAGS.DEVELOPMENT]: { label: 'Development', color: 'blue' },
  [ARTICLE_TAGS.DESIGN]: { label: 'Design', color: 'rose' },
  [ARTICLE_TAGS.AI]: { label: 'AI', color: 'violet' },
  [ARTICLE_TAGS.DATABASE]: { label: 'Database', color: 'teal' },
  [ARTICLE_TAGS.WEB_DEVELOPMENT]: { label: 'Web Development', color: 'sky' },
  [ARTICLE_TAGS.TOOLING]: { label: 'Tooling', color: 'orange' },
  
  // Difficulty
  [ARTICLE_TAGS.BEGINNER]: { label: 'Beginner', color: 'green' },
  [ARTICLE_TAGS.INTERMEDIATE]: { label: 'Intermediate', color: 'amber' },
  [ARTICLE_TAGS.ADVANCED]: { label: 'Advanced', color: 'red' },
};
