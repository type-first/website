import Link from 'next/link';
import { getAllArticles, ArticleWithSlug } from '@/lib/articles/registry';
import { COVER_IMAGE, GRID, SPACING } from '@/lib/design-constants';

export default async function Home() {
  let articles: ArticleWithSlug[] = [];
  
  try {
    // Get the latest 6 articles from the module registry
    const allArticles = await getAllArticles();
    articles = allArticles.slice(0, 6);
  } catch (error) {
    console.warn('Failed to load articles from registry:', 
      error instanceof Error ? error.message : String(error));
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Our Blog
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover insights, tutorials, and interactive content built with modern web technologies.
        </p>
      </header>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Latest Articles</h2>
          <Link 
            href="/articles"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View all articles →
          </Link>
        </div>

        {articles.length > 0 ? (
          <div className={`grid ${GRID.ARTICLES.FULL} ${SPACING.CARD_GAP}`}>
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles published yet.</p>
            <p className="text-gray-400 mt-2">Check back soon for new content!</p>
          </div>
        )}
      </section>

      <section className="bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Built with Modern Technology
        </h3>
        <p className="text-gray-600 mb-6">
          This site showcases state-of-the-art Next.js features including App Router, 
          Server Components, and interactive islands architecture.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Next.js 15</span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Server Components</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Islands Architecture</span>
          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">TypeScript</span>
        </div>
      </section>
    </div>
  );
}

function ArticleCard({ article }: { article: ArticleWithSlug }) {
  return (
    <article className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {article.coverImage && (
        <div className={`${COVER_IMAGE.ASPECT_CLASS} bg-gray-100`}>
          <img 
            src={article.coverImage} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {article.tags.slice(0, 2).map((tag: string) => (
            <span 
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          <Link 
            href={`/articles/${article.slug}`}
            className="hover:text-blue-600 transition-colors"
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
          {article.publishedAt && article.publishedAt.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      </div>
    </article>
  );
}
