import { getAllArticles } from '@/lib/articles/v0/registry';
import Link from 'next/link';

export default async function SEOTestPage() {
  const articles = await getAllArticles();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">SEO & OpenGraph Testing</h1>
      
      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">How to Test:</h2>
        <ul className="space-y-1 text-sm">
          <li>• Click any article link below</li>
          <li>• Right-click → "View Page Source" to see meta tags</li>
          <li>• Use browser dev tools → Elements tab → search for "meta"</li>
          <li>• Test social sharing with tools below</li>
        </ul>
      </div>

      <div className="grid gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🔍 Testing Tools</h2>
          <div className="space-y-3">
            <div>
              <strong>Facebook/Meta Debugger:</strong>
              <br />
              <a 
                href="https://developers.facebook.com/tools/debug/" 
                target="_blank" 
                className="text-blue-600 hover:underline text-sm"
              >
                https://developers.facebook.com/tools/debug/
              </a>
            </div>
            <div>
              <strong>Twitter Card Validator:</strong>
              <br />
              <a 
                href="https://cards-dev.twitter.com/validator" 
                target="_blank" 
                className="text-blue-600 hover:underline text-sm"
              >
                https://cards-dev.twitter.com/validator
              </a>
            </div>
            <div>
              <strong>LinkedIn Post Inspector:</strong>
              <br />
              <a 
                href="https://www.linkedin.com/post-inspector/" 
                target="_blank" 
                className="text-blue-600 hover:underline text-sm"
              >
                https://www.linkedin.com/post-inspector/
              </a>
            </div>
            <div>
              <strong>Open Graph Debugger:</strong>
              <br />
              <a 
                href="https://www.opengraph.xyz/" 
                target="_blank" 
                className="text-blue-600 hover:underline text-sm"
              >
                https://www.opengraph.xyz/
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">📄 All Articles</h2>
        {articles.map((article) => (
          <div key={article.slug} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Link 
                  href={`/articles/${article.slug}`}
                  className="text-lg font-semibold text-blue-600 hover:underline"
                >
                  {article.title}
                </Link>
                <p className="text-gray-600 text-sm mt-1">{article.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {article.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="ml-4 space-y-2">
                <TestMetaButton slug={article.slug} />
                <ShareTestButton 
                  url={`http://localhost:3000/articles/${article.slug}`}
                  title={article.title}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestMetaButton({ slug }: { slug: string }) {
  return (
    <a
      href={`/articles/${slug}`}
      target="_blank"
      className="block px-3 py-1 bg-green-100 text-green-800 text-xs rounded hover:bg-green-200 text-center"
    >
      View Page
    </a>
  );
}

function ShareTestButton({ url, title }: { url: string; title: string }) {
  const facebookUrl = `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(url)}`;
  
  return (
    <a
      href={facebookUrl}
      target="_blank"
      className="block px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200 text-center"
    >
      Test OG
    </a>
  );
}
