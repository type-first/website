import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { labsRegistry, type LabRegistryEntry } from '@/registries/labs.registry';
import { LabGrid } from '@/modules/labs/ui/lab-grid.cmp.iso';
import { LabCard } from '@/modules/labs/ui/lab-card.cmp.iso';

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

      <LabGrid className="mt-8">
        {labs.map((lab) => (
          <LabCard
            key={lab.slug}
            slug={lab.slug}
            title={lab.title}
            description={lab.description}
            icon={lab.Icon ? <lab.Icon /> : undefined}
            status={lab.status}
            tags={lab.tags}
          />
        ))}
      </LabGrid>

      <div className="mt-10 text-sm text-gray-500">More labs coming soon.</div>
    </div>
  );
}
