import Link from 'next/link';
import { ARTICLE_TAGS } from '@/lib/article-compiler/tags';
import ComparisonCounter from './ComparisonCounter';
import { CodeBlock } from './CodeBlock';

// Article metadata - this can be exported and used by compilation tools
export const articleMetadata = {
  title: "Module-Based Articles: A New Approach to Content Management",
  description: "Exploring how treating articles as TypeScript modules provides better type safety, performance, and developer experience compared to traditional CMS approaches.",
  tags: [
    ARTICLE_TAGS.TYPESCRIPT,
    ARTICLE_TAGS.NEXTJS,
    ARTICLE_TAGS.ARCHITECTURE,
    ARTICLE_TAGS.GUIDE,
  ],
  publishedAt: new Date('2024-01-20T10:00:00Z'),
  updatedAt: new Date('2024-01-20T10:00:00Z'),
  seoTitle: "Module-Based Articles - TypeScript Content Management System",
  seoDescription: "Learn how to build a type-safe, flexible content system using TypeScript modules instead of traditional database-driven CMS approaches.",
  author: "Your Name",
  coverImage: "/images/covers/module-based-approach.png",
};

// Generate Next.js metadata
export async function generateMetadata() {
  return {
    title: `${articleMetadata.seoTitle || articleMetadata.title} | Our Blog`,
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

// The article component
export default function ModuleBasedApproachPage() {
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
                  href={`/articles?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {articleMetadata.title}
            </h1>
            
            {articleMetadata.description && (
              <p className="text-xl text-gray-600 mb-6">
                {articleMetadata.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {articleMetadata.publishedAt && (
                <time dateTime={articleMetadata.publishedAt.toISOString()}>
                  Published {articleMetadata.publishedAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}
              
              {articleMetadata.updatedAt && articleMetadata.updatedAt > (articleMetadata.publishedAt || new Date(0)) && (
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
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Problem with Database-Driven Articles</h2>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Traditional content management systems store articles as database documents. 
            While this approach works for simple use cases, it introduces several challenges 
            when building modern, interactive content:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700 ml-4">
            <li><strong className="text-gray-900">Type Safety:</strong> Article content lacks compile-time validation</li>
            <li><strong className="text-gray-900">Component Integration:</strong> Embedding interactive components requires complex serialization</li>
            <li><strong className="text-gray-900">Version Control:</strong> Content changes are harder to track and review</li>
            <li><strong className="text-gray-900">Developer Experience:</strong> No IDE support for content editing</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">A Module-Based Solution</h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            What if we treated articles as TypeScript modules instead? This approach 
            brings several compelling advantages:
          </p>

          <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Type Safety</h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            By defining articles as modules, we get compile-time type checking for 
            all content. Metadata is validated, component props are type-checked.
          </p>

          <CodeBlock
            language="typescript"
            code={`export const metadata = {
  title: "My Article",
  tags: [ARTICLE_TAGS.TYPESCRIPT, ARTICLE_TAGS.NEXTJS],
  publishedAt: new Date('2024-01-20'),
};

export default function MyArticle() {
  return <article>...</article>;
}`}
          />

          <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Direct Component Integration</h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            Interactive components can be imported and used directly, with full 
            TypeScript support:
          </p>

          <ComparisonCounter 
            initialValue={42} 
            label="Database vs Module Articles" 
          />

          <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Simplified Architecture</h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            Each article is just a Next.js page at <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">app/articles/my-article/page.tsx</code>. 
            No complex routing logic, no dynamic imports, no hybrid systems.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">The Compilation Process</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            For search functionality, we can run a compilation step that:
          </p>

          <ol className="list-decimal list-inside space-y-2 mb-6 text-gray-700 ml-4">
            <li>Scans all article modules for metadata</li>
            <li>Extracts searchable content</li>
            <li>Generates embeddings</li>
            <li>Stores compiled data in the database</li>
          </ol>

          <CodeBlock
            language="bash"
            code={`# Compile all articles for search
npm run articles:compile

# This finds all app/articles/*/page.tsx files
# and extracts their metadata and content`}
          />

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Benefits</h2>

          <blockquote className="border-l-4 border-blue-500 pl-6 italic text-gray-700 my-6">
            <p className="text-lg">
              "Simplicity is the ultimate sophistication. The best architecture 
              is the one that solves the problem with the least complexity."
            </p>
          </blockquote>

          <p className="text-gray-700 leading-relaxed mb-6">This approach delivers:</p>

          <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Developer Experience</h3>
          
          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700 ml-4">
            <li>Full IDE support with autocomplete and type checking</li>
            <li>Version control for content changes</li>
            <li>Code review process for article updates</li>
            <li>Standard Next.js routing - no magic</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Performance</h3>
          
          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700 ml-4">
            <li>Static generation by default</li>
            <li>Component-level code splitting</li>
            <li>Optimized images and assets</li>
            <li>Fast builds and deployments</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Flexibility</h3>
          
          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700 ml-4">
            <li>Each article can have its own layout</li>
            <li>Article-specific components and styles</li>
            <li>Easy A/B testing and experiments</li>
            <li>Rich interactive experiences</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Implementation</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Creating a new article is as simple as:
          </p>

          <CodeBlock
            language="bash"
            code={`# 1. Create the directory
mkdir app/articles/my-new-article

# 2. Create the page
echo 'export default function MyArticle() {
  return <article>My content</article>;
}' > app/articles/my-new-article/page.tsx

# 3. It's immediately live at /articles/my-new-article`}
          />

          <p>
            For search indexing, run the compilation step which extracts 
            metadata and content for database storage.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Conclusion</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            By treating articles as standard Next.js pages with exported metadata, 
            we get the benefits of a module-based approach without the complexity 
            of hybrid systems or dynamic routing.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Each article is self-contained, type-safe, and immediately deployable. 
            The compilation step handles search indexing separately, keeping concerns 
            cleanly separated.
          </p>
        </div>

        <footer className="border-t border-gray-200 pt-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-sm text-gray-500">Tags:</span>
            {articleMetadata.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/articles?tag=${encodeURIComponent(tag)}`}
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
}
