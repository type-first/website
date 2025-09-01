'use client';

import { useState } from 'react';

interface InteractiveChartProps {
  data?: Array<{ label: string; value: number }>;
  title?: string;
  type?: 'bar' | 'line';
}

const defaultData = [
  { label: 'Jan', value: 65 },
  { label: 'Feb', value: 59 },
  { label: 'Mar', value: 80 },
  { label: 'Apr', value: 81 },
  { label: 'May', value: 56 },
  { label: 'Jun', value: 55 },
];

export function InteractiveChart({ 
  data = defaultData, 
  title = 'Sample Chart',
  type = 'bar'
}: InteractiveChartProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [chartType, setChartType] = useState(type);

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 text-sm rounded ${
              chartType === 'bar' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Bar
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 text-sm rounded ${
              chartType === 'line' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Line
          </button>
        </div>
      </div>

      <div className="h-64 flex items-end gap-2 mb-4">
        {data.map((item, index) => {
          const height = (item.value / maxValue) * 100;
          const isSelected = selectedIndex === index;
          
          if (chartType === 'bar') {
            return (
              <div key={item.label} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full transition-all duration-200 cursor-pointer rounded-t ${
                    isSelected 
                      ? 'bg-blue-600' 
                      : 'bg-blue-400 hover:bg-blue-500'
                  }`}
                  style={{ height: `${height}%` }}
                  onClick={() => setSelectedIndex(index)}
                  title={`${item.label}: ${item.value}`}
                />
                <span className="text-xs text-gray-600 mt-1">{item.label}</span>
              </div>
            );
          } else {
            // Simple line chart representation
            return (
              <div key={item.label} className="flex-1 flex flex-col items-center relative">
                <div className="w-full relative" style={{ height: '200px' }}>
                  <div
                    className={`absolute bottom-0 w-3 h-3 rounded-full cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-blue-600 scale-125' 
                        : 'bg-blue-400 hover:bg-blue-500'
                    }`}
                    style={{ bottom: `${height}%`, left: '50%', transform: 'translateX(-50%)' }}
                    onClick={() => setSelectedIndex(index)}
                    title={`${item.label}: ${item.value}`}
                  />
                </div>
                <span className="text-xs text-gray-600 mt-1">{item.label}</span>
              </div>
            );
          }
        })}
      </div>

      {selectedIndex !== null && (
        <div className="p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm">
            <strong>{data[selectedIndex].label}:</strong> {data[selectedIndex].value}
          </p>
        </div>
      )}
    </div>
  );
}
