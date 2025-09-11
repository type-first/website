'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import AuthProvider, { useSessionSafe } from '@/components/AuthProvider';
import { signOut } from 'next-auth/react';
import { ChevronLeft, FlaskConical, Newspaper, BookOpen, Users, MessageCircle } from 'lucide-react';

const AUTO_COLLAPSE_MS = 30_000; // 30 seconds

export default function NavSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const idleTimerRef = useRef<number | null>(null);

  // Start an idle timer that collapses the sidebar after inactivity
  const scheduleCollapse = useMemo(() => {
    return () => {
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
      idleTimerRef.current = window.setTimeout(() => {
        // Only collapse if not hovered
        setCollapsed(true);
      }, AUTO_COLLAPSE_MS);
    };
  }, []);

  // On mount, schedule initial collapse
  useEffect(() => {
    scheduleCollapse();
    return () => {
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, [scheduleCollapse]);

  // Reset timer whenever hover state changes
  useEffect(() => {
    if (hovered) {
      // Expand and reset timer while hovered
      setCollapsed(false);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    } else {
      // Not hovered -> start/restart idle timer
      scheduleCollapse();
    }
  }, [hovered, scheduleCollapse]);

  const onMouseEnter = () => setHovered(true);
  const onMouseLeave = () => setHovered(false);

  const widthClass = collapsed ? 'w-16' : 'w-64';
  const labelOpacity = collapsed ? 'opacity-0' : 'opacity-100';

  return (
    <aside className={`hidden md:flex ${widthClass} flex-none border-r border-gray-200 bg-white transition-[width] duration-300 ease-in-out overflow-x-hidden overflow-y-visible`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Inner container keeps full expanded width; outer aside clips when collapsed */}
      <div className={`flex flex-col w-64 flex-none h-screen sticky top-0 ${collapsed ? '-ml-1' : ''}`}> 
        <div className={`h-[60px] pl-6 pr-3 border-b border-gray-200 flex items-center justify-between`}>
          <Link href="/" className="flex items-center gap-3 group min-w-0">
            <div className="flex h-6 w-6 flex-none items-center justify-center rounded-md bg-blue-600 text-white font-semibold tracking-tight text-[11px] group-hover:ring-2 group-hover:ring-blue-200 transition">
              tf
            </div>
            <span className={`transition-opacity duration-200 ${labelOpacity} text-sm font-semibold text-gray-900 group-hover:text-blue-700 whitespace-nowrap`}>
              typefirst
            </span>
          </Link>

          {/* Collapse toggler: shown only when expanded */}
          {!collapsed && (
            <button
              type="button"
              aria-label="Collapse sidebar"
              onClick={() => {
                setCollapsed(true);
                if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
              }}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.8} />
            </button>
          )}
        </div>

        <nav className="flex-1 pl-6 pr-3 py-4">
          <ul className="space-y-1">
            <li>
              <Link
                href="/labs"
                className={`group flex w-full items-center gap-3 px-2 py-2 rounded-md text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors`}
                aria-label="Apps"
              >
                <FlaskConical className="h-6 w-6 flex-none shrink-0" strokeWidth={1.8} />
                <span className={`transition-opacity duration-200 ${labelOpacity} text-sm font-medium whitespace-nowrap overflow-hidden`}>Apps</span>
              </Link>
            </li>
            <li>
              <Link
                href="/articles"
                className={`group flex w-full items-center gap-3 px-2 py-2 rounded-md text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors`}
                aria-label="Blog"
              >
                <Newspaper className="h-6 w-6 flex-none shrink-0" strokeWidth={1.8} />
                <span className={`transition-opacity duration-200 ${labelOpacity} text-sm font-medium whitespace-nowrap overflow-hidden`}>Blog</span>
              </Link>
            </li>
            <li>
              <Link
                href="/articles"
                className={`group flex w-full items-center gap-3 px-2 py-2 rounded-md text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors`}
                aria-label="Docs"
              >
                <BookOpen className="h-6 w-6 flex-none shrink-0" strokeWidth={1.8} />
                <span className={`transition-opacity duration-200 ${labelOpacity} text-sm font-medium whitespace-nowrap overflow-hidden`}>Docs</span>
              </Link>
            </li>
            <li>
              <Link
                href="/community"
                className={`group flex w-full items-center gap-3 px-2 py-2 rounded-md text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors`}
                aria-label="Contributors"
              >
                <Users className="h-6 w-6 flex-none shrink-0" strokeWidth={1.8} />
                <span className={`transition-opacity duration-200 ${labelOpacity} text-sm font-medium whitespace-nowrap overflow-hidden`}>Contributors</span>
              </Link>
            </li>
            <li>
              <Link
                href="/community"
                className={`group flex w-full items-center gap-3 px-2 py-2 rounded-md text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors`}
                aria-label="Community"
              >
                <MessageCircle className="h-6 w-6 flex-none shrink-0" strokeWidth={1.8} />
                <span className={`transition-opacity duration-200 ${labelOpacity} text-sm font-medium whitespace-nowrap overflow-hidden`}>Community</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className={`mt-auto pl-6 pr-3 py-3 border-t border-gray-200`}> 
          <AuthProvider>
            <UserNavRow labelOpacity={labelOpacity} />
          </AuthProvider>
        </div>
      </div>
    </aside>
  );
}

function UserNavRow({ labelOpacity }: { labelOpacity: string }) {
  const { data: session, status } = useSessionSafe();
  const user = session?.user as { image?: string | null } | undefined;
  return (
    <button
      type="button"
      onClick={() => { try { signOut(); } catch {} }}
      className="w-full flex items-center gap-3 py-2 rounded-md text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
      aria-label="Sign out"
      title="Sign out"
    >
      {status === 'loading' ? (
        <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse flex-none shrink-0" />
      ) : user?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.image} alt="User" className="h-6 w-6 rounded-full flex-none shrink-0" />
      ) : (
        // Keep a subtle placeholder circle if no image
        <div className="h-6 w-6 rounded-full bg-gray-200 flex-none shrink-0" />
      )}
      <span className={`transition-opacity duration-200 ${labelOpacity} text-sm font-medium whitespace-nowrap overflow-hidden`}>Sign out</span>
    </button>
  );
}
