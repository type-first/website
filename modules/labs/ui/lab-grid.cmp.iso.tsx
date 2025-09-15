import React from 'react';

interface LabGridProps {
  children: React.ReactNode;
  className?: string;
}

export function LabGrid({ children, className = '' }: LabGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {children}
    </div>
  );
}
