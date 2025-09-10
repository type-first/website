'use client';

import { useState } from 'react';

interface ComparisonCounterProps {
  initialValue?: number;
  label?: string;
}

export default function ComparisonCounter({ 
  initialValue = 0, 
  label = "Interactions" 
}: ComparisonCounterProps) {
  const [count, setCount] = useState(initialValue);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 my-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Interactive Component Demo
      </h3>
      
      <div className="flex items-center gap-4">
        <span className="text-gray-700">{label}:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCount(count - 1)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            -
          </button>
          
          <span className="text-2xl font-bold text-blue-600 min-w-[3rem] text-center">
            {count}
          </span>
          
          <button
            onClick={() => setCount(count + 1)}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            +
          </button>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mt-3">
        This component is defined in the same directory as the article, demonstrating 
        how islands can be co-located with their content for better organization.
      </p>
    </div>
  );
}
