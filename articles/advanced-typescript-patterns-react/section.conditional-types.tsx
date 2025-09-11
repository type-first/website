/**
 * Section: Conditional Types in Components
 */

import React from "react";
import { 
  Section,
  Heading,
  Paragraph,
  type MultiModalComponent,
  multimodal
} from "@/lib/multimodal/v1";
import { ConditionalButtonCode } from "./snippet.conditional-button";

type SectionProps = {
  // No additional props beyond modality
};

export const SectionConditionalTypes: MultiModalComponent<SectionProps> = multimodal<SectionProps>()(({ modality }) => (
  <>
    <Section modality={modality}>
      <Heading level={2} modality={modality}>Conditional Types in Components</Heading>
      <Paragraph modality={modality}>
        Conditional types allow you to create components that adapt their behavior based on 
        their props, enabling powerful type-driven patterns.
      </Paragraph>
      
      <Heading level={3} modality={modality}>Advanced Conditional Type Example</Heading>
      <ConditionalButtonCode modality={modality} />
    </Section>
  </>
));
