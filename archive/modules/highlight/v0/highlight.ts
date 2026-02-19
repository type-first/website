// Syntax highlighting utilities
export async function highlightCode(code: string, language: string = 'javascript'): Promise<string> {
  // Placeholder implementation for syntax highlighting
  // In a real implementation, you might use Prism.js, highlight.js, or similar
  return `<pre><code class="language-${language}">${escapeHtml(code)}</code></pre>`;
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
