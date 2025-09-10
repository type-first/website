import React from 'react';
import { multimodal } from './multimodal.model';

type CoverImageProps = {
  src: string;
  alt: string;
};

/**
 * CoverImage multimodal component - renders article cover images
 * Standard: Full-width cover image with aspect ratio and styling
 * Markdown: Completely ignored (no rendering)
 */
export const CoverImage = multimodal<CoverImageProps>({
  markdown: () => ''
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
