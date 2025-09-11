/**
 * Clean HTML artifacts from rendered markdown output
 * Only handles HTML encoding residue from React renderToString
 */
export function cleanMarkdownOutput(html: string): string {
  return html
    // Remove HTML comments (<!-- -->)
    .replace(/<!--[\s\S]*?-->/g, '')
    // Decode common HTML entities
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"');
}

/**
 * Render a multimodal component to clean markdown string
 */
export function renderToMarkdown(component: React.ReactElement): string {
  const { renderToString } = require('react-dom/server');
  const rawOutput = renderToString(component);
  return cleanMarkdownOutput(rawOutput);
}
