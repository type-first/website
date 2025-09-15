import React from 'react';

interface StrongProps {
  children: React.ReactNode;
  className?: string;
}

export function Strong({ children, className = '' }: StrongProps) {
  return (
    <strong className={className}>
      {children}
    </strong>
  );
}
