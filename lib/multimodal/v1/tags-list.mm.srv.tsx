import React from 'react';
import { multimodal } from './multimodal.model';
import { Link } from './link.mm.srv';
import { MarkdownBlock } from './markdown-block.m.srv';

type TagsListProps = {
  tags: string[];
  label: string;
};

/**
 * TagsList multimodal component - renders a list of tag links
 * Standard: Inline tag links with label
 * Markdown: Label followed by tag links using MarkdownBlock
 */
export const TagsList = multimodal<TagsListProps>({
  markdown: ({ label, tags }) => {
    const tagLinks = tags.map(tag => `[${tag}](/articles?tag=${encodeURIComponent(tag)})`).join(', ');
    return (
      <MarkdownBlock modality="markdown">
        <>{label} {tagLinks}</>
      </MarkdownBlock>
    );
  }
})(({ label, tags, modality }) => (
  <>
    <span>{label} </span>
    {tags.map((tag: string) => (
      <Link
        key={tag}
        modality={modality}
        href={`/articles?tag=${encodeURIComponent(tag)}`}
      >
        {tag}
      </Link>
    )).map((link, index) => (
      <React.Fragment key={index}>
        {index > 0 && <span>, </span>}
        {link}
      </React.Fragment>
    ))}
  </>
));
