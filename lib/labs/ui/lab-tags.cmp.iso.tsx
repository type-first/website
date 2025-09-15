import React from 'react';

interface LabTagsProps {
  tags: string[];
  className?: string;
}

export function LabTags({ tags, className = '' }: LabTagsProps) {
  if (!tags || tags.length === 0) return null;
  
  return (
    <div className={`flex flex-wrap gap-2 mt-3 ${className}`}>
      {tags.map((tag) => (
        <span 
          key={tag}
          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md font-medium"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
