import Link from 'next/link';
import MobileTopBarClient from '@/components/MobileTopBarClient';
import AuthMenu from '@/components/AuthMenu';

export default function MobileTopBar() {
  const menu = (
    <div className="space-y-6">
      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/articles" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:text-blue-700 hover:bg-blue-50">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19.5 14.25v-2.836a2.25 2.25 0 0 0-.659-1.59L13.5 4.5H8.25A2.25 2.25 0 0 0 6 6.75v10.5A2.25 2.25 0 0 0 8.25 19.5H12M19.5 14.25H15M19.5 14.25 12 21.75M9 9h3m-3 3h5.25"/></svg>
              <span className="text-sm font-medium">Articles</span>
            </Link>
          </li>
          <li>
            <Link href="/labs" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:text-blue-700 hover:bg-blue-50">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 2.25v6.214a2.25 2.25 0 0 1-.659 1.59L4.53 13.864a4.5 4.5 0 0 0 3.182 7.636h8.575a4.5 4.5 0 0 0 3.182-7.636l-3.81-3.81a2.25 2.25 0 0 1-.659-1.59V2.25M7.5 2.25h9M6.75 9.75h10.5"/></svg>
              <span className="text-sm font-medium">Labs</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div>
        <AuthMenu />
      </div>
    </div>
  );

  return <MobileTopBarClient menu={menu} />;
}

