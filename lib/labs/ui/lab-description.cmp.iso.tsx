import React from 'react';

interface LabDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function LabDescription({ children, className = '' }: LabDescriptionProps) {
  return (
    <p className={`text-gray-600 mt-1 ${className}`}>
      {children}
    </p>
  );
}
