/**
 * Section: Best Practices
 */

import React from "react";
import { Section, Heading, Paragraph, List, ListItem, Strong } from "@/lib/articles/ui";

type SectionProps = {};

export const SectionBestPractices: React.FC<SectionProps> = () => (
  <Section>
    <Heading level={2}>Best Practices</Heading>
    <List>
      <ListItem>
        <Strong>Use strict TypeScript configuration</Strong> - Enable all strict type checking options
      </ListItem>
      <ListItem>
        <Strong>Leverage type inference</Strong> - Let TypeScript infer types when possible
      </ListItem>
      <ListItem>
        <Strong>Create reusable type utilities</Strong> - Build a library of common type patterns
      </ListItem>
      <ListItem>
        <Strong>Use branded types</Strong> - Create distinct types for similar data structures
      </ListItem>
      <ListItem>
        <Strong>Implement proper error boundaries</Strong> - Handle errors at the type level
      </ListItem>
    </List>
  </Section>
);