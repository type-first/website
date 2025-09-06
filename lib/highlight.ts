import { codeToHtml } from 'shiki';
import { getShikiTheme, type ColorMode } from './codeTheme';

// Map our article languages to Shiki language IDs
function normalizeLang(lang?: string): string {
  if (!lang) return 'text';
  const l = lang.toLowerCase();
  switch (l) {
    case 'ts':
    case 'typescript':
      return 'ts';
    case 'tsx':
      return 'tsx';
    case 'js':
    case 'javascript':
      return 'js';
    case 'jsx':
      return 'jsx';
    case 'bash':
    case 'sh':
    case 'shell':
      return 'bash';
    case 'json':
      return 'json';
    case 'sql':
      return 'sql';
    case 'yaml':
    case 'yml':
      return 'yaml';
    default:
      return l;
  }
}

export async function highlightCode(
  code: string,
  lang?: string,
  mode: ColorMode = 'light'
): Promise<string> {
  try {
    let html = await codeToHtml(code, {
      lang: normalizeLang(lang),
      theme: getShikiTheme(mode),
    });
    // Inject useful utility classes for spacing/rounding
    html = html.replace(
      /<pre class="shiki/g,
      `<pre class="shiki rounded-lg overflow-x-auto"`
    );
    html = html.replace(
      /<code class="/g,
      '<code class="block p-4 '
    );
    return html;
  } catch {
    // On failure, fall back to a plain pre/code block
    const esc = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<pre class="shiki" style="background-color:#0b1021;color:#e5e9f0"><code>${esc}</code></pre>`;
  }
}
