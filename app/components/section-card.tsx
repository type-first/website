import Link from 'next/link';
import { ArrowUpRight, BookOpen, Beaker, FileText, Users, Sparkles } from 'lucide-react';
import type { MainSectionMeta } from '@/content/main/registry';

interface SectionCardProps {
  section: MainSectionMeta;
}

export function SectionCard({ section }: SectionCardProps) {
  const getIcon = (iconName?: string) => {
    const iconProps = "h-6 w-6";
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
        return 'from-blue-500 to-blue-600';
      case 'Flask':
      case 'Beaker':
        return 'from-purple-500 to-purple-600';
      case 'FileText':
        return 'from-green-500 to-green-600';
      case 'Users':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  const getAccentColor = (iconName?: string) => {
    switch (iconName) {
      case 'BookOpen':
        return 'text-blue-600';
      case 'Flask':
      case 'Beaker':
        return 'text-purple-600';
      case 'FileText':
        return 'text-green-600';
      case 'Users':
        return 'text-orange-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 p-8 hover:shadow-lg">
      {/* Subtle background gradient on hover */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getGradient(section.iconName)} opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300`}></div>
      
      {/* Content */}
      <div className="relative">
        {/* Icon with enhanced styling */}
        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${getGradient(section.iconName)} text-white mb-6 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300`}>
          {getIcon(section.iconName)}
        </div>
        
        {/* Content */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
              {section.name}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {section.blurb}
            </p>
          </div>
          
          {/* Features */}
          {section.features && section.features.length > 0 && (
            <ul className="space-y-3">
              {section.features.slice(0, 3).map((feature, index) => (
                <li key={feature} className="flex items-center text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                  <div 
                    className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${getGradient(section.iconName)} mr-3 group-hover:scale-125 transition-transform duration-200`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  />
                  {feature}
                </li>
              ))}
            </ul>
          )}
          
          {/* Action */}
          {section.href && (
            <div className="pt-6">
              <Link 
                href={section.href}
                className={`inline-flex items-center text-sm font-medium ${getAccentColor(section.iconName)} hover:underline group-hover:gap-2 transition-all duration-200`}
              >
                Learn more
                <ArrowUpRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Decorative corner element */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-gray-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}