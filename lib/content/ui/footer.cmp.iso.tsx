import React from 'react';

interface FooterProps {
  children: React.ReactNode;
  className?: string;
}

export function Footer({ children, className = '' }: FooterProps) {
  return (
    <footer className={className}>
      {children}
    </footer>
  );
}
