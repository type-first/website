/**
 * Section: Generic Components
 */

import React from "react";
import { Section, Heading, Paragraph } from "@/lib/articles/ui";
import { GenericListCode } from "./snippet.generic-list";

type SectionProps = {};

export const SectionGenericComponents: React.FC<SectionProps> = () => (
  <Section>
    <Heading level={2}>Generic Components</Heading>
    <Paragraph>
      Generic components are one of the most powerful patterns in TypeScript React development. 
      They allow you to create reusable components that work with different data types while 
      maintaining type safety.
    </Paragraph>
    
    <Heading level={3}>Basic Generic Component Pattern</Heading>
    <GenericListCode />
  </Section>
);
