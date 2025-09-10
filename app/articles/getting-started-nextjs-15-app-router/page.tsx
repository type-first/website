import Link from "next/link";
import { ARTICLE_TAGS } from "@/lib/article-compiler/tags";
import { CodeBlock } from "@/components/CodeBlock";
import ComparisonCounter from "@/components/ComparisonCounter";

export const articleMetadata = {
  title: "Getting Started with Next.js 15 and App Router",
  description: "Learn how to build modern web applications with Next.js 15's powerful App Router, Server Components, and latest features.",
  tags: [ARTICLE_TAGS.NEXTJS, ARTICLE_TAGS.REACT, ARTICLE_TAGS.TUTORIAL],
  publishedAt: new Date("2024-01-15T10:00:00Z"),
  updatedAt: new Date("2024-01-15T10:00:00Z"),
  seoTitle: "Next.js 15 App Router Guide - Modern Web Development",
  seoDescription: "Complete guide to Next.js 15 App Router with Server Components, routing, and best practices for modern web development.",
  author: "Your Name",
  coverImage: "/images/covers/getting-started-nextjs-15-app-router.png",
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

export default function GettingStartedNextJS15Page() {
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
            Next.js 15 introduces powerful new features that make building modern web applications faster and more efficient than ever. The App Router represents a fundamental shift in how we structure and think about Next.js applications.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">What's New in Next.js 15</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            The latest version brings several exciting improvements:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700 ml-4">
            <li><strong className="text-gray-900">Enhanced App Router:</strong> Better performance and developer experience</li>
            <li><strong className="text-gray-900">Server Components by default:</strong> Improved loading times and SEO</li>
            <li><strong className="text-gray-900">Streaming and Suspense:</strong> Progressive loading for better UX</li>
            <li><strong className="text-gray-900">Improved TypeScript support:</strong> Better type inference and error messages</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Getting Started</h3>

          <p className="text-gray-700 leading-relaxed mb-6">
            Creating a new Next.js 15 project is straightforward:
          </p>

          <CodeBlock
            language="bash"
            code={`# Create a new Next.js 15 project
npx create-next-app@latest my-app --typescript --tailwind --app

# Navigate to the project
cd my-app

# Start the development server
npm run dev`}
          />

          <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Understanding Server Components</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Server Components run on the server and send rendered HTML to the client. This approach offers several benefits:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700 ml-4">
            <li><strong className="text-gray-900">Better Performance:</strong> Reduced JavaScript bundle size</li>
            <li><strong className="text-gray-900">Improved SEO:</strong> Content is rendered on the server</li>
            <li><strong className="text-gray-900">Direct Database Access:</strong> No need for API routes for data fetching</li>
          </ul>

          <p className="text-gray-700 leading-relaxed mb-6">
            Try out this interactive counter component to see client-side interactivity in action:
          </p>

          <ComparisonCounter 
            initialValue={15} 
            label="Next.js Version" 
          />
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
