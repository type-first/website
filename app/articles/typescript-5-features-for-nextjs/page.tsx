import Link from "next/link";
import { ARTICLE_TAGS } from "@/lib/article-compiler/tags";
import { CodeBlock } from "@/components/CodeBlock";

export const articleMetadata = {
  title: "TypeScript 5.x Features That Matter for Next.js",
  description: "A practical tour of TypeScript 5.x features that streamline large Next.js codebases.",
  tags: [ARTICLE_TAGS.TYPESCRIPT, ARTICLE_TAGS.NEXTJS, ARTICLE_TAGS.TOOLING, ARTICLE_TAGS.TYPESCRIPT, ARTICLE_TAGS.GUIDE],
  publishedAt: new Date("2024-02-10T09:00:00Z"),
  updatedAt: new Date("2024-02-10T09:00:00Z"),
  seoTitle: "TypeScript 5 for Next.js: Practical Features",
  seoDescription: "Learn the TS 5 features that reduce boilerplate, improve DX, and scale Next.js apps.",
  author: "Your Name",
  coverImage: "/images/covers/typescript-5-features-for-nextjs.png",
};

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

export default function Typescript5FeaturesForNextjsPage() {
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
          <p className="text-gray-700 leading-relaxed mb-6">
            TypeScript 5 brings improvements that make Next.js development faster and safer. Let’s cover the features you’ll actually use in production.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Satisfies Operator</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            The `satisfies` operator helps ensure object literals conform to expected types without losing inference.
          </p>

          <CodeBlock
            language="ts"
            code={`type Route = { path: string; title: string };
const routes = {
  home: { path: '/', title: 'Home' },
  articles: { path: '/articles', title: 'Articles' },
} satisfies Record<string, Route>;`}
          />

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Decorators (stable)</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Decorators make server utilities and data models more expressive when used with metadata.
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