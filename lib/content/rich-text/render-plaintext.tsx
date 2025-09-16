/**
 * Render React elements to plain text for search indexing
 * Server-side only utility
 */

import React from 'react'
import { renderToString } from 'react-dom/server'
import { stripHtmlToPlainText } from '@/lib/content/html-utils'

/**
 * Helper to render React element to plain text for search indexing
 */
export const renderPlainText = (element: React.ReactElement): string => {
  const html = renderToString(element)
  return stripHtmlToPlainText(html)
}
