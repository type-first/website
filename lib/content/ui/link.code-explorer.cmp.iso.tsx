import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Code2 } from 'lucide-react';

interface CodeExploreProps {
  slug: string;
  name: string;
  description: string;
  className?: string;
}

export function CodeExplorerLink({ slug, name, description, className = '' }: CodeExploreProps) {
  return (
    <Link 
      href={`/scenarios/${slug}`}
      className={`
        block p-4 border border-gray-200 rounded-lg hover:border-gray-300 
        hover:shadow-md transition-all duration-200 group ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
            <Code2 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {name}
            </h4>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {description}
            </p>
            <div className="mt-2">
              <span className="inline-flex items-center text-xs font-medium text-blue-600">
                Try in Type Explorer
                <ArrowUpRight className="w-3 h-3 ml-1" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
