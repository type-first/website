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
import { SectionHeader, EmptyState, TechBadge } from './components/ui-elements';

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection overview={overview} />

      {/* Main Content */}
      <div className="relative">
        {/* Website Sections */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHeader
              title="Explore Our Platform"
              subtitle="Discover comprehensive resources, interactive tools, and expert insights to master TypeScript and modern web development."
              icon={<Target className="h-6 w-6" />}
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              {sections.map((section) => (
                <SectionCard key={section.slug} section={section} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Labs Section */}
        <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHeader
              title="Interactive Labs"
              subtitle="Hands-on experiments to explore TypeScript concepts in real-time"
              href="/labs"
              linkText="View all labs"
              icon={<Beaker className="h-6 w-6" />}
            />
            
            {labs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {labs.slice(0, 6).map((lab) => (
                  <HomeLabCard key={lab.slug} lab={lab} />
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
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHeader
              title="Latest Articles"
              subtitle="In-depth guides and advanced TypeScript patterns from our experts"
              href="/articles"
              linkText="View all articles"
              icon={<BookOpen className="h-6 w-6" />}
            />
            
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <HomeArticleCard key={article.slug} article={article} />
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
        <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
                <Code2 className="h-5 w-5 text-white" />
                <span className="text-white font-medium">Powered by Modern Technology</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Built for the Future
              </h2>
              
              <p className="text-xl text-blue-100 mb-12 leading-relaxed">
                This platform showcases state-of-the-art Next.js features including App Router, 
                Server Components, and interactive islands architecture, all powered by advanced TypeScript patterns.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <TechBadge name="Next.js 15" variant="blue" />
                <TechBadge name="Server Components" variant="green" />
                <TechBadge name="Islands Architecture" variant="purple" />
                <TechBadge name="TypeScript" variant="orange" />
                <TechBadge name="Advanced Types" variant="red" />
                <TechBadge name="Tailwind CSS" variant="yellow" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


