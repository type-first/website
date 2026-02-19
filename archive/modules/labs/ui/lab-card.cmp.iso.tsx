import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface LabCardProps {
  slug: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  status?: 'active' | 'experimental' | 'archived';
  tags?: string[];
  className?: string;
}

export function LabCard({ 
  slug, 
  title, 
  description, 
  icon,
  status,
  tags,
  className = '' 
}: LabCardProps) {
  return (
    <Link
      href={`/labs/${slug}`}
      className={`group rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm transition-colors p-5 flex items-start gap-4 ${className}`}
    >
      {icon && (
        <div className="shrink-0 rounded-lg ring-1 ring-gray-200 bg-gray-50 group-hover:ring-blue-300 transition">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
            {title}
          </h3>
          {status && status !== 'active' && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              status === 'experimental' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {status}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag) => (
              <span 
                key={tag}
                className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
        <span className="inline-flex items-center gap-1 text-sm text-blue-700">
          Open
          <ArrowUpRight className="w-4 h-4" strokeWidth={1.8} />
        </span>
      </div>
    </Link>
  );
}
