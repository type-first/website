/**
 * Footer for Advanced TypeScript Patterns article
 */

import React from "react";
import { 
  Section,
  Heading,
  Paragraph,
  type MultiModalComponent,
  multimodal
} from "@/lib/multimodal/v1";

type FooterProps = {
  // No additional props beyond modality
};

export const ArticleFooter: MultiModalComponent<FooterProps> = multimodal<FooterProps>()(({ modality }) => (
  <>
    <Section modality={modality}>
      <Heading level={2} modality={modality}>Conclusion</Heading>
      <Paragraph modality={modality}>
        Advanced TypeScript patterns provide the foundation for building robust, maintainable 
        React applications. By mastering these patterns, you'll create code that is not only 
        type-safe but also self-documenting and easier to refactor.
      </Paragraph>
    </Section>
  </>
));
