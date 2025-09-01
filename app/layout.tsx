import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { Suspense } from 'react';

// Initialize island registry
import '@/lib/islands/setup';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Our Blog - Modern Web Development',
    template: '%s | Our Blog',
  },
  description: 'Discover insights, tutorials, and interactive content built with modern web technologies including Next.js, React, and TypeScript.',
  keywords: ['Next.js', 'React', 'TypeScript', 'Web Development', 'JavaScript', 'Islands Architecture'],
  authors: [{ name: 'Our Blog Team' }],
  creator: 'Our Blog',
  publisher: 'Our Blog',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com',
    siteName: 'Our Blog',
    title: 'Our Blog - Modern Web Development',
    description: 'Discover insights, tutorials, and interactive content built with modern web technologies.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Blog - Modern Web Development',
    description: 'Discover insights, tutorials, and interactive content built with modern web technologies.',
    creator: '@yourblog',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <nav className="max-w-6xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h1 className="text-xl font-bold text-gray-900">
                    <Link href="/" className="hover:text-blue-600 transition-colors">
                      Our Blog
                    </Link>
                  </h1>
                </div>
                
                <div className="flex items-center space-x-6">
                  <Link 
                    href="/" 
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Home
                  </Link>
                  <Link 
                    href="/articles" 
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Articles
                  </Link>
                </div>
              </div>
            </nav>
          </header>

          <main className="flex-1">
            <Suspense fallback={
              <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            }>
              {children}
            </Suspense>
          </main>

          <footer className="bg-white border-t border-gray-200 mt-20">
            <div className="max-w-6xl mx-auto px-6 py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Blog</h3>
                  <p className="text-gray-600 text-sm">
                    Modern web development insights and tutorials built with Next.js, 
                    React, and TypeScript.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link href="/articles" className="text-gray-600 hover:text-gray-900 transition-colors">
                        All Articles
                      </Link>
                    </li>
                    <li>
                      <a href="/sitemap.xml" className="text-gray-600 hover:text-gray-900 transition-colors">
                        Sitemap
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Technology</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Next.js 15</span>
                    <span className="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded">React 19</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">TypeScript</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Tailwind CSS</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Vercel</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
                <p>&copy; 2024 Our Blog. Built with Next.js and Islands Architecture.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
