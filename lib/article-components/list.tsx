import React, { ReactNode } from 'react';
import { useModality } from './simple-context';

// Helper function to extract text content from ReactNode
function extractTextContent(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  
  if (React.isValidElement(node)) {
    // If it's a React element, try to extract text from its children
    return extractTextContent((node.props as any).children);
  }
  
  if (Array.isArray(node)) {
    return node.map(extractTextContent).join('');
  }
  
  return '';
}

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
    
    // Extract text from each ListItem child
    const childrenArray = React.Children.toArray(children);
    const listItems = childrenArray.map(child => {
      if (React.isValidElement(child)) {
        const text = extractTextContent((child.props as any).children);
        return `  * ${text}`;
      }
      return `  * ${extractTextContent(child)}`;
    });
    
    result += listItems.join('\n');
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
