import { redirect } from "next/navigation";
import { typeExplorerLabData } from '@/content/labs/type-explorer/content.data';
import { generateLabMetadata } from '@/modules/labs/metadata.logic';

export const metadata = generateLabMetadata(typeExplorerLabData);

export default function TypeExplorerPage() {
  redirect('/labs/type-explorer/starter');
}
