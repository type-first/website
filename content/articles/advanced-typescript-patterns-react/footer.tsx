/**
 * Footer for Advanced TypeScript Patterns article
 */

import React from "react";
import { Section } from "@/modules/articles/ui/section.cmp.iso";
import { Heading } from "@/modules/articles/ui/heading.cmp.iso";
import { Paragraph } from "@/modules/articles/ui/paragraph.cmp.iso";

type FooterProps = {};

export const ArticleFooter: React.FC<FooterProps> = () => (
  <Section>
    <Heading level={2}>Conclusion</Heading>
    <Paragraph>
      Advanced TypeScript patterns provide the foundation for building robust, maintainable 
      React applications. By mastering these patterns, you'll create code that is not only 
      type-safe but also self-documenting and easier to refactor.
    </Paragraph>
  </Section>
);
