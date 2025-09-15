/**
 * Snippet: Conditional Button Component
 * Advanced conditional type pattern for components
 */

import React from "react";
import { Code } from "@/modules/articles/ui/code.cmp.iso";

// Raw snippet string for reuse
export const conditionalButtonSnippet = `type ButtonVariant = 'button' | 'link' | 'submit';

type ButtonProps<T extends ButtonVariant> = {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
} & (T extends 'link' 
  ? { 
      variant: 'link'; 
      href: string; 
      onClick?: never;
      type?: never;
    }
  : T extends 'submit'
  ? {
      variant: 'submit';
      type: 'submit';
      onClick?: () => void;
      href?: never;
    }
  : {
      variant: 'button';
      onClick: () => void;
      href?: never;
      type?: never;
    }
);

function Button<T extends ButtonVariant>(props: ButtonProps<T>) {
  const baseClasses = \`btn \${props.className || ''}\`;
  
  if (props.variant === 'link') {
    return (
      <a 
        href={props.href} 
        className={baseClasses}
        aria-disabled={props.disabled}
      >
        {props.children}
      </a>
    );
  }
  
  return (
    <button
      type={props.variant === 'submit' ? 'submit' : 'button'}
      onClick={props.onClick}
      disabled={props.disabled}
      className={baseClasses}
    >
      {props.children}
    </button>
  );
}

// Usage examples - all type-safe!
<Button variant="button" onClick={() => alert('clicked')}>
  Click me
</Button>

<Button variant="link" href="/about">
  Go to About
</Button>

<Button variant="submit">
  Submit Form
</Button>`;

type ConditionalButtonCodeProps = {
  filename?: string;
};

// Full code component for direct use in articles
export const ConditionalButtonCode: React.FC<ConditionalButtonCodeProps> = ({ filename }) => (
  <Code language="typescript">
    {conditionalButtonSnippet}
  </Code>
);
