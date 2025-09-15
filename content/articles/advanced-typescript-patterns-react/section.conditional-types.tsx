/**
 * Section: Conditional Types in Components
 */

import React from "react";
import { Section, Heading, Paragraph } from "@/lib/articles/ui";
import { ConditionalButtonCode } from "./snippet.conditional-button";

type SectionProps = {
  // Simple props without modality
};

export const SectionConditionalTypes: React.FC<SectionProps> = () => (
  <Section>
    <Heading level={2}>Conditional Types in Components</Heading>
    <Paragraph>
      Conditional types allow you to create components that adapt their behavior based on 
      their props, enabling powerful type-driven patterns.
    </Paragraph>
    
    <Heading level={3}>Advanced Conditional Type Example</Heading>
    <ConditionalButtonCode />
  </Section>
);
