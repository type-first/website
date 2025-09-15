import Link from 'next/link';
import MobileTopBarClient from '@/components/MobileTopBarClient';
import AuthMenu from '@/lib/auth/components/auth-menu';
import { Newspaper, FlaskConical } from 'lucide-react';

export default function MobileTopBar() {
  const menu = (
    <div className="space-y-6">
      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/articles" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:text-blue-700 hover:bg-blue-50">
              <Newspaper className="h-6 w-6" strokeWidth={1.8} />
              <span className="text-sm font-medium">Articles</span>
            </Link>
          </li>
          <li>
            <Link href="/labs" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:text-blue-700 hover:bg-blue-50">
              <FlaskConical className="h-6 w-6" strokeWidth={1.8} />
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
