import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import SearchBarLauncher from '@/components/SearchBarLauncher';
import AuthMenu from '@/components/AuthMenu';
import ChatSidebar from '@/components/ChatSidebar';
import MobileTopBar from '@/components/MobileTopBar';
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
        <div className="min-h-screen bg-gray-50 flex">
          {/* Sidebar (left) for md+ screens */}
          <aside className="hidden md:flex w-64 flex-none border-r border-gray-200 bg-white">
            <div className="flex flex-col w-full h-screen sticky top-0">
              <div className="h-[60px] px-6 border-b border-gray-200 flex items-center">
                <Link href="/" className="flex items-center gap-3 group">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white font-semibold tracking-tight text-[11px] group-hover:ring-2 group-hover:ring-blue-200 transition">
                    tf
                  </div>
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">typefirst</span>
                </Link>
              </div>
              <nav className="flex-1 px-3 py-4">
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/articles"
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                    >
                      {/* Document icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19.5 14.25v-2.836a2.25 2.25 0 0 0-.659-1.59L13.5 4.5H8.25A2.25 2.25 0 0 0 6 6.75v10.5A2.25 2.25 0 0 0 8.25 19.5H12M19.5 14.25H15M19.5 14.25 12 21.75M9 9h3m-3 3h5.25"/></svg>
                      <span className="text-sm font-medium">Articles</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/labs"
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                    >
                      {/* Beaker icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 2.25v6.214a2.25 2.25 0 0 1-.659 1.59L4.53 13.864a4.5 4.5 0 0 0 3.182 7.636h8.575a4.5 4.5 0 0 0 3.182-7.636l-3.81-3.81a2.25 2.25 0 0 1-.659-1.59V2.25M7.5 2.25h9M6.75 9.75h10.5"/></svg>
                      <span className="text-sm font-medium">Labs</span>
                    </Link>
                  </li>
                </ul>
              </nav>
              <div className="px-3 py-3 border-t border-gray-200">
                {/* Compact auth section for sidebar */}
                <AuthMenu variant="sidebar" />
              </div>
            </div>
          </aside>

          {/* Main column */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Mobile top bar (md-) */}
            <MobileTopBar />

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
        </div>
        {/* Global chat assistant */}
        <ChatSidebar />
      </body>
    </html>
  );
}
