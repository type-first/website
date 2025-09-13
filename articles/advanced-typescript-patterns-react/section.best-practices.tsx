/**
 * Section: Best Practices
 */

import React from "react";
import { Section } from "@/lib/multimodal/v1/section.mm.srv";
import { Heading } from "@/lib/multimodal/v1/heading.mm.srv";
import { Paragraph } from "@/lib/multimodal/v1/paragraph.mm.srv";
import { List, ListItem } from "@/lib/multimodal/v1/list.mm.srv";
import { Strong } from "@/lib/multimodal/v1/strong.mm.srv";
import { type MultiModalComponent, multimodal } from "@/lib/multimodal/v1/multimodal-model";

type SectionProps = {
  // No additional props beyond modality
};

export const SectionBestPractices: MultiModalComponent<SectionProps> = multimodal<SectionProps>()(({ modality:m }) => (
  <>
    <Section modality={m}>
      <Heading level={2} modality={m}>Best Practices</Heading>
      <List modality={m}>
        <ListItem modality={m}>
          <Paragraph modality={null}>Use strict TypeScript configuration</Paragraph> - Enable all strict type checking options
        </ListItem>
        <ListItem modality={m}>
          <Strong modality={m}>Leverage type inference</Strong> - Let TypeScript infer types when possible
        </ListItem>
        <ListItem modality={m}>
          <Strong modality={m}>Create reusable type utilities</Strong> - Build a library of common type patterns
        </ListItem>
        <ListItem modality={m}>
          <Strong modality={m}>Use branded types</Strong> - Create distinct types for similar data structures
        </ListItem>
        <ListItem modality={m}>
          <Strong modality={m}>Implement proper error boundaries</Strong> - Handle errors at the type level
        </ListItem>
      </List>
    </Section>
  </>
));