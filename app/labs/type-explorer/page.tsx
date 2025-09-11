import { redirect } from "next/navigation";

export const metadata = {
  title: "Type Explorer",
  description: "Starter preset: minimal multi-file TypeScript editor.",
};

export default function TypeExplorerPage() {
  redirect('/labs/type-explorer/scenarios/starter');
}
