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

  const getReadingTime = (content?: string) => {
    // Estimate reading time (placeholder)
    return '8 min read';
  };

  return (
    <article className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Cover Image */}
      {article.coverImgUrl && (
        <div className={`${COVER_IMAGE.ASPECT_CLASS} bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden`}>
          <img 
            src={article.coverImgUrl} 
            alt={article.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {/* Reading time badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-700">
            <Clock className="inline h-3 w-3 mr-1" />
            {getReadingTime()}
          </div>
        </div>
      )}
      
      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.slice(0, 3).map((tag: string) => (
            <span 
              key={tag}
              className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium group-hover:bg-blue-100 transition-colors"
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </span>
          ))}
          {article.tags.length > 3 && (
            <span className="px-3 py-1 bg-gray-50 text-gray-500 text-sm rounded-full">
              +{article.tags.length - 3}
            </span>
          )}
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          <Link 
            href={`/article/${article.slug}`}
            className="hover:underline"
          >
            {article.name}
          </Link>
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
          {article.blurb}
        </p>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Author & Date */}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(article.publishedTs)}
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                {article.author.name.charAt(0)}
              </div>
              {article.author.name}
            </div>
          </div>
          
          {/* Read More */}
          <Link 
            href={`/article/${article.slug}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm group/link"
          >
            Read more
            <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
      
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </article>
  );
}