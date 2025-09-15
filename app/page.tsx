import Link from 'next/link';
import { listArticles, type ArticleRegistryEntry } from '@/registries/articles.registry';
import { listLabs, type LabRegistryEntry } from '@/registries/labs.registry';
import { COVER_IMAGE, GRID, SPACING } from '@/modules/design-constants/v0/design-constants';
import { ArrowUpRight } from 'lucide-react';
import { LabCard } from '@/modules/labs/ui/lab-card.cmp.iso';
import { getLabIcon } from '@/modules/labs/ui/lab-icon.util';

export default async function Home() {
  let articles: ArticleRegistryEntry[] = [];
  let labs: LabRegistryEntry[] = [];

  try {
    const { articles: latest } = listArticles({ status: 'published', limit: 6 });
    articles = latest;
  } catch (error) {
    console.warn(
      'Failed to load articles from registry:',
      error instanceof Error ? error.message : String(error)
    );
  }

  try {
    labs = listLabs({ limit: 3 }).labs;
  } catch (error) {
    console.warn(
      'Failed to load labs from registry:',
      error instanceof Error ? error.message : String(error)
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">

      <section className="mb-12">
        {labs.length > 0 ? (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${SPACING.CARD_GAP}`}>
            {labs.map((lab) => (
              <LabCardWrapper key={lab.slug} lab={lab} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No labs available yet.</p>
            <p className="text-gray-400 mt-2">New experiments land here.</p>
          </div>
        )}
        
        <div className="flex justify-between items-center py-4 px-2 mb-8">
          <Link 
            href="/labs"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View all apps →
          </Link>
        </div>
      </section>

      <section className="mb-12">
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
        
        <div className="flex justify-between items-center py-4 px-2 mb-8">
          <Link 
            href="/articles"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View all articles →
          </Link>
        </div>
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

function ArticleCard({ article }: { article: ArticleRegistryEntry }) {
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
            href={`/article/${article.slug}`}
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

function LabCardWrapper({ lab }: { lab: LabRegistryEntry }) {
  return (
    <LabCard 
      slug={lab.slug}
      title={lab.title}
      description={lab.description}
      icon={getLabIcon(lab.iconName)}
      status={lab.status}
      tags={lab.tags}
    />
  );
}
