import React from "react";
import { AdvancedTypescriptPatternsReactArticle, articleMetadata } from "@/articles/advanced-typescript-patterns-react";

export async function generateMetadata() {
  return {
    title: `${articleMetadata.title} | Type-First`,
    description: articleMetadata.description,
    openGraph: {
      title: articleMetadata.title,
      description: articleMetadata.description,
      type: 'article',
      publishedTime: articleMetadata.publishedAt?.toISOString(),
      modifiedTime: articleMetadata.updatedAt?.toISOString(),
      tags: articleMetadata.tags,
      images: articleMetadata.coverImage ? [articleMetadata.coverImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: articleMetadata.title,
      description: articleMetadata.description,
      images: articleMetadata.coverImage ? [articleMetadata.coverImage] : [],
    },
  };
}

export default function AdvancedTypescriptPatternsReactPage() {
  return <AdvancedTypescriptPatternsReactArticle modality={null} />;
}
