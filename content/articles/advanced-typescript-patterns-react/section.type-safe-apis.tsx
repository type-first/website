/**
 * Section: Type-Safe APIs
 */

import React from "react";
import { Section, Heading, Paragraph } from "@/lib/articles/ui";
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
