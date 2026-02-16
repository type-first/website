import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import SearchBarLauncher from '@/modules/search/components/search-launcher.client';
import ChatSidebar from '@/modules/chat/components/chat-sidebar.client';
import MobileTopBar from '@/modules/navigation/components/top-bar.client.mobile';
import './globals.css';
import { Suspense } from 'react';
import NavSidebar from '@/modules/navigation/components/nav-sidebar.client';
import { FlaskConical, FileText, Menu, X, BookOpen, Users } from 'lucide-react';

// Initialize island registry
import '@/modules/islands/v0/setup';

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
    icon: '/icon.svg',
  },
  // Manifest not provided yet
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gray-50 flex">
          {/* Sidebar (left) for md+ screens */}
          <NavSidebar />

          {/* Main column */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Mobile top bar (md-) */}
            <MobileTopBar 
              menu={
                <nav className="space-y-1">
                  <Link href="/docs" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-md">
                    <BookOpen className="h-5 w-5" strokeWidth={1.8} />
                    docs
                  </Link>
                  <Link href="/articles" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-md">
                    <FileText className="h-5 w-5" strokeWidth={1.8} />
                    blog
                  </Link>
                  <Link href="/community" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-md">
                    <Users className="h-5 w-5" strokeWidth={1.8} />
                    community
                  </Link>
                  <Link href="/labs" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-md">
                    <FlaskConical className="h-5 w-5" strokeWidth={1.8} />
                    labs
                  </Link>
                </nav>
              }
            />

            {/* Secondary topbar: breadcrumbs + search */}
            <SearchBarLauncher />

            <main className="flex-1">
              <Suspense fallback={
              <div className="max-w-6xl mx-auto px-6 py-12">
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
                      <Link href="/docs" className="text-gray-600 hover:text-gray-900 transition-colors">
                        Documentation
                      </Link>
                    </li>
                    <li>
                      <Link href="/docs" className="text-gray-600 hover:text-gray-900 transition-colors">
                        Documentation
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
                <p>&copy; {new Date().getFullYear()} typefirst - Built with Next.js and Islands Architecture.</p>
              </div>
              </div>
            </footer>
          </div>

          {/* Chat Sidebar (right) for md+ screens */}
          <ChatSidebar />
        </div>
      </body>
    </html>
  );
}
