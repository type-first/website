import Link from 'next/link';
import { Play, ExternalLink, Clock, Star } from 'lucide-react';
import type { LegacyLabData } from '@/modules/labs/registry.logic';
import { getLabIcon } from '@/modules/labs/ui/lab-icon.util';

interface HomeLabCardProps {
  lab: LegacyLabData;
}

export function HomeLabCard({ lab }: HomeLabCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'beta':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'alpha':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'stable':
        return <Star className="h-3 w-3" />;
      case 'beta':
        return <Clock className="h-3 w-3" />;
      case 'alpha':
        return <Play className="h-3 w-3" />;
      default:
        return <Play className="h-3 w-3" />;
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              {getLabIcon(lab.iconName)}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                {lab.title}
              </h3>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(lab.status)}`}>
                {getStatusIcon(lab.status)}
                {lab.status}
              </div>
            </div>
          </div>
          <ExternalLink className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-blue-500 transition-all duration-300" />
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
          {lab.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {lab.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium"
            >
              {tag}
            </span>
          ))}
          {lab.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-md">
              +{lab.tags.length - 3} more
            </span>
          )}
        </div>
        
        {/* Action Button */}
        <Link 
          href={`/labs/${lab.slug}`}
          className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform group-hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
        >
          <Play className="mr-2 h-4 w-4" />
          Try Lab
          <ExternalLink className="ml-2 h-4 w-4 opacity-75" />
        </Link>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
      <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
    </div>
  );
}