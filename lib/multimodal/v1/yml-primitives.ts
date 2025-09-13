/**
 * YML Modal Primitives
 * Basic building blocks for rendering components as valid YML strings
 */

import { YMLModalComponent } from './multimodal-model';

/**
 * Helper function to generate indentation for YML
 */
export function createIndent(level: number = 0): string {
  return '  '.repeat(level);
}

/**
 * Helper function to safely escape YML string values
 */
export function escapeYMLString(value: string): string {
  // Check if the string needs quoting
  if (
    value.includes(':') ||
    value.includes('#') ||
    value.includes('|') ||
    value.includes('>') ||
    value.includes('{') ||
    value.includes('}') ||
    value.includes('[') ||
    value.includes(']') ||
    value.includes(',') ||
    value.includes('&') ||
    value.includes('*') ||
    value.includes('!') ||
    value.includes('%') ||
    value.includes('@') ||
    value.includes('`') ||
    value.includes('"') ||
    value.includes("'") ||
    value.includes('\\') ||
    value.includes('\n') ||
    value.includes('\r') ||
    value.includes('\t') ||
    value.trim() !== value ||
    value.match(/^\s*$/) ||
    value.match(/^[\-\?:,\[\]{}#&*!|>'"%@`]/) ||
    value.match(/^(true|false|null|yes|no|on|off|\d+|\d+\.\d+)$/i)
  ) {
    // Use double quotes and escape any double quotes and backslashes
    return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return value;
}

/**
 * YML String primitive - renders a string value
 */
export const YMLString: YMLModalComponent<{ value: string }> = ({ value }) => {
  return escapeYMLString(value);
};

/**
 * YML Number primitive - renders a number value
 */
export const YMLNumber: YMLModalComponent<{ value: number }> = ({ value }) => {
  return String(value);
};

/**
 * YML Boolean primitive - renders a boolean value
 */
export const YMLBoolean: YMLModalComponent<{ value: boolean }> = ({ value }) => {
  return value ? 'true' : 'false';
};

/**
 * YML Null primitive - renders a null value
 */
export const YMLNull: YMLModalComponent<{}> = () => {
  return 'null';
};

/**
 * YML List primitive - renders an array/list structure
 */
export const YMLList: YMLModalComponent<{ 
  items: Array<{ key?: string; value: any; type: 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array' }>;
}> = ({ items, indentLevel = 0 }) => {
  if (items.length === 0) {
    return '[]';
  }

  const indent = createIndent(indentLevel);
  const itemIndent = createIndent(indentLevel);
  
  const renderedItems = items.map(item => {
    let value: string;
    
    switch (item.type) {
      case 'string':
        value = escapeYMLString(String(item.value));
        break;
      case 'number':
        value = String(item.value);
        break;
      case 'boolean':
        value = item.value ? 'true' : 'false';
        break;
      case 'null':
        value = 'null';
        break;
      case 'object':
      case 'array':
        // For complex nested structures, we'll need to handle these recursively
        // For now, we'll stringify them
        value = JSON.stringify(item.value);
        break;
      default:
        value = escapeYMLString(String(item.value));
    }
    
    return `${itemIndent}- ${value}`;
  });

  return renderedItems.join('\n');
};

/**
 * YML Map primitive - renders an object/map structure
 */
export const YMLMap: YMLModalComponent<{ 
  entries: Array<{ key: string; value: any; type: 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array' }>;
}> = ({ entries, indentLevel = 0 }) => {
  if (entries.length === 0) {
    return '{}';
  }

  const indent = createIndent(indentLevel);
  const entryIndent = createIndent(indentLevel);
  
  const renderedEntries = entries.map(entry => {
    let value: string;
    
    switch (entry.type) {
      case 'string':
        value = escapeYMLString(String(entry.value));
        break;
      case 'number':
        value = String(entry.value);
        break;
      case 'boolean':
        value = entry.value ? 'true' : 'false';
        break;
      case 'null':
        value = 'null';
        break;
      case 'object':
      case 'array':
        // For complex nested structures, we'll need to handle these recursively
        // For now, we'll stringify them
        value = JSON.stringify(entry.value);
        break;
      default:
        value = escapeYMLString(String(entry.value));
    }
    
    const key = escapeYMLString(entry.key);
    return `${entryIndent}${key}: ${value}`;
  });

  return renderedEntries.join('\n');
};

/**
 * Helper type for YML-compatible values
 */
export type YMLValue = 
  | string 
  | number 
  | boolean 
  | null 
  | undefined
  | { [key: string]: YMLValue } 
  | YMLValue[];

/**
 * Convert a JavaScript value to YML string with proper indentation
 */
export function valueToYML(value: YMLValue, indentLevel: number = 0): string {
  if (value === null || value === undefined) {
    return 'null';
  }
  
  if (typeof value === 'string') {
    return escapeYMLString(value);
  }
  
  if (typeof value === 'number') {
    return String(value);
  }
  
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]';
    }
    
    const itemIndent = createIndent(indentLevel);
    const items = value.map(item => 
      `${itemIndent}- ${valueToYML(item, indentLevel + 1)}`
    );
    return items.join('\n');
  }
  
  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) {
      return '{}';
    }
    
    const entryIndent = createIndent(indentLevel);
    const renderedEntries = entries.map(([key, val]) => {
      const escapedKey = escapeYMLString(key);
      const renderedValue = valueToYML(val, indentLevel + 1);
      
      // If the value is multi-line, we need special formatting
      if (renderedValue.includes('\n')) {
        return `${entryIndent}${escapedKey}:\n${createIndent(indentLevel + 1)}${renderedValue.split('\n').join('\n' + createIndent(indentLevel + 1))}`;
      } else {
        return `${entryIndent}${escapedKey}: ${renderedValue}`;
      }
    });
    
    return renderedEntries.join('\n');
  }
  
  // Fallback
  return escapeYMLString(String(value));
}
