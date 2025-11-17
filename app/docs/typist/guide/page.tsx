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
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Basic type assertions</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    We can use <code>is_</code> to assert that values belong to a given type, invalid assertions will produce TypeScript errors.
                    We can leverage <code>@ts-expect-error</code> to write negative tests that ensure certain values do not conform to expected types.
                  </p>
                  
                  <Code language="typescript">{`import { is_ } from '@typefirst/typist'

type Positive = '👍' | '👌' | '🎉' | '😊'

is_<Positive>('🎉') // ✓ 
// @ts-expect-error ✓
// 👎 is not assignable to Positive
is_<Positive>('👎') 

const smile = '😊'

is_<string>(smile) // ✓ 
is_<Positive>(smile) // ✓ 
is_<'😓'|'😊'>(smile) // ✓
// @ts-expect-error ✓
// 😊 is not assignable to 😓|👽
is_<'😓'|'👽'>(smile) `}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Type Relationship Testing</h3>
                  <p className="text-gray-600 mb-4">
                    Use <code>extends_</code> to prove that one type is more specific than another. This is 
                    powerful for building type hierarchies and ensuring your domain types have the correct 
                    relationships.
                  </p>
                  
                  <Code language="typescript">{`type Reaction = '👍' | '👎' | '👌' | '🎉' | '😊' | '😢' | '❓' | '💡'

extends_<Positive, Reaction>()  // ✓ Positive extends Reaction

// @ts-expect-error ✓
// type 'Reaction' does not satisfy the constraint 'Positive'
extends_<Reaction, Positive>()  // Error: Reaction is broader than Positive`}</Code>
                </div>
              </div>
            </section>

            {/* Advanced Property Testing Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Testing & Phantom Types</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Defining Domain Types</h3>
                  <p className="text-gray-600 mb-4">
                    Let's model a user system with different access levels. We can use typist to prove 
                    properties about these types both at the type level and with runtime objects.
                  </p>
                  
                  <Code language="typescript">{`type RegularUser = { name: string }
type PremiumUser = RegularUser & { premiumSince: Date }
type User = RegularUser | PremiumUser`}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Testing Type Properties</h3>
                  <p className="text-gray-600 mb-4">
                    Use <code>has_</code> to test whether a type has specific properties. Combined with <code>t_</code> 
                    (phantom types), you can perform these checks purely at the type level without runtime objects.
                  </p>
                  
                  <Code language="typescript">{`import { has_, t_ } from '@typefirst/typist'

has_<'name', string>(t_<User>()) // ✓ All users have a name

// @ts-expect-error ✓ 
// property 'premiumSince' is missing in type 'RegularUser'
has_<'premiumSince', Date>(t_<User>()) // Error: Not all users are premium`}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Runtime Object Validation</h3>
                  <p className="text-gray-600 mb-4">
                    The same property testing works seamlessly with actual runtime objects, letting you 
                    validate object structures and extract precise type information.
                  </p>
                  
                  <Code language="typescript">{`const alice = { name: 'alice' } as const
const bob = { name: 'bob', premiumSince: new Date('2022-01-01') } as const

has_<'name', string>(bob)           // ✓ Bob has a name
has_<'premiumSince', Date>(bob)     // ✓ Bob is premium
is_<PremiumUser>(bob)               // ✓ Bob is a premium user
extends_<typeof bob, RegularUser>() // ✓ Bob extends regular user

is_<User['name']>(alice.name)       // ✓ Alice's name fits User.name
is_<'alice'>(alice.name)            // ✓ Literal type assertion

// @ts-expect-error ✓
// type 'alice' is not assignable to type 'bob'
is_<'bob'>(alice.name)              // Error: Wrong literal type`}</Code>
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