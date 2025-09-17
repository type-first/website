/**
 * Pure text extractor for React elements
 * Traverses JSX tree without executing components - completely RSC-safe
 */

import React from 'react'

/**
 * Extracts plain text from a React element tree by traversing props.children
 * Does NOT execute/render any components - just walks the JSX structure
 */
export function extractPlainText(element: React.ReactElement | React.ReactNode): string {
  if (element === null || element === undefined) {
    return ''
  }

  if (typeof element === 'string') {
    return element
  }

  if (typeof element === 'number') {
    return String(element)
  }

  if (typeof element === 'boolean') {
    return ''
  }

  if (Array.isArray(element)) {
    return element.map(extractPlainText).join('')
  }

  // Handle React elements by extracting children only
  if (React.isValidElement(element)) {
    const props = element.props as any
    const children = props?.children
    
    // For intrinsic elements, add spacing for block elements
    const elementType = element.type
    if (typeof elementType === 'string') {
      const childText = extractPlainText(children)
      // Add spacing for block elements
      if (['p', 'div', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(elementType)) {
        return childText + ' '
      }
      return childText
    }
    if (typeof elementType === 'function') {
      // Custom components - try to execute them to get their rendered output
      try {
        let rendered: React.ReactNode
        
        // Handle both functional and class components
        if (elementType.prototype && elementType.prototype.render) {
          // Class component
          const instance = new (elementType as any)(element.props)
          rendered = instance.render()
        } else {
          // Functional component - call it directly
          rendered = (elementType as any)(element.props)
        }
        
        return extractPlainText(rendered)
      } catch (error) {
        // If component execution fails, fall back to children
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.warn(`Failed to execute component ${elementType.name || 'unknown'}:`, errorMessage)
        return extractPlainText(children)
      }
    }
  }

  // Handle React fragments
  if (element && typeof element === 'object' && 'props' in element) {
    return extractPlainText((element as any).props?.children)
  }

  return ''
}

/**
 * Extracts plain text from a React component by creating an element and traversing it
 * Does NOT execute the component - just walks the JSX structure
 */
export function extractComponentText(Component: React.ComponentType<any>, props: any = {}): string {
  const element = React.createElement(Component, props)
  return extractPlainText(element)
}

/**
 * Prepares chunk text for embedding generation by adding the label as a heading
 * This provides better context for vector similarity search
 */
export function prepareChunkForEmbedding(chunk: { label: string; text: string }): string {
  return `# ${chunk.label}\n\n${chunk.text}`
}
