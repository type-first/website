/**
 * Section: Conditional Types in Components
 */

import React from "react";
import { Section } from "@/modules/articles/ui/section.cmp.iso";
import { Heading } from "@/modules/articles/ui/heading.cmp.iso";
import { Paragraph } from "@/modules/articles/ui/paragraph.cmp.iso";
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
