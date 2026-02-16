import React from "react";
import { AdvancedTypescriptPatternsReactArticle, articleMetadata } from "@/content/articles/advanced-typescript-patterns-react/ui";

export async function generateMetadata() {
  return {
    title: articleMetadata.title,
    description: articleMetadata.description,
    keywords: articleMetadata.tags.join(', '),
  };
}

export default function AdvancedTypescriptPatternsReactPage() {
  return <AdvancedTypescriptPatternsReactArticle />;
}
