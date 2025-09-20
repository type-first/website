'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import AuthProvider, { useSessionSafe } from '@/modules/auth/components/auth-provider';
import { signOut } from 'next-auth/react';
import { FlaskConical, Newspaper, BookOpen, MessageCircle, Github, LogIn } from 'lucide-react';
import { openAuthPopup } from '@/modules/auth/utils/popup';

const AUTO_COLLAPSE_MS = 1_000; // 1 second

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
        setCollapsed(true);
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
    <aside className={`hidden md:flex ${widthClass} flex-none border-r border-gray-200 bg-white transition-[width] duration-300 ease-in-out overflow-hidden sticky top-0 self-start h-screen`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Inner container matches the sidebar width */}
      <div className={`flex flex-col ${widthClass} flex-none h-full transition-[width] duration-300 ease-in-out`}> 
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
            <div className={`flex-1 flex items-center ${labelTransition} ${labelOpacity}`}>
              <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                typefirst
              </span>
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
                href="/docs"
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

            <li>
              <Link
                href="/articles"
                className={LINK_ROW}
                aria-label="Articles"
              >
                <div className="w-16 h-14 flex items-center justify-center flex-none">
                  <Newspaper className="h-6 w-6 text-current" strokeWidth={1.8} />
                </div>
                {!collapsed && (
                  <div className={`flex-1 h-14 flex items-center ${labelTransition} ${labelOpacity} ${labelVisibility}`}>
                    Articles
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
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Show loading state
  if (status === 'loading' || isAuthenticating) {
    return (
      <div className={BUTTON_ROW.replace('cursor-pointer hover:bg-gray-50', 'cursor-default')}>
        <div className="w-16 h-14 flex items-center justify-center flex-none">
          <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
        </div>
        {!collapsed && (
          <span className={`flex-1 h-14 flex items-center ${labelTransition} ${labelOpacity} ${labelVisibility}`}>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          </span>
        )}
      </div>
    );
  }

  // If user is logged in, show sign out button
  if (user) {
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
          {user?.image ? (
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

  // If user is not logged in, show login button with GitHub icon
  return (
    <button
      type="button"
      onClick={() => {
        try {
          openAuthPopup(
            () => setIsAuthenticating(false), // onSuccess callback
            () => setIsAuthenticating(true)   // onStart callback
          );
        } catch (e) {
          console.log('Login failed:', e);
          setIsAuthenticating(false);
        }
      }}
      className={BUTTON_ROW}
      aria-label="Log in"
      title="Log in with GitHub"
      disabled={isAuthenticating}
    >
      <div className="w-16 h-14 flex items-center justify-center flex-none">
        <Github className="h-6 w-6 text-gray-600" strokeWidth={1.8} />
      </div>
      {!collapsed && (
        <span className={`flex-1 h-14 flex items-center ${labelTransition} ${labelOpacity} ${labelVisibility}`}>
          Log in
        </span>
      )}
    </button>
  );
}
