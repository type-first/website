export const metadata = {
  title: 'Labs',
  description: 'Experimental demos and prototypes.'
};

export default function LabsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Labs</h1>
      <p className="mt-3 text-gray-600">
        Playground for experiments and interactive demos. More coming soon.
      </p>
      <div className="mt-8">
        <ul className="list-disc pl-6 space-y-2 text-blue-600">
          <li>
            <a className="hover:underline" href="/labs/type-explorer">
              Type Explorer: TypeScript editor with types and diagnostics
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
