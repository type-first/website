import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { buildDocNavigation } from '@/lib/content/doc.model';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { Code } from '@/lib/content/ui/code.cmp.iso';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata() {
  return {
    title: 'Typist Guide - Interactive Tutorial',
    description: 'Step-by-step guide to mastering typist with practical examples and type-level programming concepts.',
  };
}

export default function TypistGuidePage() {
  const library = getDocLibraryBySlug('typist');
  
  if (!library) {
    notFound();
  }

  const navigationPages = buildDocNavigation(library.pages);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              {library.name}
            </h3>
            <DocSidebar 
              librarySlug={library.slug} 
              pages={navigationPages}
            />
          </div>
        </aside>

        {/* Main content */}
        <main className="lg:col-span-3">
          <div className="max-w-4xl">
            {/* Header */}
            <header className="mb-8">
              <Link 
                href="/docs/typist"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Typist Overview
              </Link>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Typist Guide
              </h1>
              
              <p className="text-xl text-gray-600 mb-6">
                A step-by-step walkthrough of typist's core concepts with practical examples and interactive demonstrations.
              </p>
            </header>

            {/* Guided Tour Section */}
            <section className="mb-12">
              <div className="space-y-8">
                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Modeling user systems</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    We can use <code>is_</code> to assert that values belong to a given type, invalid assertions will produce TypeScript errors. 
                    We can leverage <code>@ts-expect-error</code> to write negative tests that ensure certain values do not conform to expected types.
                  </p>
                  
                  <Code language="typescript">{`type Positive = '👍' | '👌' | '🎉' | '😊'

is_<Positive>('🎉') // ✓

// @ts-expect-error ✓
// type '👎' is not assignable to type 'Positive'.
is_<Positive>('👎')`}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Different assignment behaviors</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Let's try out different assignment behaviors with const values and string types.
                  </p>
                  
                  <Code language="typescript">{`const smile = '😊'

is_<string>(smile) // ✓
is_<Positive>(smile) // ✓
is_<'😓'|'😊'>(smile) // ✓

const party:string = '🎉' 

is_<string>(party) // ✓

// @ts-expect-error ✓
// type 'string' is not assignable to type 'Positive'.
is_<Positive>(party)`}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Type specificity with extends</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Use <code>extends_</code> to prove that one type is more specific than another.
                  </p>
                  
                  <Code language="typescript">{`type Reaction = '👍' | '👎' | '👌' | '🎉' | '😊' | '😢' | '❓' | '💡'

extends_<Positive, Reaction>() // ✓

// @ts-expect-error ✓
// type 'Reactions' does not satisfy the constraint 'Positive'
extends_<Reaction, Positive>()

// @ts-expect-error ✓
// type 'Positive' does not satisfy the constraint '👍'.
//  type '😊' is not assignable to type '👍'.
extends_<Positive, '👍'>()`}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Using runtime identifiers</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    We can use runtime identifiers as either regular arguments <code>(t:T)</code>, or as type arguments <code>&lt;T&gt;</code> by extracting their types using <code>typeof</code>.
                  </p>
                  
                  <Code language="typescript">{`export const random
  = <T>( arr: T[] ): T =>
  { const und = (v: unknown): v is undefined => v === void 0
    const between
      = (a1?: number, a2?: number): number =>
      { let min: number, max: number
        if (und(a1)) min = 0, max = 100
        else if (und(a2)) max = a1, min = 0
        else max = a2, min = a1
        const { floor, random } = Math
        return floor(random() * (max - min + 1)) + min }
    return arr[ between(0, arr.length - 1) ] as T }

const hand = random(['👍','👎','👌'] as const)

is_<Reaction>(hand) // ✓

// @ts-expect-error ✓
// type '👎' is not assignable to type 'Positive'
is_<Positive>(hand)

is_<typeof hand>('👍') // ✓
is_<typeof hand>('👎') // ✓`}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Type identifiers and phantom values</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Likewise, we can use type identifiers as type arguments <code>&lt;T&gt;</code>, or as regular arguments <code>(t:T)</code> by creating a phantom value.
                  </p>
                  
                  <Code language="typescript">{`type Hand = '👍' | '👎' | '👌'

extends_<Hand, Reaction>() // ✓
extends_(hand, t_<Reaction>()) // ✓

is_<Hand>(hand) // ✓
is_<typeof hand>(t_<Hand>()) // ✓`}</Code>
                </div>
              </div>
              
              {/* Try it in Typescape */}
              <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      Try it in Typescape
                      <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full font-medium">Interactive</span>
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Experiment with emoji types, basic assertions, and phantom values in an interactive TypeScript environment.
                    </p>
                    <a 
                      href="/labs/type-explorer?example=typist-basics"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Launch Typescape
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Visual Separator */}
            {/* <div className="mb-12">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-6 bg-white text-gray-500 font-medium">Advanced Example</span>
                </div>
              </div>
            </div> */}

            {/* Deep Structure Testing Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Domain Modeling</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Nested and derived structures</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Let's model a user system with different access levels. We can use typist to prove 
                    properties about these types both at the type level and with runtime objects. 
                    We can drill deeply into runtime and type-level structures following the same principles.
                  </p>
                  
                  <Code language="typescript">{`type RegularUser = { name:string }
type PremiumUser = RegularUser & { premiumSince:Date }
type User = RegularUser | PremiumUser

has_<'name', string>(t_<User>()) // ✓

// @ts-expect-error ✓
// property 'premiumSince' is missing in type 'RegularUser'
has_<'premiumSince', string>(t_<User>()) // ✓`}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Working with runtime objects</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Testing properties and types with actual runtime objects.
                  </p>
                  
                  <Code language="typescript">{`const alice = { name:'alice' } as const
const bob = { name:'bob', premiumSince:new Date('2022-01-01') } as const

has_<'name', string>(bob) // ✓
has_<'premiumSince', Date>(bob) // ✓

is_<typeof bob['premiumSince']>(t_<Date>()) // ✓

is_<PremiumUser>(bob) // ✓
extends_<typeof bob, RegularUser>() // ✓

is_<User['name']>(alice.name) // ✓
is_<'alice'>(alice.name) // ✓

// @ts-expect-error ✓
// type 'alice' is not assignable to type 'bob'
is_<'bob'>(alice.name) // ✓

// @ts-expect-error ✓
// property 'premiumSince' missing
has_<'premiumSince', Date>(alice)

// @ts-expect-error ✓
// property 'premiumSince' missing
is_<PremiumUser>(alice)`}</Code>
                </div>
              </div>
          
            </section>

            {/* Type Guards and Control Flow Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Type guards and control flow</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Contextual invariants</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    We can assert invariants that are contextual to our type guards and control flow logic. 
                    This demonstrates how typist works within TypeScript's control flow analysis to provide 
                    different type assertions based on runtime conditions.
                  </p>
                  
                  <Code language="typescript">{`type ExclusiveReaction = '💎' | '🐸'

type PremiumFeedback 
  = { user:PremiumUser, 
      reaction:Reaction | ExclusiveReaction, 
      text:string }

type RegularFeedback
  = { user:RegularUser,
      reaction:Reaction,
      text:string }

type Feedback 
  = RegularFeedback | PremiumFeedback

const isPremiumUser 
  = (user:User): user is PremiumUser => 
    'premiumSince' in user

const isPremiumFeedback
  = (feedback:Feedback): feedback is PremiumFeedback => 
    isPremiumUser(feedback.user)

const getFeedback 
  = async (): Promise<Feedback> => t_<Feedback>()`}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Control flow assertions</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Using type guards to create different assertion contexts within control flow. 
                    When TypeScript narrows the types through the guard functions, typist can make 
                    different assertions in each branch. Notice how the same assertion succeeds 
                    in one branch but fails in another, demonstrating the contextual nature of 
                    type-level proofs.
                  </p>
                  
                  <Code language="typescript">{`const feedback0 = await getFeedback()

if (isPremiumFeedback(feedback0))
  { extends_<ExclusiveReaction, typeof feedback0.reaction>() // ✓
    is_<PremiumUser>(feedback0.user) // ✓ 
    has_<'premiumSince'>(feedback0.user) } // ✓
else 
  { // @ts-expect-error ✓ 
    // type '"💎"' is not assignable to type 'Reaction'
    extends_<ExclusiveReaction, typeof feedback0.reaction>() // ✓ 
    
    // @ts-expect-error ✓
    // type 'RegularUser' is not assignable to parameter of type 'PremiumUser'
    is_<PremiumUser>(feedback0.user) 

    is_<RegularUser>(feedback0.user) } // ✓`}</Code>
    
                  {/* Try it in Typescape */}
              <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      Try it in Typescape
                      <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full font-medium">Interactive</span>
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Explore user domain modeling, feedback systems, and type guards with control flow in an interactive environment.
                    </p>
                    <a 
                      href="/labs/type-explorer?example=typist-guards"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Launch Typescape
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
                  
                  <p className="text-lg text-gray-600 mt-4">
                    This pattern shows how typist integrates with TypeScript's type system to provide 
                    compile-time verification that respects runtime control flow. The type assertions 
                    that work in one context may fail in another, providing precise feedback about 
                    what your types guarantee in each execution path.
                  </p>
                </div>
              </div>
              
            </section>

            {/* Navigation */}
            <section className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <Link 
                  href="/docs/typist"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Overview
                </Link>
                
                <Link 
                  href="/docs/typist/quick-start"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Continue to Quick Start
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}