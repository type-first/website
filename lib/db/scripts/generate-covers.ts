import dotenv from 'dotenv';
import path from 'path';
import sharp from 'sharp';
import { sql } from '@vercel/postgres';
import { put } from '@vercel/blob';

dotenv.config({ path: path.join(__dirname, '../../../.env.local') });

const W = 1200;
const H = 630;
const brandBlue = '#1e6ad8';
const brandDark = '#0f172a';
const brandSoft = '#dbeafe';

function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
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

function coverSvg(title: string, tag: string, seed: string) {
  const rnd = rng(hashString(seed));
  const shapes = Array.from({ length: 4 }).map(() => {
    const rx = 60 + Math.floor(rnd() * (W - 260));
    const ry = 60 + Math.floor(rnd() * (H - 240));
    const rw = 160 + Math.floor(rnd() * 260);
    const rh = 80 + Math.floor(rnd() * 160);
    const r = 12 + Math.floor(rnd() * 18);
    const op = 0.1 + rnd() * 0.12;
    return `<rect x="${rx}" y="${ry}" rx="${r}" width="${rw}" height="${rh}" fill="#ffffff" opacity="${op.toFixed(2)}"/>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${brandBlue}"/>
      <stop offset="100%" stop-color="${brandDark}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <g>
    <rect x="72" y="72" width="64" height="64" rx="14" fill="#ffffff"/>
    <text x="104" y="117" text-anchor="middle" fill="${brandBlue}" font-family="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" font-weight="800" font-size="36">tf</text>
  </g>
  ${shapes}
  <g>
    <text x="80" y="360" fill="#fff" font-family="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" font-weight="700" font-size="72">${esc(title)}</text>
    ${tag ? `<text x="80" y="420" fill="${brandSoft}" font-family="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" font-size="32">${esc(tag)}</text>` : ''}
  </g>
</svg>`;
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('Missing BLOB_READ_WRITE_TOKEN');
    process.exit(1);
  }

  const overwrite = process.argv.includes('--overwrite');

  const { rows } = await sql`SELECT id, title, slug, tags, cover_image FROM articles WHERE status = 'published' ORDER BY created_at ASC`;
  let generated = 0;
  for (const row of rows as any[]) {
    const slug: string = row.slug;
    const title: string = row.title;
    const tags: string[] = Array.isArray(row.tags) ? row.tags : [];
    const current: string | null = row.cover_image;
    const isLocal = typeof current === 'string' && current.startsWith('/');
    if (current && !isLocal && !overwrite) {
      continue;
    }
    const tag = tags[0] || '';
    const svg = coverSvg(title, tag, slug);
    const png = await sharp(Buffer.from(svg)).png({ quality: 90 }).toBuffer();
    const objectName = `covers/${slug}/${Date.now()}.png`;
    const blob = await put(objectName, png, { access: 'public', contentType: 'image/png', addRandomSuffix: false });
    await sql`UPDATE articles SET cover_image = ${blob.url} WHERE slug = ${slug}`;
    console.log(`Generated cover for ${slug}: ${blob.url}`);
    generated++;
  }
  console.log(`Done. Generated ${generated} covers.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
