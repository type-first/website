import React from 'react';
import { searchTestLabData } from './content.data';
import { LabHeader } from '@/modules/labs/ui/lab-header.cmp.iso';
import { LabTitle } from '@/modules/labs/ui/lab-title.cmp.iso';
import { LabDescription } from '@/modules/labs/ui/lab-description.cmp.iso';
import { LabTags } from '@/modules/labs/ui/lab-tags.cmp.iso';
import { LabMeta } from '@/modules/labs/ui/lab-meta.cmp.iso';

export default function SearchTestLabIntro() {
  return (
    <LabHeader>
      <LabTitle>{searchTestLabData.title}</LabTitle>
      <LabDescription>{searchTestLabData.description}</LabDescription>
      <LabMeta 
        addedAt={searchTestLabData.addedAt}
        status={searchTestLabData.status}
        className="mt-3"
      />
      <LabTags tags={searchTestLabData.tags} />
    </LabHeader>
  );
}
