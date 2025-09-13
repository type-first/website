/**
 * Multimodal rendering utilities
 * This module provides functions to render multimodal components with specific modalities
 */

import type { Modality, MultiModalComponent } from './multimodal-model';

/**
 * Render a multimodal component with a specific modality
 * This function provides type-safe rendering with proper return type inference
 * 
 * @param Component - The multimodal component to render
 * @param modality - The modality to render with
 * @param props - The component props (excluding modality)
 * @returns The rendered component with the appropriate return type
 */
export function renderMode<
  MMC extends MultiModalComponent<any>,
  M extends Modality,
  P extends Parameters<MMC>[0] extends { modality: any } ? Omit<Parameters<MMC>[0], 'modality'> : never
>(
  Component: MMC,
  modality: M,
  props: P
): M extends 'markdown' ? string : M extends 'yml' ? string : React.ReactNode {
  const componentProps = { ...props, modality } as Parameters<MMC>[0];
  return Component(componentProps) as M extends 'markdown' ? string : M extends 'yml' ? string : React.ReactNode;
}

/**
 * Render a multimodal component in standard mode (for SSR)
 */
export function renderStandard<
  MMC extends MultiModalComponent<any>,
  P extends Parameters<MMC>[0] extends { modality: any } ? Omit<Parameters<MMC>[0], 'modality'> : never
>(
  Component: MMC,
  props: P
): React.ReactNode {
  return renderMode(Component, null, props);
}

/**
 * Render a multimodal component in markdown mode
 */
export function renderMarkdown<
  MMC extends MultiModalComponent<any>,
  P extends Parameters<MMC>[0] extends { modality: any } ? Omit<Parameters<MMC>[0], 'modality'> : never
>(
  Component: MMC,
  props: P
): string {
  return renderMode(Component, 'markdown', props);
}

/**
 * Render a multimodal component in YML mode
 */
export function renderYML<
  MMC extends MultiModalComponent<any>,
  P extends Parameters<MMC>[0] extends { modality: any } ? Omit<Parameters<MMC>[0], 'modality'> : never
>(
  Component: MMC,
  props: P & { indentLevel?: number }
): string {
  return renderMode(Component, 'yml', props);
}

/**
 * Type utility to extract props from a multimodal component (excluding modality)
 */
export type MultiModalComponentProps<MMC extends MultiModalComponent<any>> = 
  Parameters<MMC>[0] extends { modality: any } 
    ? Omit<Parameters<MMC>[0], 'modality'> 
    : never;
