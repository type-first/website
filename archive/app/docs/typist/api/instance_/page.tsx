import { notFound } from 'next/navigation';
import { getDocLibraryBySlug } from '@/lib/content/docs.registry.logic';
import { buildDocNavigation } from '@/lib/content/doc.model';
import { DocSidebar } from '@/lib/content/ui/doc/doc-sidebar.cmp.iso';
import { Code } from '@/lib/content/ui/code.cmp.iso';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata() {
  return {
    title: 'instance_ - Typist API Reference',
    description: 'Test that a value is an instance of a given class or constructor type using the instance_ function from Typist',
  };
}

export default function InstanceApiPage() {
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
                Back to Typist Documentation
              </Link>
              
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl font-bold text-gray-900">
                  <code>instance_</code>
                </h1>
                <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
                  Function
                </span>
              </div>
              
              <p className="text-xl text-gray-600 mb-6">
                Test that a value is an instance of a given class or constructor type. Validates class instantiation relationships.
              </p>
            </header>

            {/* Source Code */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Source Code</h2>
              <p className="text-lg text-gray-600 mb-6">
                The <code>instance_</code> function validates class instantiation using TypeScript's <code>InstanceType</code> utility and abstract constructor constraints.
              </p>
              
              <Code language="typescript">{`export const instance_ = <T extends abstract new (...args:any[]) => any>(x?:InstanceType<T>) => {}`}</Code>
            </section>

            {/* Signature */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Type Signature</h2>
              
              <Code language="typescript">{`function instance_<T extends abstract new (...args: any[]) => any>(x?: InstanceType<T>): void`}</Code>
              
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Parameters</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="flex">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded mr-3">x?: InstanceType&lt;T&gt;</code>
                      <span className="text-gray-600">Optional value that must be an instance of constructor T</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Type Parameters</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="flex">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded mr-3">T extends abstract new (...args: any[]) =&gt; any</code>
                      <span className="text-gray-600">A constructor or class type (abstract or concrete)</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Returns</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="flex">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded mr-3">void</code>
                      <span className="text-gray-600">Used purely for compile-time type assertions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Basic Usage */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic Usage</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Class Instance Validation</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Test that a value is an instance of a specific class or constructor.
                  </p>
                  
                  <Code language="typescript">{`class User {
  constructor(public name: string) {}
}

class Admin extends User {
  constructor(name: string, public permissions: string[]) {
    super(name);
  }
}

const user = new User('Alice');
const admin = new Admin('Bob', ['read', 'write']);

// Valid instance checks
instance_<typeof User>(user)       // ✓ user is instance of User
instance_<typeof Admin>(admin)     // ✓ admin is instance of Admin
instance_<typeof User>(admin)      // ✓ admin is also instance of User (inheritance)`}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Built-in Constructor Types</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Works with built-in JavaScript constructor types.
                  </p>
                  
                  <Code language="typescript">{`const str = new String('hello');
const num = new Number(42);
const date = new Date();
const regex = /pattern/;

// Built-in type instances
instance_<typeof String>(str)      // ✓ String instance
instance_<typeof Number>(num)      // ✓ Number instance  
instance_<typeof Date>(date)       // ✓ Date instance
instance_<typeof RegExp>(regex)    // ✓ RegExp instance`}</Code>
                </div>
              </div>
            </section>

            {/* Advanced Patterns */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced Patterns</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Abstract Classes</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Test instances of abstract classes and their concrete implementations.
                  </p>
                  
                  <Code language="typescript">{`abstract class Shape {
  abstract getArea(): number;
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }
  
  getArea() {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }
  
  getArea() {
    return this.width * this.height;
  }
}

const circle = new Circle(5);
const rectangle = new Rectangle(4, 6);

// Abstract class instance checking
instance_<typeof Shape>(circle)     // ✓ Circle extends Shape
instance_<typeof Shape>(rectangle)  // ✓ Rectangle extends Shape  
instance_<typeof Circle>(circle)    // ✓ Specific type check`}</Code>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Generic Classes</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    Validate instances of generic classes with type parameters.
                  </p>
                  
                  <Code language="typescript">{`class Container<T> {
  constructor(public value: T) {}
}

class NumberContainer extends Container<number> {
  constructor(value: number) {
    super(value);
  }
}

const stringContainer = new Container('hello');
const numberContainer = new NumberContainer(42);

// Generic class instances
instance_<typeof Container>(stringContainer)    // ✓ Container instance
instance_<typeof Container>(numberContainer)    // ✓ NumberContainer extends Container
instance_<typeof NumberContainer>(numberContainer) // ✓ Specific type check`}</Code>
                </div>
              </div>
            </section>

            {/* Navigation */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">API Reference</h2>
              <div className="flex items-center gap-4">
                <Link 
                  href="/docs/typist/api/has_"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Previous: has_
                </Link>
                <Link 
                  href="/docs/typist/api/never_"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next: never_
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}