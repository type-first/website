"use client";

import { openAuthPopup } from '../utils/popup';

export default function AuthPopupButtons() {

  return (
    <div className="flex items-center gap-3">
      <button onClick={() => openAuthPopup()} className="text-sm text-gray-600 hover:text-gray-900">
        Sign in with GitHub
      </button>
    </div>
  );
}
