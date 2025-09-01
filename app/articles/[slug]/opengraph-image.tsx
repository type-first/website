import { ImageResponse } from 'next/og';
import { getArticleBySlug } from '@/lib/db/articles';

export const runtime = 'edge';
export const alt = 'Article Cover';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface OGImageProps {
  params: Promise<{ slug: string }>;
}

export default async function OpenGraphImage({ params }: OGImageProps) {
  const { slug } = await params;
  
  try {
    const article = await getArticleBySlug(slug);

    if (article.status !== 'published') {
      return new Response('Article not found', { status: 404 });
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '40px',
              borderRadius: '20px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              maxWidth: '900px',
              margin: '0 60px',
            }}
          >
            <h1
              style={{
                fontSize: article.title.length > 50 ? '48px' : '64px',
                fontWeight: 'bold',
                color: '#1a202c',
                textAlign: 'center',
                lineHeight: '1.2',
                marginBottom: '20px',
              }}
            >
              {article.title}
            </h1>
            
            {article.description && (
              <p
                style={{
                  fontSize: '24px',
                  color: '#4a5568',
                  textAlign: 'center',
                  lineHeight: '1.4',
                  marginBottom: '30px',
                  maxWidth: '800px',
                }}
              >
                {article.description.slice(0, 120)}
                {article.description.length > 120 ? '...' : ''}
              </p>
            )}
            
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              {article.tags.slice(0, 4).map((tag: string) => (
                <span
                  key={tag}
                  style={{
                    backgroundColor: '#e2e8f0',
                    color: '#2d3748',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '18px',
                    fontWeight: '500',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                color: '#718096',
                fontSize: '20px',
              }}
            >
              <span>Our Blog</span>
              <span>•</span>
              {article.publishedAt && (
                <span>
                  {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    // Fallback OG image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1a202c',
            color: 'white',
          }}
        >
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            Article Not Found
          </h1>
          <p
            style={{
              fontSize: '24px',
              textAlign: 'center',
              marginTop: '20px',
            }}
          >
            Our Blog
          </p>
        </div>
      ),
      {
        ...size,
      }
    );
  }
}
