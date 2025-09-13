import React from 'react';
import { multimodal } from './multimodal-model';
import { createIndent, escapeYMLString } from './yml-primitives';

type CoverImageProps = {
  src: string;
  alt: string;
};

/**
 * CoverImage multimodal component - renders article cover images
 * Standard: Full-width cover image with aspect ratio and styling
 * Markdown: Completely ignored (no rendering)
 * YML: Renders as an image object with metadata
 */
export const CoverImage = multimodal<CoverImageProps>({
  markdown: () => '',
  yml: ({ src, alt, indentLevel = 0 }) => {
    const indent = createIndent(indentLevel);
    const childIndent = createIndent(indentLevel + 1);
    return `${indent}cover_image:
${childIndent}src: ${escapeYMLString(src)}
${childIndent}alt: ${escapeYMLString(alt)}`;
  }
})(({ src, alt }) => (
  <div 
    className="w-full bg-gray-100 rounded-lg overflow-hidden mb-8" 
    style={{ aspectRatio: '2.7/1' }}
  >
    <img 
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
    />
  </div>
));
