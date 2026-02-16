import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import type { LegacyLabData } from '@/modules/labs/registry.logic';
import { getLabIcon } from '@/modules/labs/ui/lab-icon.util';

interface HomeLabCardProps {
  lab: LegacyLabData;
}

export function HomeLabCard({ lab }: HomeLabCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'beta':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'alpha':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'stable':
        return 'bg-green-500';
      case 'beta':
        return 'bg-yellow-500';
      case 'alpha':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 p-6 hover:shadow-lg hover:-translate-y-1">
      {/* Subtle background gradient on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
              {getLabIcon(lab.iconName)}
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                {lab.title}
              </h3>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusDot(lab.status)} group-hover:scale-125 transition-transform duration-200`} />
                <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(lab.status)} group-hover:shadow-sm transition-all duration-200`}>
                  {lab.status}
                </div>
              </div>
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-purple-500 transition-all duration-200" />
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 group-hover:text-gray-700 transition-colors">
          {lab.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {lab.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={tag}
              className="px-2.5 py-1 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 text-xs rounded-full border border-purple-100/50 font-medium group-hover:from-purple-100 group-hover:to-blue-100 transition-all duration-200"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {tag}
            </span>
          ))}
          {lab.tags.length > 3 && (
            <span className="px-2.5 py-1 bg-gray-50 text-gray-500 text-xs rounded-full border border-gray-100 font-medium">
              +{lab.tags.length - 3}
            </span>
          )}
        </div>
        
        {/* Action Button */}
        <Link 
          href={`/labs/${lab.slug}`}
          className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-gray-900 to-black text-white text-sm font-medium rounded-xl hover:from-gray-800 hover:to-gray-900 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
        >
          Try Lab
          <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
      
      {/* Decorative corner element */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-purple-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}