import React from 'react';

interface CodeExploreProps {
  slug: string;
  name: string;
  description: string;
  className?: string;
}

export function CodeExplore({ slug, name, description, className = '' }: CodeExploreProps) {
  return (
    <div className={`code-explore ${className}`}>
      <h3>{name}</h3>
      <p>{description}</p>
    </div>
  );
}
