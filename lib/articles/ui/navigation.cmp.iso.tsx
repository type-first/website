import React from 'react';

interface NavigationProps {
  children: React.ReactNode;
  className?: string;
}

export function Navigation({ children, className = '' }: NavigationProps) {
  return <nav className={className}>{children}</nav>;
}
