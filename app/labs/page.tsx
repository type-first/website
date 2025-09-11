import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { labsRegistry, type LabRegistryEntry } from '@/registry.labs';

export const metadata = {
  title: 'Labs',
  description: 'Experimental demos and prototypes.'
};

export default function LabsPage() {
  const labs: LabRegistryEntry[] = labsRegistry;
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
              {Icon ? <Icon /> : null}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                {title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
              <span className="inline-flex items-center gap-1 text-sm text-blue-700 mt-3">
                Open
                <ArrowUpRight className="w-4 h-4" strokeWidth={1.8} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-sm text-gray-500">More labs coming soon.</div>
    </div>
  );
}
