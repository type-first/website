import Link from 'next/link';
import { ArrowUpRight, BookOpen, Beaker, FileText, Users, Sparkles } from 'lucide-react';
import type { MainSectionMeta } from '@/content/main/registry';

interface SectionCardProps {
  section: MainSectionMeta;
}

export function SectionCard({ section }: SectionCardProps) {
  const getIcon = (iconName?: string) => {
    const iconProps = "h-8 w-8";
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className={iconProps} />;
      case 'Flask':
      case 'Beaker':
        return <Beaker className={iconProps} />;
      case 'FileText':
        return <FileText className={iconProps} />;
      case 'Users':
        return <Users className={iconProps} />;
      default:
        return <BookOpen className={iconProps} />;
    }
  };

  const getGradient = (iconName?: string) => {
    switch (iconName) {
      case 'BookOpen':
        return 'from-blue-500 to-indigo-600';
      case 'Flask':
      case 'Beaker':
        return 'from-purple-500 to-pink-600';
      case 'FileText':
        return 'from-green-500 to-teal-600';
      case 'Users':
        return 'from-orange-500 to-red-600';
      default:
        return 'from-blue-500 to-indigo-600';
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Gradient Background on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(section.iconName)} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      {/* Header with Icon */}
      <div className="relative p-8 pb-6">
        <div className="flex items-start justify-between mb-6">
          <div className={`p-4 rounded-xl bg-gradient-to-br ${getGradient(section.iconName)} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {getIcon(section.iconName)}
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowUpRight className="h-6 w-6 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {section.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium group-hover:bg-gray-200 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
          {section.href ? (
            <Link href={section.href} className="hover:underline">
              {section.name}
            </Link>
          ) : (
            section.name
          )}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 leading-relaxed mb-6">
          {section.blurb}
        </p>
      </div>
      
      {/* Features List */}
      {section.features && section.features.length > 0 && (
        <div className="px-8 pb-6">
          <div className="space-y-3">
            {section.features.slice(0, 4).map((feature, index) => (
              <div key={feature} className="flex items-center group/item">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getGradient(section.iconName)} mr-3 group-hover:scale-125 transition-transform duration-200`} 
                     style={{ animationDelay: `${index * 100}ms` }}></div>
                <span className="text-sm text-gray-600 group-hover/item:text-gray-800 transition-colors">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Footer Action */}
      <div className="px-8 pb-8">
        {section.href && (
          <Link 
            href={section.href}
            className={`inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r ${getGradient(section.iconName)} text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 group/button`}
          >
            <Sparkles className="mr-2 h-4 w-4 group-hover/button:rotate-12 transition-transform" />
            Explore {section.name}
            <ArrowUpRight className="ml-2 h-4 w-4 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
}