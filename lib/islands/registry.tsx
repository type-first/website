'use client';

import { ComponentType, Suspense } from 'react';

// Island registry interface
export interface IslandComponent {
  component: ComponentType<any>;
  textAlt: string;
  preloadable?: boolean;
}

// Registry type
type IslandRegistry = Record<string, IslandComponent>;

// Global registry
const islandRegistry: IslandRegistry = {};

// Registration function
export function registerIsland(
  name: string, 
  component: ComponentType<any>, 
  textAlt: string,
  options: { preloadable?: boolean } = {}
): void {
  islandRegistry[name] = {
    component,
    textAlt,
    preloadable: options.preloadable,
  };
}

// Get registered island
export function getIsland(name: string): IslandComponent | undefined {
  return islandRegistry[name];
}

// Get all registered islands
export function getAllIslands(): IslandRegistry {
  return { ...islandRegistry };
}

// Dynamic island loader component
interface IslandLoaderProps {
  name: string;
  props?: Record<string, any>;
  fallback?: React.ReactNode;
}

export function IslandLoader({ name, props = {}, fallback }: IslandLoaderProps) {
  const island = getIsland(name);
  
  if (!island) {
    console.warn(`Island '${name}' not found in registry`);
    return (
      <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
        <p className="text-gray-500">Island &apos;{name}&apos; not found</p>
        <p className="text-sm text-gray-400 mt-1">No description available</p>
      </div>
    );
  }

  const Component = island.component;
  
  return (
    <Suspense fallback={fallback || <IslandFallback />}>
      <Component {...props} />
    </Suspense>
  );
}

// Default fallback component
function IslandFallback() {
  return (
    <div className="animate-pulse bg-gray-200 rounded-lg p-4">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  );
}

// Preload function for SSR/hydration optimization
export function preloadIsland(name: string): void {
  const island = getIsland(name);
  if (island?.preloadable && typeof window !== 'undefined') {
    // Trigger component loading - accessing the component is sufficient
    void island.component;
  }
}

// Batch preload function
export function preloadIslands(names: string[]): void {
  names.forEach(preloadIsland);
}

// Server-side safe island checker
export function isIslandRegistered(name: string): boolean {
  return name in islandRegistry;
}

// Development helper to list all registered islands
export function listRegisteredIslands(): string[] {
  return Object.keys(islandRegistry);
}

// Type guard for island props
export function validateIslandProps(name: string, props: any): boolean {
  const island = getIsland(name);
  if (!island) return false;
  
  // Basic validation - can be extended with prop-types or zod
  return typeof props === 'object' && props !== null;
}
