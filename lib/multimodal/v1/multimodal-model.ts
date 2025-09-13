/**
 * Core multimodal types and utilities
 * This file contains the shared types and interfaces for multimodal components
 */

import React, { JSX, ReactElement, ReactNode } from 'react';

/**
 * Modality type - defines the rendering mode for multimodal components
 * - null: Standard rendering mode (default)
 * - 'markdown': Markdown rendering mode
 * - 'yml': YML serializable object rendering mode
 */
export type Modality = null | 'markdown' | 'yml';

/**
 * Base multimodal props interface
 */
export type MultiModalProps = {
  modality: Modality;
};

/**
 * YML-specific props for tracking indentation
 */
export type YMLProps = {
  indentLevel?: number;
};

/**
 * A modal element - a React element with multimodal props and additional props
 */
/**
 * A modal element - a React element with multimodal props and additional props
 */
export type ModalElement<M extends Modality, P extends object> = ReactElement<ModalProps<M> & P>;

/**
 * Valid modal children - allows multimodal components and basic types
 * Uses never type to exclude elements that don't have required modality prop structure
 */
export type ModalChild<M extends Modality> = Exclude<
  | null 
  | undefined 
  | string 
  | number 
  | boolean 
  | ModalElement<M, object>
  | (ReactElement<any> & { props: { modality: M } }), JSX.IntrinsicElements>

/**
 * Modal props with specific modality and typed children
 */
export type ModalProps<M extends Modality> = {
  modality: M;
  children?: ModalChild<M> | Array<ModalChild<M>>;
} & (M extends 'yml' ? YMLProps : {});

/**
 * Strict modal component types for specific modalities
 */
export type ModalComponent<M extends Modality, P extends object> = (props: ModalProps<M> & P) => ReactNode;
export type StandardModalComponent<P extends object> = (props: ModalProps<null> & P) => ReactNode;
export type MarkdownModalComponent<P extends object> = (props: ModalProps<'markdown'> & P) => ReactNode;
export type YMLModalComponent<P extends object> = (props: ModalProps<'yml'> & P) => string;

/**
 * Multimodal component type - accepts any valid modality
 * This preserves the generic nature of the modality parameter
 */
export type MultiModalComponent<P extends object> = <M extends Modality>(props: ModalProps<M> & P) => ReactNode;

/**
 * Multimodal component factory function
 * If markdown or yml are not provided, the standard component will be used for those modes
 */
export const multimodal = <P extends object>(
    { markdown, yml }: { markdown?: MarkdownModalComponent<P>; yml?: YMLModalComponent<P> } = {}
) => 
<M extends Modality>(standard: (props: ModalProps<M> & P) => ReactNode): MultiModalComponent<P> => {
  const component = <TM extends Modality>(props: ModalProps<TM> & P) => {
    const { modality } = props;
    switch (modality) {
        case null: 
          return standard(props as any);
        case 'markdown': 
          if (markdown) {
            return markdown(props as ModalProps<'markdown'> & P);
          } else {
            return standard(props as any);
          }
        case 'yml':
          if (yml) {
            return yml(props as ModalProps<'yml'> & P);
          } else {
            return standard(props as any);
          }
        default: 
          throw new Error('invalid modality: ' + modality);
    }
  };
  return component;
};

/**
 * Helper function to create modal elements
 */
export const createModalElement = <M extends Modality, P extends object>(
  element: ReactElement<ModalProps<M> & P>
): ModalElement<M, P> => {
  return element as ModalElement<M, P>;
};

/**
 * Base interface for multimodal component props (for backward compatibility)
 * All multimodal components should require an explicit modality
 */
export interface MultimodalProps extends MultiModalProps {}

/**
 * Utility function to check if we're in markdown mode
 */
export function isMarkdownMode(modality: Modality): boolean {
  return modality === 'markdown';
}

/**
 * Utility function to check if we're in standard mode
 */
export function isStandardMode(modality: Modality): boolean {
  return modality === null;
}

/**
 * Utility function to check if we're in YML mode
 */
export function isYMLMode(modality: Modality): boolean {
  return modality === 'yml';
}

/**
 * Type guard for modality
 */
export function isValidModality(value: any): value is Modality {
  return value === null || value === 'markdown' || value === 'yml';
}
