/**
 * Section: Type-Safe APIs
 */

import React from "react";
import { 
  Section,
  Heading,
  Paragraph,
  type MultiModalComponent,
  multimodal
} from "@/lib/multimodal/v1";
import { ApiClientCode } from "./snippet.api-client";

type SectionProps = {
  // No additional props beyond modality
};

export const SectionTypeSafeApis: MultiModalComponent<SectionProps> = multimodal<SectionProps>()(({ modality }) => (
  <>
    <Section modality={modality}>
      <Heading level={2} modality={modality}>Type-Safe APIs</Heading>
      <Paragraph modality={modality}>
        Creating type-safe APIs involves using TypeScript's type system to ensure that your 
        API calls are correct at compile time.
      </Paragraph>
      
      <Heading level={3} modality={modality}>API Client Pattern</Heading>
      <ApiClientCode modality={modality} />
    </Section>
  </>
));
