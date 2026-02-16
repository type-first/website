export const assertionsSnippet 
  = /* ts */ `
// Static type assertions and testing
import { is_, has_, extends_, instance_, never_, yes_, no_ } from '@typefirst/typist';

// Basic type assertions
is_<string>("hello");        // ✅ compiles
// is_<number>("hello");     // ❌ type error

// Property assertions
has_<"name", string>({ name: "John", age: 30 });     // ✅ has name: string
has_<"age", number>({ name: "John", age: 30 });      // ✅ has age: number
// has_<"email", string>({ name: "John", age: 30 }); // ❌ missing email property

// Type extension assertions
extends_<string, "hello">();     // ✅ literal extends string
extends_<any, string>();         // ✅ string extends any
// extends_<"hello", string>();  // ❌ string doesn't extend literal

// Verdict assertions
yes_<$Equal<string, string>>();        // ✅ accepts $Yes
no_<$Equal<string, number>>();         // ✅ accepts $No

// Exhaustive checking with never
type Color = 'red' | 'green' | 'blue';

function handleColor(color: Color) {
  switch (color) {
    case 'red':
      return 'Red color';
    case 'green':
      return 'Green color';
    case 'blue':
      return 'Blue color';
    default:
      return never_(color); // ✅ ensures all cases handled
  }
}
`