import Link from 'next/link';
import { ChevronRight, Code2, Zap, Globe } from 'lucide-react';
import type { MainOverviewMeta } from '@/content/main/registry';

interface HeroSectionProps {
  overview: MainOverviewMeta;
}

export function HeroSection({ overview }: HeroSectionProps) {
  return (
    <section className="relative min-h-[70vh] md:min-h-[90vh] bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Floating gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-100/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-6 pt-12 md:pt-24 pb-12 md:pb-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
            <div className="relative">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight">
                <span className="text-gray-900">Type-First</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Development
                </span>
              </h1>
              
              {/* Badge - positioned in top right on desktop, below title on mobile */}
              <div className="inline-flex md:absolute md:top-0 md:right-0 md:-translate-y-2 items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-full mt-4 md:mt-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs md:text-sm font-medium text-blue-700">TypeScript Excellence</span>
              </div>
            </div>
            
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 font-light">
              {overview.subtitle}
            </p>
            <p className="text-base md:text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
              {overview.description}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-16">
            {overview.callToAction && (
              <button className="group relative inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity"></span>
                {overview.callToAction.text}
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
            <button className="group inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-white/70 backdrop-blur-sm border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-white hover:border-gray-300 hover:shadow-md transition-all duration-200">
              <Zap className="mr-2 h-4 w-4 text-blue-600" />
              Interactive Labs
            </button>
          </div>
          
          {/* Enhanced Code Preview */}
          <div className="max-w-2xl mx-auto mb-8 md:mb-16">
            <div className="relative bg-gray-950 rounded-xl md:rounded-2xl border border-gray-200/20 shadow-2xl overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 bg-gray-900 border-b border-gray-700">
                <div className="flex gap-1.5 md:gap-2">
                  <div className="w-2.5 md:w-3 h-2.5 md:h-3 bg-red-500 rounded-full"></div>
                  <div className="w-2.5 md:w-3 h-2.5 md:h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-2.5 md:w-3 h-2.5 md:h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-gray-400 text-xs md:text-sm ml-3 md:ml-4 font-mono">advanced-types.ts</div>
                <div className="ml-auto">
                  <div className="w-3 md:w-4 h-3 md:h-4 rounded border border-gray-600 bg-gray-800"></div>
                </div>
              </div>
              
              {/* Code content */}
              <div className="p-4 md:p-6 space-y-1 font-mono text-xs md:text-sm text-left">
                <div className="text-purple-400">type <span className="text-blue-400">DeepReadonly</span>&lt;<span className="text-orange-400">T</span>&gt; = {`{`}</div>
                <div className="text-gray-400 ml-2 md:ml-4">readonly [<span className="text-orange-400">K</span> in keyof <span className="text-orange-400">T</span>]:</div>
                <div className="text-gray-400 ml-4 md:ml-8"><span className="text-orange-400">T</span>[<span className="text-orange-400">K</span>] extends object</div>
                <div className="text-gray-400 ml-6 md:ml-12">? <span className="text-blue-400">DeepReadonly</span>&lt;<span className="text-orange-400">T</span>[<span className="text-orange-400">K</span>]&gt;</div>
                <div className="text-gray-400 ml-6 md:ml-12">: <span className="text-orange-400">T</span>[<span className="text-orange-400">K</span>]</div>
                <div className="text-purple-400">{`}`}</div>
              </div>
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
            </div>
          </div>
          
          {/* Enhanced Stats */}
          <div className="flex justify-center gap-8 md:gap-16 pt-6 md:pt-8 border-t border-gray-200/50">
            <div className="text-center group">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">50+</div>
              <div className="text-xs md:text-sm text-gray-500">Advanced Patterns</div>
            </div>
            <div className="text-center group">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">100%</div>
              <div className="text-xs md:text-sm text-gray-500">Type Safe</div>
            </div>
            <div className="text-center group">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">10k+</div>
              <div className="text-xs md:text-sm text-gray-500">Developers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}