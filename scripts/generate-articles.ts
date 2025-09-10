#!/usr/bin/env tsx

/**
 * Script to generate module-based article pages from YAML fixtures
 */

import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';

const ARTICLES_DIR = 'app/articles';
const FIXTURES_DIR = 'lib/db/fixtures';

interface Article {
  title: string;
  slug: string;
  description: string;
  status: string;
  publishedAt: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  content: any[];
}

// Tag mapping to ensure consistency
const TAG_MAPPING: Record<string, string> = {
  'nextjs': 'ARTICLE_TAGS.NEXTJS',
  'react': 'ARTICLE_TAGS.REACT', 
  'tutorial': 'ARTICLE_TAGS.TUTORIAL',
  'typescript': 'ARTICLE_TAGS.TYPESCRIPT',
  'web-development': 'ARTICLE_TAGS.WEB_DEVELOPMENT',
  'tooling': 'ARTICLE_TAGS.TOOLING',
  'types': 'ARTICLE_TAGS.TYPESCRIPT',
  'best-practices': 'ARTICLE_TAGS.GUIDE',
  'ai': 'ARTICLE_TAGS.AI',
  'rag': 'ARTICLE_TAGS.AI', 
  'postgres': 'ARTICLE_TAGS.DATABASE',
  'pgvector': 'ARTICLE_TAGS.DATABASE',
  'server-actions': 'ARTICLE_TAGS.NEXTJS',
  'streaming': 'ARTICLE_TAGS.NEXTJS',
  'validation': 'ARTICLE_TAGS.TYPESCRIPT',
  'knowledge-management': 'ARTICLE_TAGS.AI',
  'recommendations': 'ARTICLE_TAGS.AI',
  'hybrid-retrieval': 'ARTICLE_TAGS.AI',
  'guide': 'ARTICLE_TAGS.GUIDE',
  'architecture': 'ARTICLE_TAGS.ARCHITECTURE'
};

