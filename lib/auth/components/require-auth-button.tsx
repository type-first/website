"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { openAuthPopup } from '../utils';

export default function RequireAuthButton({
  isAuthed,
  href,
  onAuthedClick,
  className = '',
  children,
}: {
  isAuthed: boolean;
  href?: string;
  onAuthedClick?: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (!isAuthed) return openAuthPopup();
        if (href) return router.push(href);
        onAuthedClick?.();
      }}
    >
      {children}
    </button>
  );
}
