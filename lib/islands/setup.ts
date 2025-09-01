import { registerIsland } from './registry';
import { Counter } from '../../components/islands/Counter';
import { InteractiveChart } from '../../components/islands/InteractiveChart';
import { CodePlayground } from '../../components/islands/CodePlayground';

// Register all available islands
export function setupIslands() {
  registerIsland(
    'Counter',
    Counter,
    'An interactive counter component that allows incrementing and decrementing a numerical value.',
    { preloadable: true }
  );

  registerIsland(
    'InteractiveChart',
    InteractiveChart,
    'An interactive chart component that displays data visualization with toggle between bar and line chart views.',
    { preloadable: true }
  );

  registerIsland(
    'CodePlayground',
    CodePlayground,
    'An interactive code editor and executor that allows writing and running JavaScript code in the browser.',
    { preloadable: false } // Heavy component, don't preload
  );
}

// Call this in your app initialization
if (typeof window !== 'undefined') {
  setupIslands();
}
