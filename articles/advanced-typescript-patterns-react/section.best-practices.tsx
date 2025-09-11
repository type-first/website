/**
 * Section: Best Practices
 */

import React from "react";
import { 
  Section,
  Heading,
  Paragraph,
  List,
  ListItem,
  type MultiModalComponent,
  multimodal
} from "@/lib/multimodal/v1";

type SectionProps = {
  // No additional props beyond modality
};

export const SectionBestPractices: MultiModalComponent<SectionProps> = multimodal<SectionProps>()(({ modality }) => (
  <>
    <Section modality={modality}>
      <Heading level={2} modality={modality}>Best Practices</Heading>
      <List modality={modality}>
        <ListItem modality={modality}>
          <strong>Use strict TypeScript configuration</strong> - Enable all strict type checking options
        </ListItem>
        <ListItem modality={modality}>
          <strong>Leverage type inference</strong> - Let TypeScript infer types when possible
        </ListItem>
        <ListItem modality={modality}>
          <strong>Create reusable type utilities</strong> - Build a library of common type patterns
        </ListItem>
        <ListItem modality={modality}>
          <strong>Use branded types</strong> - Create distinct types for similar data structures
        </ListItem>
        <ListItem modality={modality}>
          <strong>Implement proper error boundaries</strong> - Handle errors at the type level
        </ListItem>
      </List>
    </Section>
  </>
));
