import { Suspense } from 'react';
import Link from 'next/link';
import { listArticles } from '@/lib/db/articles';
import { ArticleMetadata } from '@/lib/schemas/article';

interface ArticlesPageProps {
  searchParams: Promise<{ page?: string; tag?: string }>;
}

export async function generateMetadata() {
  return {
    title: 'Articles | Our Blog',
    description: 'Browse all published articles and tutorials',
  };
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  const selectedTag = params.tag;
  const pageSize = 12;

  let articles: ArticleMetadata[] = [];
  let total = 0;

  try {
    const result = await listArticles({
      status: 'published',
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      tags: selectedTag ? [selectedTag] : undefined,
    });
    articles = result.articles;
    total = result.total;
  } catch (error) {
    // Database not available, show empty state
    console.warn('Database not available on articles page:', 
      error instanceof Error ? error.message : String(error));
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          All Articles
        </h1>
        <p className="text-xl text-gray-600">
          {selectedTag 
            ? `Articles tagged with "${selectedTag}" (${total} articles)`
            : `Browse all ${total} published articles`
          }
        </p>
        
        {selectedTag && (
          <div className="mt-4">
            <Link 
              href="/articles"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ← Clear filter
            </Link>
          </div>
        )}
      </header>

      <Suspense fallback={<ArticleGridSkeleton />}>
        <ArticleGrid articles={articles} />
      </Suspense>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          selectedTag={selectedTag}
        />
      )}
    </div>
  );
}

function ArticleGrid({ articles }: { articles: ArticleMetadata[] }) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No articles found.</p>
        <p className="text-gray-400 mt-2">Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

function ArticleCard({ article }: { article: ArticleMetadata }) {
  return (
    <article className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {article.coverImage && (
        <div className="aspect-video bg-gray-100">
          <img 
            src={article.coverImage} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {article.tags.slice(0, 3).map((tag: string) => (
            <Link
              key={tag}
              href={`/articles?tag=${encodeURIComponent(tag)}`}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          <Link 
            href={`/articles/${article.slug}`}
            className="hover:text-blue-600 transition-colors line-clamp-2"
          >
            {article.title}
          </Link>
        </h3>
        
        {article.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {article.description}
          </p>
        )}
        
        <div className="text-xs text-gray-500">
          {article.publishedAt && new Date(article.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      </div>
    </article>
  );
}

function Pagination({ 
  currentPage, 
  totalPages, 
  selectedTag 
}: { 
  currentPage: number; 
  totalPages: number; 
  selectedTag?: string; 
}) {
  const getPageUrl = (page: number) => {
    const baseUrl = '/articles';
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (selectedTag) params.set('tag', selectedTag);
    return `${baseUrl}${params.toString() ? `?${params.toString()}` : ''}`;
  };

  return (
    <nav className="flex justify-center">
      <div className="flex space-x-2">
        {currentPage > 1 && (
          <Link
            href={getPageUrl(currentPage - 1)}
            className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Previous
          </Link>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          const isActive = page === currentPage;
          return (
            <Link
              key={page}
              href={getPageUrl(page)}
              className={`px-4 py-2 text-sm border rounded-md ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'text-gray-600 bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </Link>
          );
        })}

        {currentPage < totalPages && (
          <Link
            href={getPageUrl(currentPage + 1)}
            className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Next
          </Link>
        )}
      </div>
    </nav>
  );
}

function ArticleGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="aspect-video bg-gray-200 animate-pulse" />
          <div className="p-6">
            <div className="flex gap-2 mb-3">
              <div className="h-5 bg-gray-200 rounded-full w-16 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded-full w-20 animate-pulse" />
            </div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
