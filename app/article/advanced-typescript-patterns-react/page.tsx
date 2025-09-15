import React from "react";
import { AdvancedTypescriptPatternsReactArticle, articleMetadata } from "@/content/articles/advanced-typescript-patterns-react";
import { generateTypeFirstArticleMetadata } from "@/lib/articles";

export async function generateMetadata() {
  return generateTypeFirstArticleMetadata(articleMetadata);
}

export default function AdvancedTypescriptPatternsReactPage() {
  return <AdvancedTypescriptPatternsReactArticle />;
}
