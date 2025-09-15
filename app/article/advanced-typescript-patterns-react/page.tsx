import React from "react";
import { AdvancedTypescriptPatternsReactArticle, articleMetadata } from "@/content/articles/advanced-typescript-patterns-react/article";
import { generateTypeFirstArticleMetadata } from "@/modules/articles/metadata.logic";

export async function generateMetadata() {
  return generateTypeFirstArticleMetadata(articleMetadata);
}

export default function AdvancedTypescriptPatternsReactPage() {
  return <AdvancedTypescriptPatternsReactArticle />;
}
