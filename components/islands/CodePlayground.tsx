'use client';

import { useState } from 'react';

interface CodePlaygroundProps {
  defaultCode?: string;
  language?: string;
  title?: string;
}

export function CodePlayground({ 
  defaultCode = 'console.log("Hello, World!");',
  language = 'javascript',
  title = 'Code Playground'
}: CodePlaygroundProps) {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    setOutput('');
    
    // Simulate code execution (in a real app, you'd use a sandboxed environment)
    setTimeout(() => {
      try {
        if (language === 'javascript') {
          // Create a mock console.log that captures output
          const logs: string[] = [];
          const mockConsole = {
            log: (...args: any[]) => logs.push(args.map(arg => String(arg)).join(' '))
          };
          
          // Simple evaluation (NEVER do this in production!)
          const func = new Function('console', code);
          func(mockConsole);
          
          setOutput(logs.join('\n') || 'Code executed successfully (no output)');
        } else {
          setOutput(`Execution for ${language} is not implemented in this demo.`);
        }
      } catch (error) {
        setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      setIsRunning(false);
    }, 1000);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{language}</span>
          <button
            onClick={runCode}
            disabled={isRunning}
            className={`px-4 py-1 text-sm rounded transition-colors ${
              isRunning
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isRunning ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-4 border-r border-gray-300">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Code:
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-48 p-3 font-mono text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Enter your code here..."
          />
        </div>
        
        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Output:
          </label>
          <div className="w-full h-48 p-3 font-mono text-sm bg-gray-50 border border-gray-300 rounded overflow-auto">
            {isRunning ? (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                Executing code...
              </div>
            ) : (
              <pre className="whitespace-pre-wrap">{output || 'No output yet. Click "Run" to execute your code.'}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
