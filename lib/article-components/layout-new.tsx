import { ReactNode } from 'react';
import { useModality } from './context';

interface CalloutProps {
  children: ReactNode;
  type?: 'info' | 'warning' | 'success' | 'error';
  title?: string;
}

export function Callout({ children, type = 'info', title }: CalloutProps) {
  const modality = useModality();
  
  if (modality === 'markdown') {
    const prefix = type === 'warning' ? '⚠️' : type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    return `${prefix} ${title ? `**${title}**: ` : ''}${children}\n\n` as any;
  }
  
  const typeColors = {
    info: 'border-blue-200 bg-blue-50 text-blue-800',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    success: 'border-green-200 bg-green-50 text-green-800',
    error: 'border-red-200 bg-red-50 text-red-800'
  };
  
  return (
    <div className={`p-4 rounded-lg border-l-4 mb-6 ${typeColors[type]}`}>
      {title && <div className="font-semibold mb-2">{title}</div>}
      <div>{children}</div>
    </div>
  );
}

interface SeparatorProps {
  spacing?: 'small' | 'medium' | 'large';
}

export function Separator({ spacing = 'medium' }: SeparatorProps) {
  const modality = useModality();
  
  if (modality === 'markdown') {
    return '\n---\n\n' as any;
  }
  
  const spacingClasses = {
    small: 'my-4',
    medium: 'my-8',
    large: 'my-12'
  };
  
  return <hr className={`border-gray-200 ${spacingClasses[spacing]}`} />;
}
