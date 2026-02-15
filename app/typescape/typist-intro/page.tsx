import { TypescapePlayground } from "@/modules/playground/typescape-playground.cmp.srv"
import { typistIntroScenario } from '@/content/typescape/typist-intro/meta';

export const metadata = {
  title: `${typistIntroScenario.name} - TypeScript Scenario`,
  description: typistIntroScenario.blurb,
};

export default function TypistIntroPage() {
  return <TypescapePlayground scenarioId="typist-intro" />
}