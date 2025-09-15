import React from 'react';
import { typeExplorerLabData } from './content.data';
import { LabHeader } from '@/modules/labs/ui/lab-header.cmp.iso';
import { LabTitle } from '@/modules/labs/ui/lab-title.cmp.iso';
import { LabDescription } from '@/modules/labs/ui/lab-description.cmp.iso';
import { LabTags } from '@/modules/labs/ui/lab-tags.cmp.iso';
import { LabMeta } from '@/modules/labs/ui/lab-meta.cmp.iso';

export default function TypeExplorerLabIntro() {
  return (
    <LabHeader>
      <LabTitle>{typeExplorerLabData.title}</LabTitle>
      <LabDescription>{typeExplorerLabData.description}</LabDescription>
      <LabMeta 
        addedAt={typeExplorerLabData.addedAt}
        status={typeExplorerLabData.status}
        className="mt-3"
      />
      <LabTags tags={typeExplorerLabData.tags} />
    </LabHeader>
  );
}
