/**
 * Section: Generic Components
 */

import React from "react";
import { 
  Section,
  Heading,
  Paragraph,
  type MultiModalComponent,
  multimodal
} from "@/lib/multimodal/v1";
import { GenericListCode } from "./snippet.generic-list";

type SectionProps = {
  // No additional props beyond modality
};

export const SectionGenericComponents: MultiModalComponent<SectionProps> = multimodal<SectionProps>()(({ modality }) => (
  <>
    <Section modality={modality}>
      <Heading level={2} modality={modality}>Generic Components</Heading>
      <Paragraph modality={modality}>
        Generic components are one of the most powerful patterns in TypeScript React development. 
        They allow you to create reusable components that work with different data types while 
        maintaining type safety.
      </Paragraph>
      
      <Heading level={3} modality={modality}>Basic Generic Component Pattern</Heading>
      <GenericListCode modality={modality} />
    </Section>
  </>
));