function generatePageContent(article: Article): string {
  const mappedTags = article.tags.map(tag => TAG_MAPPING[tag] || `"${tag}"`).join(', ');
  
  // Convert content sections to JSX
  let contentJSX = '';
  let hasInteractiveComponent = false;
  
  for (const section of article.content) {
    if (section.type === 'text') {
      // Convert markdown-style content to JSX
      const lines = section.content.split('\n').filter((line: string) => line.trim());
      for (const line of lines) {
        if (line.startsWith('# ')) {
          // Skip main heading as it's already in the header
          continue;
        } else if (line.startsWith('## ')) {
          const heading = line.replace('## ', '');
          contentJSX += `          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">${heading}</h2>\n\n`;
        } else if (line.startsWith('### ')) {
          const heading = line.replace('### ', '');
          contentJSX += `          <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">${heading}</h3>\n\n`;
        } else if (line.startsWith('- ')) {
          // Handle list items - collect consecutive items
          const listItems = [];
          let currentLine = line;
          let lineIndex = lines.indexOf(line);
          
          while (currentLine && currentLine.startsWith('- ')) {
            const item = currentLine.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong className="text-gray-900">$1</strong>');
            listItems.push(item);
            lineIndex++;
            currentLine = lines[lineIndex];
          }
          
          contentJSX += `          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700 ml-4">\n`;
          for (const item of listItems) {
            contentJSX += `            <li>${item}</li>\n`;
          }
          contentJSX += `          </ul>\n\n`;
          
          // Skip processed lines
          for (let i = 0; i < listItems.length - 1; i++) {
            lines.splice(lines.indexOf(line) + 1, 1);
          }
        } else if (line.trim()) {
          // Regular paragraph
          const paragraph = line.replace(/\*\*(.*?)\*\*/g, '<strong className="text-gray-900">$1</strong>');
          contentJSX += `          <p className="text-gray-700 leading-relaxed mb-6">\n            ${paragraph}\n          </p>\n\n`;
        }
      }
    } else if (section.type === 'code') {
      contentJSX += `          <CodeBlock\n            language="${section.language}"\n            code={\`${section.content.trim()}\`}\n          />\n\n`;
    } else if (section.type === 'island' && section.component === 'Counter') {
      hasInteractiveComponent = true;
      contentJSX += `          <ComparisonCounter \n            initialValue={42} \n            label="Interactive Demo" \n          />\n\n`;
    }
  }

  return `import Link from "next/link";
import { ARTICLE_TAGS } from "@/lib/article-compiler/tags";
import { CodeBlock } from "@/components/CodeBlock";${hasInteractiveComponent ? '\nimport ComparisonCounter from "@/components/ComparisonCounter";' : ''}

export const articleMetadata = {
  title: "${article.title}",
  description: "${article.description}",
  tags: [${mappedTags}],
  publishedAt: new Date("${article.publishedAt}"),
  updatedAt: new Date("${article.publishedAt}"),
  seoTitle: "${article.seoTitle || article.title}",
  seoDescription: "${article.seoDescription || article.description}",
  author: "Your Name",
  coverImage: "/images/covers/${article.slug}.png",
};

export async function generateMetadata() {
  return {
    title: \`\${articleMetadata.seoTitle || articleMetadata.title} | Our Blog\`,
    description: articleMetadata.seoDescription || articleMetadata.description,
    openGraph: {
      title: articleMetadata.seoTitle || articleMetadata.title,
      description: articleMetadata.seoDescription || articleMetadata.description,
      type: 'article',
      publishedTime: articleMetadata.publishedAt?.toISOString(),
      modifiedTime: articleMetadata.updatedAt?.toISOString(),
      tags: articleMetadata.tags,
      images: articleMetadata.coverImage ? [articleMetadata.coverImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: articleMetadata.seoTitle || articleMetadata.title,
      description: articleMetadata.seoDescription || articleMetadata.description,
      images: articleMetadata.coverImage ? [articleMetadata.coverImage] : [],
    },
  };
}

export default function ${article.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: articleMetadata.title,
    description: articleMetadata.description,
    image: articleMetadata.coverImage,
    datePublished: articleMetadata.publishedAt?.toISOString(),
    dateModified: articleMetadata.updatedAt?.toISOString(),
    author: {
      '@type': 'Person',
      name: articleMetadata.author || 'Unknown Author',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Our Blog',
      logo: {
        '@type': 'ImageObject',
        url: 'https://yoursite.com/logo.png',
      },
    },
    keywords: articleMetadata.tags.join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <article className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-12">
          <nav className="mb-6">
            <Link 
              href="/articles"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ← Back to articles
            </Link>
          </nav>

          {articleMetadata.coverImage && (
            <div className="w-full bg-gray-100 rounded-lg overflow-hidden mb-8" style={{ aspectRatio: '2.7/1' }}>
              <img 
                src={articleMetadata.coverImage}
                alt={articleMetadata.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {articleMetadata.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={\`/articles?tag=\${encodeURIComponent(tag)}\`}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {articleMetadata.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              {articleMetadata.description}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <time dateTime={articleMetadata.publishedAt.toISOString()}>
                Published {articleMetadata.publishedAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              
              {articleMetadata.updatedAt && articleMetadata.updatedAt > articleMetadata.publishedAt && (
                <span>
                  • Updated {articleMetadata.updatedAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>
          </div>
        </header>

        <div className="mb-12">
${contentJSX}        </div>

        <footer className="border-t border-gray-200 pt-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-sm text-gray-500">Tags:</span>
            {articleMetadata.tags.map((tag: string) => (
              <Link
                key={tag}
                href={\`/articles?tag=\${encodeURIComponent(tag)}\`}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              href="/articles"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Read more articles
            </Link>
          </div>
        </footer>
      </article>
    </>
  );
}`;
}

function main() {
  const yamlFiles = ['articles.yaml', 'more-articles.yaml'];
  
  for (const file of yamlFiles) {
    const content = readFileSync(join(FIXTURES_DIR, file), 'utf-8');
    const articles: Article[] = yaml.load(content) as Article[];
    
    for (const article of articles) {
      if (article.status !== 'published') continue;
      
      // Skip if already exists (like module-based-approach)
      const articleDir = join(ARTICLES_DIR, article.slug);
      try {
        // Check if directory exists by trying to read it
        require('fs').accessSync(articleDir);
        console.log(`Skipping ${article.slug} - already exists`);
        continue;
      } catch {
        // Directory doesn't exist, proceed
      }
      
      console.log(`Generating ${article.slug}...`);
      
      // Create directory
      mkdirSync(articleDir, { recursive: true });
      
      // Generate page content
      const pageContent = generatePageContent(article);
      
      // Write page file
      writeFileSync(join(articleDir, 'page.tsx'), pageContent);
    }
  }
  
  console.log('✅ All article pages generated!');
}

main();
