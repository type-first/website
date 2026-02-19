'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function toTitle(str: string) {
  try {
    const decoded = decodeURIComponent(str);
    return decoded
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  } catch {
    return str;
  }
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const parts = (pathname || '/').split('/').filter(Boolean);
  const crumbs = parts.map((part, idx) => {
    const href = '/' + parts.slice(0, idx + 1).join('/');
    return { label: toTitle(part), href };
  });

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
        </li>
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex items-center gap-2">
            <span className="text-gray-300">/</span>
            {i < crumbs.length - 1 ? (
              <Link href={c.href} className="hover:text-gray-900 transition-colors">
                {c.label}
              </Link>
            ) : (
              <span className="text-gray-700" aria-current="page">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

