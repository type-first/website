import React from 'react';

interface CoverImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function CoverImage({ src, alt, className = '' }: CoverImageProps) {
  return <img src={src} alt={alt} className={className} />;
}
