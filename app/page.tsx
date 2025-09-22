import { articlesMetaRegistry } from '@/content/articles/meta.registry';
import { mainContentRegistry } from '@/content/main/registry';
import type { ArticleMeta } from '@/lib/content/article.model';
import { listLabs, type LegacyLabData } from '@/modules/labs/registry.logic';
import { Beaker, BookOpen, Target, Code2 } from 'lucide-react';

// Import our new components
import { HeroSection } from './components/hero-section';
import { SectionCard } from './components/section-card';
import { HomeLabCard } from './components/home-lab-card';
import { HomeArticleCard } from './components/home-article-card';
import { SectionHeader, EmptyState, TechBadge } from './components/ui-elements-clean';

export default async function Home() {
  let articles: ArticleMeta[] = [];
  let labs: LegacyLabData[] = [];

  try {
    const latest = articlesMetaRegistry.slice(0, 6);
    articles = latest;
  } catch (error) {
    console.warn(
      'Failed to load articles from registry:',
      error instanceof Error ? error.message : String(error)
    );
  }

  try {
    labs = listLabs({ limit: 6 }).labs;
  } catch (error) {
    console.warn(
      'Failed to load labs from registry:',
      error instanceof Error ? error.message : String(error)
    );
  }

  const { overview, sections } = mainContentRegistry;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <HeroSection overview={overview} />

      {/* Main Content */}
      <div className="relative">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-30 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full opacity-30 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Website Sections */}
        <section className="py-24 bg-white/80 backdrop-blur-sm relative">
          <div className="max-w-6xl mx-auto px-6">
            <SectionHeader
              title="Explore Our Platform"
              subtitle="Discover comprehensive resources, interactive tools, and expert insights to master TypeScript and modern web development."
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              {sections.map((section, index) => (
                <div
                  key={section.slug}
                  className="opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
                >
                  <SectionCard section={section} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Labs Section */}
        <section className="py-24 bg-gradient-to-br from-gray-50 to-purple-50/30 relative">
          <div className="max-w-6xl mx-auto px-6">
            <SectionHeader
              title="Interactive Labs"
              subtitle="Hands-on experiments to explore TypeScript concepts in real-time"
              href="/labs"
              linkText="View all labs"
            />
            
            {labs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {labs.slice(0, 6).map((lab, index) => (
                  <div
                    key={lab.slug}
                    className="opacity-0 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                  >
                    <HomeLabCard lab={lab} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Beaker className="h-8 w-8" />}
                title="No labs available yet"
                subtitle="New interactive experiments will appear here soon. Check back for exciting TypeScript explorations!"
              />
            )}
          </div>
        </section>

        {/* Featured Articles Section */}
        <section className="py-24 bg-white/90 backdrop-blur-sm relative">
          <div className="max-w-6xl mx-auto px-6">
            <SectionHeader
              title="Latest Articles"
              subtitle="In-depth guides and advanced TypeScript patterns from our experts"
              href="/articles"
              linkText="View all articles"
            />
            
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article, index) => (
                  <div
                    key={article.slug}
                    className="opacity-0 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                  >
                    <HomeArticleCard article={article} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<BookOpen className="h-8 w-8" />}
                title="No articles published yet"
                subtitle="Expert content and tutorials will be available here soon. Stay tuned for comprehensive TypeScript guides!"
              />
            )}
          </div>
        </section>

        {/* Technology Showcase */}
        <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
          
          <div className="max-w-6xl mx-auto px-6 text-center relative">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Built for the Future
              </h2>
              
              <p className="text-lg text-gray-300 mb-12 leading-relaxed">
                This platform showcases modern Next.js features and advanced TypeScript patterns.
              </p>
              
              <div className="flex flex-wrap justify-center gap-3">
                <TechBadge name="Next.js 15" variant="blue" />
                <TechBadge name="Server Components" variant="green" />
                <TechBadge name="TypeScript" variant="purple" />
                <TechBadge name="Tailwind CSS" variant="orange" />
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-2xl"></div>
        </section>
      </div>
    </div>
  );
}


