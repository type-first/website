import { SearchTestClient } from './search-test-client';
import SearchTestLabIntro from '@/content/labs/search-test/intro';
import { searchTestLabData } from '@/content/labs/search-test/content.data';
import { generateLabMetadata } from '@/modules/labs/metadata.logic';

export const metadata = generateLabMetadata(searchTestLabData);

export default function SearchTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <SearchTestLabIntro />
        <SearchTestClient />
      </div>
    </div>
  );
}
