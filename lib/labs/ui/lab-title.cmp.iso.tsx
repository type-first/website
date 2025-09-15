import React from 'react';

interface LabTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function LabTitle({ children, className = '' }: LabTitleProps) {
  return (
    <h1 className={`text-2xl font-semibold text-gray-900 ${className}`}>
      {children}
    </h1>
  );
}
