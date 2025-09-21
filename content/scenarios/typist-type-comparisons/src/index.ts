// Type Comparisons Demo
//
// This scenario demonstrates TypeScript's type system through comparisons
// using $Equal and $Extends from the typist library. These utilities help
// verify type relationships and test type-level logic.

// === Core Types ===
// Re-export the fundamental comparison operators
export type { $Equal, $Extends } from './basic-comparisons';

// === Module Re-exports ===
// Import and re-export all modules to avoid naming conflicts

// Core comparison operators and primitive types
import * as BasicComparisons from './basic-comparisons';
export { BasicComparisons };

// Object interfaces, structural typing, and property modifiers  
import * as ObjectComparisons from './object-comparisons';
export { ObjectComparisons };

// Function signatures, parameters, and variance
import * as FunctionComparisons from './function-comparisons';
export { FunctionComparisons };

// Arrays, tuples, and length relationships
import * as ArrayTupleComparisons from './array-tuple-comparisons';
export { ArrayTupleComparisons };

// Utility types, mapped types, and transformations
import * as UtilityMappedComparisons from './utility-mapped-comparisons';
export { UtilityMappedComparisons };

// === Quick Reference Examples ===

import type { $Equal, $Extends } from './basic-comparisons';

// Basic demonstration of the comparison utilities
export type ExampleStringLiteralExtendsString = $Extends<'hello', string>;          // true
export type ExampleStringEqualsStringLiteral = $Equal<string, 'hello'>;             // false
export type ExampleUnionEquality = $Equal<string | number, number | string>;        // true (order doesn't matter)

// === Learning Path ===

/*
1. Start with BasicComparisons to understand $Equal and $Extends
2. Explore ObjectComparisons for structural typing concepts
3. Study FunctionComparisons for function variance and assignability
4. Learn ArrayTupleComparisons for collection type relationships
5. Master UtilityMappedComparisons for advanced type transformations

Each module builds upon the previous concepts, creating a comprehensive
understanding of TypeScript's type system and how type relationships work.

Access examples via the exported namespaces:
- BasicComparisons.StringEqualsString
- ObjectComparisons.PersonExtendsEmployee
- FunctionComparisons.NumberToStringExtendsNumberToAny
- ArrayTupleComparisons.TupleExtendsArray
- UtilityMappedComparisons.PartialUserExtendsUser
*/

console.log('✅ Type comparison scenario loaded successfully');
console.log('🔍 Explore the relationships between different TypeScript types');
console.log('📚 Learn how $Equal and $Extends work in practice');
console.log('⚡ Understand structural typing, variance, and type assignability');
console.log('📂 Check out individual modules for focused learning topics');