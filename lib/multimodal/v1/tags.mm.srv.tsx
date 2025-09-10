import React from 'react';
import NextLink from 'next/link';
import type { StandardModalComponent, MarkdownModalComponent } from './multimodal.model';
import { multimodal } from './multimodal.model';

type TagsProps = {
  tags: string[];
};

/**
 * Tags multimodal component - renders article tags
 * Standard: Styled tag pills with links
 * Markdown: Simple comma-separated list of tags
 */
export const Tags = multimodal<TagsProps>({
  markdown: ({ tags }) => 
    `**Tags:** ${tags.map(tag => `[${tag}](/articles?tag=${encodeURIComponent(tag)})`).join(', ')}`
})(({ tags }) => (
  <div className="flex flex-wrap gap-2 mb-4">
    {tags.map((tag: string) => (
      <NextLink
        key={tag}
        href={`/articles?tag=${encodeURIComponent(tag)}`}
        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors"
      >
        {tag}
      </NextLink>
    ))}
  </div>
));
