import React from 'react';
import { typeExplorerLabData } from './content.data';
import { 
  LabHeader, 
  LabTitle, 
  LabDescription, 
  LabTags, 
  LabMeta 
} from '@/lib/labs/ui';

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
