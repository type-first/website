'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import AuthProvider, { useSessionSafe } from '@/modules/auth/components/auth-provider';
import { signOut } from 'next-auth/react';
import { ChevronLeft, FlaskConical, Newspaper, BookOpen, Users, MessageCircle } from 'lucide-react';

const AUTO_COLLAPSE_MS = 5_000; // 5 seconds

export default function NavSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showCollapseButton, setShowCollapseButton] = useState(true);
  const idleTimerRef = useRef<number | null>(null);

  // Start an idle timer that collapses the sidebar after inactivity
  const scheduleCollapse = useMemo(() => {
    return () => {
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
      idleTimerRef.current = window.setTimeout(() => {
        setCollapsed(true);
        setShowCollapseButton(false);
      }, AUTO_COLLAPSE_MS);
    };
  }, []);

  // Clear timer when hovered, expand if collapsed
  useEffect(() => {
    if (hovered) {
      // Clear any pending collapse timer
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
      
      // If collapsed, expand the sidebar
      if (collapsed) {
        setCollapsed(false);
        // Delay showing collapse button until transition completes
        setTimeout(() => setShowCollapseButton(true), 300);
      }
    }
  }, [hovered, collapsed]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, []);

  const onMouseEnter = () => setHovered(true);
  const onMouseLeave = () => {
    setHovered(false);
    // Start the 5-second auto-collapse timer when cursor leaves
    scheduleCollapse();
  };

  // Layout constants
  const SQUARE_SIZE = 16;        // 64px - larger squares for better visual presence
  const EXPANDED_W = 'w-64';     // expanded sidebar width
  const COLLAPSED_W = 'w-16';    // collapsed width matches larger squares
  
  const widthClass = collapsed ? COLLAPSED_W : EXPANDED_W;
  const labelOpacity = collapsed ? 'opacity-0' : 'opacity-100';
  const labelVisibility = collapsed ? 'invisible' : 'visible';
  const labelTransition = 'transition-all duration-300 ease-in-out';

  // Row styles: consistent square layout
  const ROW_BASE = `group flex items-center h-14 transition-colors select-none cursor-pointer`;
  const ROW_COLORS = 'text-gray-700 hover:text-blue-700 hover:bg-gray-50';
  const ROW_PADDING = collapsed ? '' : '';
  const LINK_ROW = `${ROW_BASE} ${ROW_COLORS} ${ROW_PADDING}`;
  const BUTTON_ROW = `${ROW_BASE} ${ROW_COLORS} ${ROW_PADDING}`;

  return (
    <aside className={`hidden md:flex ${widthClass} flex-none border-r border-gray-200 bg-white transition-[width] duration-300 ease-in-out overflow-hidden`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Inner container matches the sidebar width */}
      <div className={`flex flex-col ${widthClass} flex-none h-screen sticky top-0 transition-[width] duration-300 ease-in-out`}> 
        <div className="h-15 flex items-center border-b border-gray-200 relative">
          {/* Logo - always positioned consistently */}
          <div className="w-16 h-14 flex items-center justify-center flex-none">
            <Link href="/" className="flex items-center justify-center group">
              <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-blue-600 text-white font-semibold tracking-tight text-sm group-hover:ring-2 group-hover:ring-blue-200 transition">
                tf
              </div>
            </Link>
          </div>

          {/* Expandable content */}
          {!collapsed && (
            <div className={`flex-1 flex items-center justify-between ${labelTransition} ${labelOpacity}`}>
              <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                typefirst
              </span>
              
              {showCollapseButton && (
                <button
                  type="button"
                  aria-label="Collapse sidebar"
                  onClick={() => {
                    setCollapsed(true);
                    setShowCollapseButton(false);
                    // Clear any pending auto-collapse timer since we're manually collapsing
                    if (idleTimerRef.current) {
                      window.clearTimeout(idleTimerRef.current);
                      idleTimerRef.current = null;
                    }
                  }}
                  className="p-2 m-2 rounded-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-opacity duration-150"
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={1.8} />
                </button>
              )}
            </div>
          )}
        </div>
        <nav className="flex-1">
          <ul className={''}>
            <li>
              <Link
                href="/labs"
                className={LINK_ROW}
                aria-label="Apps"
              >
                <div className="w-16 h-14 flex items-center justify-center flex-none">
                  <FlaskConical className="h-6 w-6 text-current" strokeWidth={1.8} />
                </div>
                {!collapsed && (
                  <div className={`flex-1 h-14 flex items-center ${labelTransition} ${labelOpacity} ${labelVisibility}`}>
                    Apps
                  </div>
                )}
              </Link>
            </li>

            <li>
              <Link
                href="/articles"
                className={LINK_ROW}
                aria-label="Blog"
              >
                <div className="w-16 h-14 flex items-center justify-center flex-none">
                  <Newspaper className="h-6 w-6 text-current" strokeWidth={1.8} />
                </div>
                {!collapsed && (
                  <div className={`flex-1 h-14 flex items-center ${labelTransition} ${labelOpacity} ${labelVisibility}`}>
                    Blog
                  </div>
                )}
              </Link>
            </li>

            <li>
              <Link
                href="/articles"
                className={LINK_ROW}
                aria-label="Docs"
              >
                <div className="w-16 h-14 flex items-center justify-center flex-none">
                  <BookOpen className="h-6 w-6 text-current" strokeWidth={1.8} />
                </div>
                {!collapsed && (
                  <div className={`flex-1 h-14 flex items-center ${labelTransition} ${labelOpacity} ${labelVisibility}`}>
                    Docs
                  </div>
                )}
              </Link>
            </li>

            <li>
              <Link
                href="/community"
                className={LINK_ROW}
                aria-label="Contributors"
              >
                <div className="w-16 h-14 flex items-center justify-center flex-none">
                  <Users className="h-6 w-6 text-current" strokeWidth={1.8} />
                </div>
                {!collapsed && (
                  <div className={`flex-1 h-14 flex items-center ${labelTransition} ${labelOpacity} ${labelVisibility}`}>
                    Contributors
                  </div>
                )}
              </Link>
            </li>

            <li>
              <Link
                href="/community"
                className={LINK_ROW}
                aria-label="Community"
              >
                <div className="w-16 h-14 flex items-center justify-center flex-none">
                  <MessageCircle className="h-6 w-6 text-current" strokeWidth={1.8} />
                </div>
                {!collapsed && (
                  <div className={`flex-1 h-14 flex items-center ${labelTransition} ${labelOpacity} ${labelVisibility}`}>
                    Community
                  </div>
                )}
              </Link>
            </li>
          </ul>
        </nav>
        <div className={`mt-auto border-t border-gray-200`}> 
          <AuthProvider>
            <UserNavRow 
              collapsed={collapsed}
              labelOpacity={labelOpacity} 
              labelVisibility={labelVisibility}
              labelTransition={labelTransition}
              BUTTON_ROW={BUTTON_ROW} 
            />
          </AuthProvider>
        </div>
      </div>
    </aside>
  );
}

