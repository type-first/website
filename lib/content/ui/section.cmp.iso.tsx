import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export function Section({ children, className = '' }: SectionProps) {
  return (
    <section className={`mb-6 ${className}`}>
      {children}
    </section>
  );
}
