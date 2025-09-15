/**
 * Section: Generic Components
 */

import React from "react";
import { Section } from "@/modules/articles/ui/section.cmp.iso";
import { Heading } from "@/modules/articles/ui/heading.cmp.iso";
import { Paragraph } from "@/modules/articles/ui/paragraph.cmp.iso";
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
