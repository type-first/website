import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug, listArticles } from '@/lib/db/articles';
import { ArticleRenderer } from '@/components/ArticleRenderer';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const { articles } = await listArticles({ 
      status: 'published',
      limit: 1000 // Get all published articles for static generation
    });

    return articles.map((article) => ({
      slug: article.slug,
    }));
  } catch (error) {
    // During build time, if database is not available, return empty array
    // This allows the build to complete and pages will be generated on demand
    console.warn('Database not available during build, skipping static generation:', 
      error instanceof Error ? error.message : String(error));
    return [];
  }
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  
  try {
    const article = await getArticleBySlug(slug);
    
    if (article.status !== 'published') {
      return {
        title: 'Article Not Found',
        robots: 'noindex',
      };
    }

    const title = article.seoTitle || article.title;
    const description = article.seoDescription || article.description;
    const canonicalUrl = article.canonicalUrl || `https://yoursite.com/articles/${article.slug}`;

    return {
      title: `${title} | Our Blog`,
      description,
      canonical: canonicalUrl,
      openGraph: {
        title,
        description,
        type: 'article',
        url: canonicalUrl,
        images: article.coverImage ? [article.coverImage] : [],
        publishedTime: article.publishedAt?.toISOString(),
        modifiedTime: article.updatedAt.toISOString(),
        tags: article.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: article.coverImage ? [article.coverImage] : [],
      },
      alternates: {
        canonical: canonicalUrl,
      },
    };
  } catch (error) {
    return {
      title: 'Article Not Found',
      robots: 'noindex',
    };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  
  let article;
  try {
    article = await getArticleBySlug(slug);
  } catch (error) {
    notFound();
  }

  // Only show published articles (or add auth check for drafts)
  if (article.status !== 'published') {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.coverImage,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: 'Author Name', // Replace with actual author data
    },
    publisher: {
      '@type': 'Organization',
      name: 'Our Blog',
      logo: {
        '@type': 'ImageObject',
        url: 'https://yoursite.com/logo.png',
      },
    },
    keywords: article.tags.join(', '),
    url: `https://yoursite.com/articles/${article.slug}`,
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

          {article.coverImage && (
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-8">
              <img 
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag: string) => (
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
              {article.title}
            </h1>
            
            {article.description && (
              <p className="text-xl text-gray-600 mb-6">
                {article.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {article.publishedAt && (
                <time dateTime={article.publishedAt.toISOString()}>
                  Published {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}
              
              {article.updatedAt && article.updatedAt > article.createdAt && (
                <span>
                  • Updated {new Date(article.updatedAt).toLocaleDateString('en-US', {
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
          <ArticleRenderer sections={article.content} />
        </div>

        <footer className="border-t border-gray-200 pt-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-sm text-gray-500">Tags:</span>
            {article.tags.map((tag: string) => (
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
