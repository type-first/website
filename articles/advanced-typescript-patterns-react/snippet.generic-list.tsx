/**
 * Snippet: Generic List Component
 * Reusable code snippet for generic components
 */

import React from "react";
import { Code } from "@/lib/multimodal/v1/code.mm.srv";
import { type MultiModalComponent, multimodal } from "@/lib/multimodal/v1/multimodal-model";

// Raw snippet string for reuse
export const genericListSnippet = `interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor ? keyExtractor(item, index) : index}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

// Usage example
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

<List 
  items={users}
  keyExtractor={(user) => user.id}
  renderItem={(user) => <span>{user.name}</span>}
/>`;

type GenericListCodeProps = {
  filename?: string;
};

// Full code component for direct use in articles
export const GenericListCode: MultiModalComponent<GenericListCodeProps> = multimodal<GenericListCodeProps>()(({ modality, filename }) => (
  <Code language="typescript" filename={filename || "components/GenericList.tsx"} modality={modality}>
    {genericListSnippet}
  </Code>
));
