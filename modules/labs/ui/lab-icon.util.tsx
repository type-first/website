import React from 'react';
import { Braces, Microscope, FlaskConical } from 'lucide-react';

/**
 * Maps icon names to Lucide React components
 */
export function getLabIcon(iconName?: string): React.ReactNode {
  if (!iconName) return null;

  const iconMap: Record<string, React.ComponentType<any>> = {
    braces: Braces,
    microscope: Microscope,
    'flask-conical': FlaskConical,
  };

  const IconComponent = iconMap[iconName];
  
  if (!IconComponent) return null;

  return (
    <IconComponent
      className="h-10 w-10 text-gray-700 group-hover:text-blue-700 transition-colors"
      strokeWidth={1.8}
      aria-hidden="true"
    />
  );
}
