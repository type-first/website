import React from 'react';
import { searchTestLabData } from './content.data';
import { 
  LabHeader, 
  LabTitle, 
  LabDescription, 
  LabTags, 
  LabMeta 
} from '@/lib/labs/ui';

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
