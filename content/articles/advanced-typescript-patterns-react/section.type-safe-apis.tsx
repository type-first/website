/**
 * Section: Type-Safe APIs
 */

import React from "react";
import { Section } from "@/modules/articles/ui/section.cmp.iso";
import { Heading } from "@/modules/articles/ui/heading.cmp.iso";
import { Paragraph } from "@/modules/articles/ui/paragraph.cmp.iso";
import { ApiClientCode } from "./snippet.api-client";

type SectionProps = {};

export const SectionTypeSafeApis: React.FC<SectionProps> = () => (
  <Section>
    <Heading level={2}>Type-Safe APIs</Heading>
    <Paragraph>
      Creating type-safe APIs involves using TypeScript's type system to ensure that your 
      API calls are correct at compile time.
    </Paragraph>
    
    <Heading level={3}>API Client Pattern</Heading>
    <ApiClientCode />
  </Section>
);
