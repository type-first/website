/**
 * Core multimodal types and utilities
 * This file contains the shared types and interfaces for multimodal components
 */

import React, { ReactElement, ReactNode } from 'react';

/**
 * Modality type - defines the rendering mode for multimodal components
 * - null: Standard rendering mode (default)
 * - 'markdown': Markdown rendering mode
 */
export type Modality = null | 'markdown';

/**
 * Base multimodal props interface
 */
export type MultiModalProps = {
  modality: Modality;
};

/**
 * A modal element - a React element with multimodal props and additional props
 */
export type ModalElement<M extends Modality, P extends object> = ReactElement<MultiModalProps & P>;

/**
 * Valid modal children - basic types plus modal elements
 */
export type ModalChild<M extends Modality> = null | undefined | string | number | boolean | ModalElement<M, object>;

/**
 * Modal props with specific modality and typed children
 */
export type ModalProps<M extends Modality> = MultiModalProps & {
  modality: M;
  children?: ModalChild<M> | Array<ModalChild<M>>;
};

/**
 * Strict modal component types for specific modalities
 */
export type ModalComponent<M extends Modality, P extends object> = (props: ModalProps<M> & P) => ReactNode;
export type StandardModalComponent<P extends object> = (props: ModalProps<null> & P) => ReactNode;
export type MarkdownModalComponent<P extends object> = (props: ModalProps<'markdown'> & P) => ReactNode;
/**
 * Multimodal component type with proper overloads
 */
export type MultiModalComponent<P extends object> = {
  (props: ModalProps<null> & P): ReactNode;
  (props: ModalProps<'markdown'> & P): ReactNode;
  (props: ModalProps<Modality> & P): ReactNode;
};

/**
 * Multimodal component factory function
 * If markdown is not provided, the standard component will be used for both modes
 */
export const multimodal = <P extends object>(
    { markdown }: { markdown?: MarkdownModalComponent<P> } = {}
) => 
(standard: StandardModalComponent<P>): MultiModalComponent<P> => {
  const component = (props: ModalProps<Modality> & P) => {
    const { modality } = props;
    switch (modality) {
        case null: return standard(props as ModalProps<null> & P);
        case 'markdown': 
          if (markdown) {
            return markdown(props as ModalProps<'markdown'> & P);
          } else {
            // Use standard component but with markdown modality passed down
            return standard({ ...props, modality: 'markdown' } as ModalProps<null> & P);
          }
        default: throw new Error('invalid modality: ' + modality);
    }
  };
  return component as MultiModalComponent<P>;
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
 * Type guard for modality
 */
export function isValidModality(value: any): value is Modality {
  return value === null || value === 'markdown';
}
