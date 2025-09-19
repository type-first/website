export const comparisonsSnippet 
  = /* ts */ `
// Type comparison examples with verdicts
import { $Equal, $Extends, yes_, no_, decidable_ } from '@type-first/typist';

// Test if types are equal
type StringsEqual = $Equal<string, string>;     // $Yes
type NumberStringEqual = $Equal<number, string>; // $No<...>

// Assert the results
yes_<typeof StringsEqual>();       // ✅ compiles
no_<typeof NumberStringEqual>();   // ✅ compiles

// Test type relationships
type LiteralExtendsString = $Extends<"hello", string>; // $Yes
type StringExtendsLiteral = $Extends<string, "hello">; // $No<...>

// Complex type comparisons
type User = { name: string; age: number };
type PartialUser = { name: string };
type ExtendedUser = { name: string; age: number; email: string };

// Structural subtyping tests
yes_<$Extends<ExtendedUser, User>>();   // ✅ more props extends fewer
no_<$Extends<User, ExtendedUser>>();    // ❌ fewer props doesn't extend more
yes_<$Extends<User, PartialUser>>();    // ✅ has required property

// Exact shape tests
no_<$Equal<User, ExtendedUser>>();      // ❌ different shapes
yes_<$Equal<User, { name: string; age: number }>>();  // ✅ same shape
`