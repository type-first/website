import React from 'react';

interface LabHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function LabHeader({ children, className = '' }: LabHeaderProps) {
  return (
    <header className={`mb-6 ${className}`}>
      {children}
    </header>
  );
}
