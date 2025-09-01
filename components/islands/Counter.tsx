'use client';

import { useState } from 'react';

interface CounterProps {
  initialValue?: number;
  step?: number;
  label?: string;
}

export function Counter({ initialValue = 0, step = 1, label = 'Counter' }: CounterProps) {
  const [count, setCount] = useState(initialValue);

  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">{label}</h3>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCount(count - step)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          -
        </button>
        <span className="text-2xl font-mono min-w-[3ch] text-center">{count}</span>
        <button
          onClick={() => setCount(count + step)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          +
        </button>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Current value: {count}
      </p>
    </div>
  );
}