function UserNavRow({ 
  collapsed, 
  labelOpacity, 
  labelVisibility,
  labelTransition,
  BUTTON_ROW 
}: { 
  collapsed: boolean;
  labelOpacity: string; 
  labelVisibility: string;
  labelTransition: string;
  BUTTON_ROW: string; 
}) {
  const { data: session, status } = useSessionSafe();
  const user = session?.user as { image?: string | null } | undefined;
  return (
    <button
      type="button"
      onClick={() => { 
        try { 
          // Try to use NextAuth signOut if available
          if (typeof signOut === 'function') {
            signOut(); 
          } else {
            console.log('SignOut not available');
          }
        } catch (e) {
          console.log('SignOut failed:', e);
        }
      }}
      className={BUTTON_ROW}
      aria-label="Sign out"
      title="Sign out"
    >
      <div className="w-16 h-14 flex items-center justify-center flex-none">
        {status === 'loading' ? (
          <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
        ) : user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt="User" className="h-8 w-8 rounded-full" />
        ) : (
          // Keep a subtle placeholder circle if no image
          <div className="h-8 w-8 rounded-full bg-gray-200" />
        )}
      </div>
      {!collapsed && (
        <span className={`flex-1 h-14 flex items-center ${labelTransition} ${labelOpacity} ${labelVisibility}`}>
          Sign out
        </span>
      )}
    </button>
  );
}
