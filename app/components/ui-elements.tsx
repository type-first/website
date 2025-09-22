import Link from 'next/link';
import { ArrowUpRight, Beaker, BookOpen, Sparkles, TrendingUp } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  href?: string;
  linkText?: string;
  icon?: React.ReactNode;
}

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  href?: string;
  linkText?: string;
}

export function SectionHeader({ title, subtitle, href, linkText = "View all" }: SectionHeaderProps) {
  return (
    <div className="text-center mb-16">
      <div className="space-y-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
          {title}
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {subtitle}
        </p>
      </div>
      
      {href && (
        <div className="mt-8">
          <Link 
            href={href}
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-black transition-colors"
          >
            {linkText}
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
      <div className="mx-auto w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md mx-auto">{subtitle}</p>
    </div>
  );
}

interface TechBadgeProps {
  name: string;
  variant?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow';
}

export function TechBadge({ name, variant = 'blue' }: TechBadgeProps) {
  const variants = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg font-medium text-sm border ${variants[variant]}`}>
      {name}
    </span>
  );
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
      <div className="mx-auto w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md mx-auto">{subtitle}</p>
    </div>
  );
}

export function TechBadge({ name, variant = 'blue' }: TechBadgeProps) {
  const variants = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg font-medium text-sm border ${variants[variant]}`}>
      {name}
    </span>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-200">
      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md mx-auto">{subtitle}</p>
    </div>
  );
}

interface TechBadgeProps {
  name: string;
  variant?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow';
}

export function TechBadge({ name, variant = 'blue' }: TechBadgeProps) {
  const variants = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };

  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-xl font-semibold text-sm border ${variants[variant]} hover:scale-105 transition-transform duration-200`}>
      <Sparkles className="h-4 w-4 mr-2" />
      {name}
    </span>
  );
}