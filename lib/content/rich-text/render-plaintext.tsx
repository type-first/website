import React from 'react'
import { stripHtmlToPlainText } from '@/lib/content/html-utils'

// Lazy import to avoid bundling react-dom/server on client
let renderToString: any = null

function getRenderToString() {
  if (renderToString === null) {
    try {
      renderToString = require('react-dom/server').renderToString
    } catch (error) {
      console.warn('react-dom/server not available:', error)
      renderToString = () => ''
    }
  }
  return renderToString
}

/**
 * Renders a React component to plain text for search indexing
 */
export function renderPlainText(element: React.ReactElement): string {
  try {
    const render = getRenderToString()
    const htmlString = render(element)
    return stripHtmlToPlainText(htmlString)
  } catch (error) {
    console.warn('Failed to render component to plain text:', error)
    return ''
  }
}
