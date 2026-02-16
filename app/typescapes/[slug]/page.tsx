import { Typescape } from '@/modules/typescapes/typescape.cmp.srv'

export default async function TypistTupleManipulationPage
  ( props:{ params: Promise<{ slug:string }> } ) 
  { const { slug } = await props.params
    return <Typescape slug={slug}/> }