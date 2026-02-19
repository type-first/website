"use client";

import { useState } from 'react';
import { openAuthPopup } from '../utils/popup';

export default function AuthPopupButtons() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={() => openAuthPopup(
          () => setIsAuthenticating(false), // onSuccess
          () => setIsAuthenticating(true)   // onStart
        )} 
        className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
        disabled={isAuthenticating}
      >
        {isAuthenticating ? 'Signing in...' : 'Sign in with GitHub'}
      </button>
    </div>
  );
}
