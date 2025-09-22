import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import type { ArticleMeta } from '@/lib/content/article.model';
import { COVER_IMAGE } from '@/modules/design-constants/v0/design-constants';

interface HomeArticleCardProps {
  article: ArticleMeta;
}

export function HomeArticleCard({ article }: HomeArticleCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <article className="group bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden hover:shadow-lg hover:-translate-y-1">
      {/* Cover Image */}
      {article.coverImgUrl && (
        <div className={`${COVER_IMAGE.ASPECT_CLASS} bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden`}>
          <img 
            src={article.coverImgUrl} 
            alt={article.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}
      
      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.slice(0, 2).map((tag: string, index) => (
            <span 
              key={tag}
              className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs rounded-full border border-blue-100/50 font-medium group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-200"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {tag}
            </span>
          ))}
          {article.tags.length > 2 && (
            <span className="px-2.5 py-1 bg-gray-50 text-gray-500 text-xs rounded-full border border-gray-100 font-medium">
              +{article.tags.length - 2}
            </span>
          )}
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-800 transition-colors leading-tight">
          <Link 
            href={`/article/${article.slug}`}
            className="hover:underline"
          >
            {article.name}
          </Link>
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2 group-hover:text-gray-700 transition-colors">
          {article.blurb}
        </p>
        
        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 group-hover:text-gray-600 transition-colors pt-2 border-t border-gray-100 group-hover:border-gray-200">
          <span className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            {formatDate(article.publishedTs)}
          </span>
          <span className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            8 min read
          </span>
        </div>
      </div>
      
      {/* Decorative bottom gradient */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </article>
  );
}