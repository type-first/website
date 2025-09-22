import Link from 'next/link';
import { ChevronRight, Code2, Zap, Globe } from 'lucide-react';
import type { MainOverviewMeta } from '@/content/main/registry';

interface HeroSectionProps {
  overview: MainOverviewMeta;
}

export function HeroSection({ overview }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[70vh]">
          {/* Left Column - Text Content */}
          <div className="space-y-8 text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">TypeScript Excellence</span>
            </div>
            
            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                  {overview.title}
                </span>
                <span className="block text-2xl lg:text-3xl text-blue-200 font-normal mt-4">
                  {overview.subtitle}
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-2xl">
                {overview.description}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {overview.callToAction && (
                <Link 
                  href={overview.callToAction.href}
                  className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {overview.callToAction.text}
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              <Link 
                href="/labs"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200"
              >
                <Zap className="mr-2 h-5 w-5" />
                Interactive Labs
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-white/10">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-sm text-slate-400">Advanced Patterns</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-slate-400">Type Safe</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10k+</div>
                <div className="text-sm text-slate-400">Developers</div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Visual */}
          <div className="relative">
            {/* Main Code Preview */}
            <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8 shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="text-slate-400 text-sm ml-4">advanced-types.ts</div>
              </div>
              
              <div className="space-y-2 font-mono text-sm">
                <div className="text-purple-300">type <span className="text-blue-300">DeepReadonly</span>&lt;<span className="text-orange-300">T</span>&gt; = {`{`}</div>
                <div className="text-slate-400 ml-4">readonly [<span className="text-orange-300">K</span> in keyof <span className="text-orange-300">T</span>]:</div>
                <div className="text-slate-400 ml-8"><span className="text-orange-300">T</span>[<span className="text-orange-300">K</span>] extends object</div>
                <div className="text-slate-400 ml-12">? <span className="text-blue-300">DeepReadonly</span>&lt;<span className="text-orange-300">T</span>[<span className="text-orange-300">K</span>]&gt;</div>
                <div className="text-slate-400 ml-12">: <span className="text-orange-300">T</span>[<span className="text-orange-300">K</span>]</div>
                <div className="text-purple-300">{`}`}</div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-3 shadow-lg">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-full p-3 shadow-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-16 -left-8 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-16 -right-8 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,64L48,69.3C96,75,192,85,288,85.3C384,85,480,75,576,69.3C672,64,768,64,864,69.3C960,75,1056,85,1152,85.3C1248,85,1344,75,1392,69.3L1440,64V120H1392C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120H0V64Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}