import { type Metadata } from 'next';

export interface LabContentData {
  slug: string;
  title: string;
  description: string;
  status: 'active' | 'experimental' | 'archived';
  tags: string[];
  addedAt: Date;
  coverImage?: string;
  author?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export function generateLabMetadata(labData: LabContentData): Metadata {
  const title = labData.seoTitle || labData.title;
  const description = labData.seoDescription || labData.description;
  const canonicalUrl = `https://yourdomain.com/labs/${labData.slug}`;

  return {
    title,
    description,
    authors: labData.author ? [{ name: labData.author }] : undefined,
    keywords: labData.tags,
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      images: labData.coverImage ? [
        {
          url: labData.coverImage,
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: labData.coverImage ? [labData.coverImage] : undefined,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    other: {
      'lab:status': labData.status,
      'lab:added': labData.addedAt.toISOString(),
      'lab:tags': labData.tags.join(', '),
    },
  };
}

export function generateLabJsonLd(labData: LabContentData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: labData.title,
    description: labData.description,
    url: `https://yourdomain.com/labs/${labData.slug}`,
    author: labData.author ? {
      '@type': 'Person',
      name: labData.author,
    } : undefined,
    dateCreated: labData.addedAt.toISOString(),
    applicationCategory: 'WebApplication',
    operatingSystem: 'Browser',
    keywords: labData.tags.join(', '),
    image: labData.coverImage,
    isAccessibleForFree: true,
    ...(labData.status === 'experimental' && {
      developmentStatus: 'experimental'
    }),
    ...(labData.status === 'archived' && {
      developmentStatus: 'discontinued'
    }),
  };
}
