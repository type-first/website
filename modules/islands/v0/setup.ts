import { registerIsland } from './registry';

// Register all available islands
export function setupIslands() {
  // All previous island components (Counter, InteractiveChart, CodePlayground) 
  // have been removed as they are obsolete.
  // TypeExplorer is now the primary interactive component.
}

// Call this in your app initialization
if (typeof window !== 'undefined') {
  setupIslands();
}
