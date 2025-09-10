import React, { ReactNode } from 'react';
import { useModality } from './context';

interface ListProps {
  children: ReactNode;
  heading?: string;
}

export function List({ heading, children }: ListProps) {
  const modality = useModality();
  
  if (modality === 'markdown') {
    let result = '';
    if (heading) {
      result += `### **${heading}**\n`;
    }
    
    // For markdown, we'll let each ListItem handle its own formatting
    result += String(children).split('\n').filter(line => line.trim()).map(line => `  * ${line.trim()}`).join('\n');
    
    return `${result}\n\n` as any;
  }
  
  return (
    <div className="mb-6">
      {heading && <h3 className="text-lg font-semibold mb-3">{heading}</h3>}
      <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
        {children}
      </ul>
    </div>
  );
}

interface ListItemProps {
  children: ReactNode;
}

export function ListItem({ children }: ListItemProps) {
  const modality = useModality();
  
  if (modality === 'markdown') {
    // This will be handled by the parent List component
    return children as any;
  }
  
  return <li>{children}</li>;
}
