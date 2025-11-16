import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { buildDocNavigation } from '@/lib/content/doc.model';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { Code } from '@/lib/content/ui/code.cmp.iso';
import { CodeExplorerLink } from '@/lib/content/ui/link.code-explorer.cmp.iso';
import { Calendar, User, Book, ExternalLink, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata() {
  const library = getDocLibraryBySlug('typist');
  
  return {
    title: `${library?.name} Documentation`,
    description: library?.description,
  };
}

export default function TypistOverviewPage() {
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
              {library.coverImgUrl && (
                <div className="mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
                  <div className="relative w-full" style={{ aspectRatio: '2539 / 771' }}>
                    <img 
                      src={library.coverImgUrl} 
                      alt={library.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {library.logoUrl ? (
                    <img 
                      src={library.logoUrl} 
                      alt={`${library.name} logo`}
                      className="h-8 w-8 flex-shrink-0 rounded-md"
                    />
                  ) : (
                    <Book className="h-8 w-8 text-blue-600" strokeWidth={1.8} />
                  )}
                  <h1 className="text-4xl font-bold text-gray-900">
                    typist
                  </h1>
                </div>
                
                <div className="flex gap-3">
                  {library.githubUrl && (
                    <a 
                      href={library.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
                      GitHub
                    </a>
                  )}
                  {library.npmPackage && (
                    <a 
                      href={`https://www.npmjs.com/package/${library.npmPackage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      <Package className="h-4 w-4" strokeWidth={1.8} />
                      npm
                    </a>
                  )}
                </div>
              </div>
              
              <p className="text-xl text-gray-600 mb-6">
                a powerful toolkit for static analysis, symbolic testing, and phantom type operations. Build type-safe applications with confidence using composable constraints and static proofs.
              </p>
              
              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" strokeWidth={1.8} />
                  santiago elustondo
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" strokeWidth={1.8} />
                  Updated {new Date('2025-11-15').toLocaleDateString()}
                </div>
                {library.version && (
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" strokeWidth={1.8} />
                    v{library.version}
                  </div>
                )}
              </div>
              
              {/* Tags */}
              {library.tags && library.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {library.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <section className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Link 
                  href="/docs/typist/installation"
                  className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">installation</h3>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-gray-600">
                    install and configure typist in your TypeScript project with our step-by-step guide.
                  </p>
                </Link>
                
                <Link 
                  href="/docs/typist/quick-start"
                  className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">quick start</h3>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-gray-600">
                    jump into typist with practical examples and learn the core concepts through hands-on coding.
                  </p>
                </Link>
              </div>
            </section>

            {/* Introduction Content */}
            <section className="mb-12">

              <h2 className="text-2xl font-bold text-gray-900 mb-6">show what your types are made of</h2>
              
              <div className="mb-6">
                <p className="text-lg text-gray-600 mb-4">
                  <code>typist</code> is a minimal suite for compilable static proofs at the type level. 
                  it provides four core functions—<code>is_</code>, <code>extends_</code>, <code>has_</code>, and <code>t_</code>—that 
                  let you encode assertions and validations with zero runtime overhead.
                </p>
                <p className="text-lg text-gray-600">
                  whether you're building type-safe APIs, enforcing domain constraints, or creating 
                  self-documenting interfaces, <code>typist</code> gives you the tools to <em className=''>prove your types work</em> 
                  before your code runs.
                </p>
              </div>

              <Code language="typescript">{`import { is_ } from '@typefirst/typist'
type Positive = '👍' | '👌' | '🎉' | '😊'
is_<Positive>('🎉') // ✓ 
// @ts-expect-error ✓
// 👎 is not assignable to Positive
is_<Positive>('👎') `}</Code>


            </section>
            

            {/* Guided Tour Section */}
            <section className="mb-12">
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">basic type assertions</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    we can use <code>is_</code> to assert that values belong to a given type, invalid assertions will produce TypeScript errors.
                    we can leverage <code>@ts-expect-error</code> to write negative tests that ensure certain values do not conform to expected types.
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

            {/* Core Concepts */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Core Functions</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="block p-6 bg-white border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">is_&lt;T&gt;(value)</h3>
                  <p className="text-gray-600">
                    Assert that a value is assignable to type T. Works with both runtime values and phantom types.
                  </p>
                </div>
                
                <div className="block p-6 bg-white border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">extends_&lt;A, B&gt;()</h3>
                  <p className="text-gray-600">
                    Prove that type A extends type B. Essential for type relationship validation.
                  </p>
                </div>
                
                <div className="block p-6 bg-white border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">has_&lt;K, T&gt;(obj)</h3>
                  <p className="text-gray-600">
                    Test that an object has property K of type T. Works with complex nested structures.
                  </p>
                </div>
                
                <div className="block p-6 bg-white border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">t_&lt;T&gt;()</h3>
                  <p className="text-gray-600">
                    Create phantom values for pure type-level operations without runtime overhead.
                  </p>
                </div>
              </div>
            </section>

            {/* Interactive Learning Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Interactive Learning</h2>
              <p className="text-gray-600 mb-6">
                Master typist concepts through hands-on practice with our interactive scenarios in the Type Explorer:
              </p>
              
              <div className="grid gap-4">
                <CodeExplorerLink
                  slug="typist-phantom-types-basics"
                  name="Phantom Types Basics"
                  description="Learn the fundamentals of phantom types and type-level programming with typist. Create phantom values and build branded types."
                />
                
                <CodeExplorerLink
                  slug="typist-type-comparisons"
                  name="Type Comparisons & Assertions"
                  description="Master type-level comparisons using is_, extends_, and has_. Learn to create compile-time assertions and property tests."
                />
                
                <CodeExplorerLink
                  slug="typist-advanced-patterns"
                  name="Advanced Type-Level Patterns"
                  description="Explore advanced type-level programming patterns. Build complex type computations, state machines, and compile-time proofs."
                />
              </div>
            </section>

            {/* Navigation to all pages */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Documentation</h2>
              
              <div className="space-y-4">
                {navigationPages.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/docs/typist/${page.slug}`}
                    className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{page.title}</h3>
                        <p className="text-gray-600">{page.description}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}