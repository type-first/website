import Link from 'next/link';
import { ArrowUpRight, Beaker, BookOpen, Sparkles, TrendingUp } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  href?: string;
  linkText?: string;
  icon?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, href, linkText = "View all", icon }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-12">
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white">
              {icon}
            </div>
          )}
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            {title}
          </h2>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl">
          {subtitle}
        </p>
      </div>
      
      {href && (
        <Link 
          href={href}
          className="group inline-flex items-center px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          {linkText}
          <ArrowUpRight className="ml-2 h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
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