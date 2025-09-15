import React from "react";
import { AdvancedTypescriptPatternsReactArticle, articleMetadata } from "@/content/articles/advanced-typescript-patterns-react/ui";
import { generateTypeFirstArticleMetadata } from "@/modules/articles/metadata.logic";

export async function generateMetadata() {
  return generateTypeFirstArticleMetadata({
    ...articleMetadata,
    tags: [...articleMetadata.tags],
    publishedAt: new Date(articleMetadata.publishedAt),
    updatedAt: new Date(articleMetadata.updatedAt),
  });
}

export default function AdvancedTypescriptPatternsReactPage() {
  return <AdvancedTypescriptPatternsReactArticle />;
}
