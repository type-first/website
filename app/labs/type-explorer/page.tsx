import TypeExplorer from "../../../components/TypeExplorer";

export const metadata = {
  title: "Type Explorer",
  description: "Single-file TypeScript editor with types and diagnostics.",
};

export default function TypeExplorerPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Type Explorer</h1>
        <p className="text-gray-600 mt-1">
          TypeScript playground with autocomplete, types, and diagnostics.
        </p>
      </div>
      <TypeExplorer />
    </div>
  );
}
