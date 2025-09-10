import Link from 'next/link';

export const metadata = {
  title: 'Labs',
  description: 'Experimental demos and prototypes.'
};

function TypeExplorerIcon() {
  return (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
      <defs>
        <linearGradient id="tx" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#1d4ed8"/>
          <stop offset="100%" stopColor="#0ea5a4"/>
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="36" height="36" rx="8" fill="#f1f5f9" />
      <path d="M17 16h14" stroke="url(#tx)" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M17 24h14" stroke="#334155" strokeWidth="2" strokeLinecap="round" opacity=".6"/>
      <path d="M17 32h9" stroke="#334155" strokeWidth="2" strokeLinecap="round" opacity=".4"/>
      <path d="M10 18c0-3 2-5 5-5" stroke="#94a3b8" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M38 30c0 3-2 5-5 5" stroke="#94a3b8" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <text x="24" y="28" textAnchor="middle" fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" fontSize="9" fontWeight="700" fill="url(#tx)">TS</text>
      <path d="M20 22h8" stroke="url(#tx)" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  );
}

function SearchTestIcon() {
  return (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
      <defs>
        <linearGradient id="search" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed"/>
          <stop offset="100%" stopColor="#06b6d4"/>
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="36" height="36" rx="8" fill="#f8fafc" />
      <circle cx="20" cy="20" r="8" stroke="url(#search)" strokeWidth="2.5" fill="none"/>
      <path d="m26 26 6 6" stroke="url(#search)" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M16 20h8" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" opacity=".6"/>
      <path d="M20 16v8" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" opacity=".6"/>
      <circle cx="32" cy="32" r="2" fill="url(#search)" opacity=".8"/>
    </svg>
  );
}

const labs = [
  {
    slug: 'type-explorer',
    title: 'Type Explorer',
    description: 'TypeScript editor with autocomplete, types and diagnostics.',
    Icon: TypeExplorerIcon,
  },
  {
    slug: 'search-test',
    title: 'Search Testing',
    description: 'Test and compare text vs vector search functionality.',
    Icon: SearchTestIcon,
  },
  // Add more labs here as they land
];

export default function LabsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Labs</h1>
      <p className="mt-3 text-gray-600">Playground for experiments and interactive demos.</p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.map(({ slug, title, description, Icon }) => (
          <Link
            key={slug}
            href={`/labs/${slug}`}
            className="group rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm transition-colors p-5 flex items-start gap-4"
          >
            <div className="shrink-0 rounded-lg ring-1 ring-gray-200 bg-gray-50 group-hover:ring-blue-300 transition">
              <Icon />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                {title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
              <span className="inline-flex items-center gap-1 text-sm text-blue-700 mt-3">
                Open
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 5h10m0 0v10m0-10L9 15"/></svg>
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-sm text-gray-500">More labs coming soon.</div>
    </div>
  );
}
