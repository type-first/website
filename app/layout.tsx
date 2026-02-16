import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css';

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
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
