import { getAllArticles } from '@/lib/articles/registry';
import { COVER_IMAGE } from '@/lib/design-constants';

export default async function MetadataInspectorPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const params = await searchParams;
  const selectedSlug = params.slug;
  const articles = await getAllArticles();
  
  let articleData = null;
  if (selectedSlug) {
    articleData = articles.find(article => article.slug === selectedSlug);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">SEO & Metadata Inspector</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Article Selector */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Select Article</h2>
          <div className="space-y-2">
            {articles.map((article) => (
              <a
                key={article.slug}
                href={`/metadata-inspector?slug=${article.slug}`}
                className={`block p-3 rounded-lg border text-sm ${
                  selectedSlug === article.slug
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{article.title}</div>
                <div className="text-gray-500 text-xs">/{article.slug}</div>
              </a>
            ))}
          </div>
        </div>

        {/* Metadata Display */}
        <div className="lg:col-span-2">
          {selectedSlug && articleData ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">
                Metadata for: {selectedSlug}
              </h2>
              
              {/* Basic Meta Tags */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-3">📄 Basic Meta Tags</h3>
                <div className="space-y-2 text-sm font-mono">
                  <div>
                    <span className="text-gray-500">title:</span>{" "}
                    <span className="text-green-600">"{String(articleData.title)}"</span>
                  </div>
                  <div>
                    <span className="text-gray-500">description:</span>{" "}
                    <span className="text-green-600">"{String(articleData.description)}"</span>
                  </div>
                  <div>
                    <span className="text-gray-500">author:</span>{" "}
                    <span className="text-green-600">"{String(articleData.author)}"</span>
                  </div>
                  <div>
                    <span className="text-gray-500">publishedAt:</span>{" "}
                    <span className="text-green-600">"{articleData.publishedAt?.toISOString()}"</span>
                  </div>
                </div>
              </div>

              {/* Tags & SEO */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-3">�️ Tags & SEO</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500 font-mono">tags:</span>{" "}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {articleData.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 font-mono">seoTitle:</span>{" "}
                    <span className="text-green-600">"{String(articleData.seoTitle)}"</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-mono">seoDescription:</span>{" "}
                    <span className="text-green-600">"{String(articleData.seoDescription)}"</span>
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              {articleData.coverImage && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">�️ Cover Image</h3>
                  <div className="space-y-3">
                    <div className="text-sm font-mono">
                      <span className="text-gray-500">coverImage:</span>{" "}
                      <span className="text-purple-600">"{articleData.coverImage}"</span>
                    </div>
                    <div className={`max-w-sm ${COVER_IMAGE.ASPECT_CLASS}`}>
                      <img 
                        src={articleData.coverImage} 
                        alt={String(articleData.title)}
                        className="w-full h-full object-cover rounded border"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Raw HTML Preview */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-3">🔍 Expected HTML Meta Tags</h3>
                <pre className="text-xs overflow-x-auto bg-gray-900 text-green-400 p-3 rounded whitespace-pre-wrap">
{`<title>${articleData.seoTitle || articleData.title}</title>
<meta name="description" content="${articleData.seoDescription || articleData.description}" />
<meta name="author" content="${articleData.author}" />
<meta property="og:title" content="${articleData.title}" />
<meta property="og:description" content="${articleData.description}" />
<meta property="og:type" content="article" />
<meta property="og:image" content="${articleData.coverImage}" />
<meta property="og:url" content="http://localhost:3000/articles/${articleData.slug}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${articleData.title}" />
<meta name="twitter:description" content="${articleData.description}" />
<meta name="twitter:image" content="${articleData.coverImage}" />
<meta property="article:published_time" content="${articleData.publishedAt?.toISOString()}" />
<meta property="article:author" content="${articleData.author}" />
${articleData.tags.map(tag => `<meta property="article:tag" content="${tag}" />`).join('\n')}`}
                </pre>
              </div>

              {/* Quick Actions */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-3">🚀 Testing Tools</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <a
                    href={`/articles/${selectedSlug}`}
                    target="_blank"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm text-center"
                  >
                    📄 View Article
                  </a>
                  <a
                    href={`view-source:http://localhost:3000/articles/${selectedSlug}`}
                    target="_blank"
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm text-center"
                  >
                    🔍 View Source
                  </a>
                  <a
                    href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(`http://localhost:3000/articles/${selectedSlug}`)}`}
                    target="_blank"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm text-center"
                  >
                    📘 Test Facebook
                  </a>
                  <a
                    href={`https://www.opengraph.xyz/?url=${encodeURIComponent(`http://localhost:3000/articles/${selectedSlug}`)}`}
                    target="_blank"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm text-center"
                  >
                    🌐 Test OpenGraph
                  </a>
                  <a
                    href={`https://cards-dev.twitter.com/validator`}
                    target="_blank"
                    className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 text-sm text-center"
                  >
                    🐦 Twitter Validator
                  </a>
                  <a
                    href={`https://www.linkedin.com/post-inspector/`}
                    target="_blank"
                    className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 text-sm text-center"
                  >
                    💼 LinkedIn Inspector
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-4">🔍</div>
                <div>Select an article to inspect its metadata</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
