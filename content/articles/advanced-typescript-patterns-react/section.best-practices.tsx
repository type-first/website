/**
 * Section: Best Practices
 */

import React from "react";
import { Section } from "@/modules/articles/ui/section.cmp.iso";
import { Heading } from "@/modules/articles/ui/heading.cmp.iso";
import { Paragraph } from "@/modules/articles/ui/paragraph.cmp.iso";
import { List } from "@/modules/articles/ui/list.cmp.iso";
import { ListItem } from "@/modules/articles/ui/list-item.cmp.iso";
import { Strong } from "@/modules/articles/ui/strong.cmp.iso";

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