import React from 'react';

interface TagsListProps {
  label: string;
  tags: string[];
  className?: string;
}

export function TagsList({ label, tags, className = '' }: TagsListProps) {
  return (
    <div className={`tags-list ${className}`}>
      <span className="label">{label}:</span>
      {tags.map((tag, index) => (
        <span key={index} className="tag">
          {tag}
        </span>
      ))}
    </div>
  );
}
