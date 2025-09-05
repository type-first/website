import { NextRequest, NextResponse } from 'next/server';

function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function hashString(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get('title') || 'Article').slice(0, 120);
  const tag = (searchParams.get('tag') || '').slice(0, 40);
  const seedParam = searchParams.get('seed') || title;
  const w = 1200;
  const h = 630;

  // Brand palette
  const brandBlue = '#1e6ad8';
  const brandDark = '#0f172a';
  const brandSoft = '#dbeafe';

  const rnd = rng(hashString(seedParam));
  const shapes = Array.from({ length: 4 }).map(() => {
    const rx = 60 + Math.floor(rnd() * (w - 260));
    const ry = 60 + Math.floor(rnd() * (h - 240));
    const rw = 160 + Math.floor(rnd() * 260);
    const rh = 80 + Math.floor(rnd() * 160);
    const r = 12 + Math.floor(rnd() * 18);
    const op = 0.10 + rnd() * 0.12;
    return `<rect x=\"${rx}\" y=\"${ry}\" rx=\"${r}\" width=\"${rw}\" height=\"${rh}\" fill=\"#ffffff\" opacity=\"${op.toFixed(2)}\"/>`;
  });

  const mark = `
    <g>
      <rect x=\"72\" y=\"72\" width=\"64\" height=\"64\" rx=\"14\" fill=\"#ffffff\"/>
      <text x=\"104\" y=\"117\" text-anchor=\"middle\" fill=\"${brandBlue}\" font-family=\"Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto\" font-weight=\"800\" font-size=\"36\">tf</text>
    </g>`;

  const svg = `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 ${w} ${h}\" width=\"${w}\" height=\"${h}\" role=\"img\" aria-label=\"${esc(title)}\">\n  <defs>\n    <linearGradient id=\"bg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n      <stop offset=\"0%\" stop-color=\"${brandBlue}\"/>\n      <stop offset=\"100%\" stop-color=\"${brandDark}\"/>\n    </linearGradient>\n  </defs>\n  <rect width=\"${w}\" height=\"${h}\" fill=\"url(#bg)\"/>\n  ${mark}\n  ${shapes.join('')}\n  <g>\n    <text x=\"80\" y=\"360\" fill=\"#fff\" font-family=\"Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto\" font-weight=\"700\" font-size=\"72\">${esc(title)}</text>\n    ${tag ? `<text x=\"80\" y=\"420\" fill=\"${brandSoft}\" font-family=\"Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto\" font-size=\"32\">${esc(tag)}</text>` : ''}\n  </g>\n</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
